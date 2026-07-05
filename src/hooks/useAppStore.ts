import { useState, useCallback, useEffect } from 'react';
import type { Lang } from '../data/translations';
import type { Reaction, FoodLog } from '../data/foods';

export type FeedingMethod = 'BLW' | 'BLISS' | 'Purés';
export type Screen = 'login' | 'onboarding' | 'home' | 'food-detail' | 'shopping' | 'fridge' | 'profile' | 'world-recipes' | 'admin';

export interface BabyProfile {
  name: string;
  birthDate: string;
}

export interface ShoppingItem {
  id: string;
  nameEs: string;
  nameEn: string;
  tag: 'baby' | 'mom';
  checked: boolean;
}

interface AppState {
  lang: Lang;
  method: FeedingMethod;
  screen: Screen;
  selectedFoodId: string | null;
  baby: BabyProfile;
  foodLogs: Record<string, FoodLog>;
  shoppingList: ShoppingItem[];
  ageFilter: 6 | 8 | 12;
  userEmail: string | null;
}

const SESSION_KEY = 'maminu_session';

const getInitialState = (): AppState => {
  const email = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
  return {
    lang: 'es',
    method: 'BLW',
    screen: email ? 'onboarding' : 'login',
    selectedFoodId: null,
    baby: { name: '', birthDate: '' },
    foodLogs: {},
    shoppingList: [],
    ageFilter: 6,
    userEmail: email,
  };
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    const onStorage = () => {
      const email = localStorage.getItem(SESSION_KEY);
      setState(s => ({ ...s, userEmail: email, screen: email ? s.screen : 'login' }));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLang = useCallback((lang: Lang) => setState(s => ({ ...s, lang })), []);
  const setMethod = useCallback((method: FeedingMethod) => setState(s => ({ ...s, method })), []);

  const navigateTo = useCallback((screen: Screen, foodId?: string) => {
    setState(s => ({ ...s, screen, selectedFoodId: foodId ?? s.selectedFoodId }));
  }, []);

  const setAgeFilter = useCallback((age: 6 | 8 | 12) => setState(s => ({ ...s, ageFilter: age })), []);

  const saveLog = useCallback((foodId: string, log: Partial<FoodLog>) => {
    setState(s => ({
      ...s,
      foodLogs: {
        ...s.foodLogs,
        [foodId]: {
          foodId,
          tried: log.tried ?? false,
          reaction: log.reaction ?? null,
          notes: log.notes ?? '',
          date: log.date ?? new Date().toISOString().split('T')[0],
        },
      },
    }));
  }, []);

  const quickLog = useCallback((foodId: string, reaction: Reaction) => {
    setState(s => ({
      ...s,
      foodLogs: {
        ...s.foodLogs,
        [foodId]: {
          foodId,
          tried: true,
          reaction,
          notes: '',
          date: new Date().toISOString().split('T')[0],
        },
      },
    }));
  }, []);

  const addToShoppingList = useCallback((items: Omit<ShoppingItem, 'id' | 'checked'>[]) => {
    setState(s => {
      const existing = new Set(s.shoppingList.map(i => i.nameEs));
      const newItems: ShoppingItem[] = items
        .filter(i => !existing.has(i.nameEs))
        .map(i => ({ ...i, id: `sl-${Date.now()}-${Math.random()}`, checked: false }));
      return { ...s, shoppingList: [...s.shoppingList, ...newItems] };
    });
  }, []);

  const toggleShoppingItem = useCallback((id: string) => {
    setState(s => ({
      ...s,
      shoppingList: s.shoppingList.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  }, []);

  const clearCheckedItems = useCallback(() => {
    setState(s => ({ ...s, shoppingList: s.shoppingList.filter(i => !i.checked) }));
  }, []);

  const completeOnboarding = useCallback((name: string, birthDate: string, method: FeedingMethod) => {
    setState(s => ({ ...s, baby: { name, birthDate }, method, screen: 'home' }));
  }, []);

  const loginUser = useCallback((email: string) => {
    localStorage.setItem(SESSION_KEY, email);
    setState(s => ({ ...s, userEmail: email, screen: 'onboarding' }));
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setState(s => ({ ...s, userEmail: null, screen: 'login' }));
  }, []);

  const triedFoodIds = Object.keys(state.foodLogs).filter(id => state.foodLogs[id].tried);

  const getBabyAgeMonths = () => {
    if (!state.baby.birthDate) return 0;
    const birth = new Date(state.baby.birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  };

  return {
    ...state,
    setLang,
    setMethod,
    navigateTo,
    setAgeFilter,
    saveLog,
    quickLog,
    addToShoppingList,
    toggleShoppingItem,
    clearCheckedItems,
    triedFoodIds,
    getBabyAgeMonths,
    completeOnboarding,
    loginUser,
    logoutUser,
  };
}
