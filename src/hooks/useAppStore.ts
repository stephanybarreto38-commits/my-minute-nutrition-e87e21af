import { useState, useCallback } from 'react';
import type { Lang } from '../data/translations';
import type { Reaction, FoodLog } from '../data/foods';

export type FeedingMethod = 'BLW' | 'BLISS' | 'Purés';
export type Screen = 'onboarding' | 'home' | 'food-detail' | 'shopping' | 'fridge' | 'profile';

export interface BabyProfile {
  name: string;
  birthDate: string; // ISO string
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
  foodLogs: Record<string, FoodLog>; // keyed by foodId
  shoppingList: ShoppingItem[];
  ageFilter: 6 | 8 | 12;
}

const INITIAL_STATE: AppState = {
  lang: 'es',
  method: 'BLW',
  screen: 'onboarding',
  selectedFoodId: null,
  baby: {
    name: '',
    birthDate: '',
  },
  foodLogs: {},
  shoppingList: [],
  ageFilter: 6,
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const setLang = useCallback((lang: Lang) => {
    setState(s => ({ ...s, lang }));
  }, []);

  const setMethod = useCallback((method: FeedingMethod) => {
    setState(s => ({ ...s, method }));
  }, []);

  const navigateTo = useCallback((screen: Screen, foodId?: string) => {
    setState(s => ({
      ...s,
      screen,
      selectedFoodId: foodId ?? s.selectedFoodId,
    }));
  }, []);

  const setAgeFilter = useCallback((age: 6 | 8 | 12) => {
    setState(s => ({ ...s, ageFilter: age }));
  }, []);

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
        .map(i => ({
          ...i,
          id: `sl-${Date.now()}-${Math.random()}`,
          checked: false,
        }));
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
    setState(s => ({
      ...s,
      shoppingList: s.shoppingList.filter(i => !i.checked),
    }));
  }, []);

  const completeOnboarding = useCallback((name: string, birthDate: string, method: FeedingMethod) => {
    setState(s => ({
      ...s,
      baby: { name, birthDate },
      method,
      screen: 'home',
    }));
  }, []);

  // Derived values
  const triedFoodIds = Object.keys(state.foodLogs).filter(
    id => state.foodLogs[id].tried
  );

  const getBabyAgeMonths = () => {
    const birth = new Date(state.baby.birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12
      + now.getMonth() - birth.getMonth();
    return months;
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
  };
}
