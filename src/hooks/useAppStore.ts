import { useState, useCallback } from 'react';
import type { Lang } from '../data/translations';
import type { Reaction, FoodLog } from '../data/foods';

export type FeedingMethod = 'BLW' | 'BLISS' | 'Purés';
export type Screen = 'home' | 'food-detail' | 'shopping' | 'fridge' | 'profile';

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
  screen: 'home',
  selectedFoodId: null,
  baby: {
    name: 'Mia',
    birthDate: '2025-10-05',
  },
  foodLogs: {
    avocado:  { foodId: 'avocado',  tried: true, reaction: 'loved',  notes: '', date: '2026-06-01' },
    mango:    { foodId: 'mango',    tried: true, reaction: 'normal', notes: '', date: '2026-06-05' },
    banana:   { foodId: 'banana',   tried: true, reaction: 'normal', notes: '', date: '2026-06-08' },
    carrot:   { foodId: 'carrot',   tried: true, reaction: 'loved',  notes: '', date: '2026-06-10' },
    squash:   { foodId: 'squash',   tried: true, reaction: 'normal', notes: '', date: '2026-06-15' },
    chicken:  { foodId: 'chicken',  tried: true, reaction: 'loved',  notes: '', date: '2026-06-18' },
    lentils:  { foodId: 'lentils',  tried: true, reaction: 'normal', notes: '', date: '2026-06-20' },
  },
  shoppingList: [
    { id: 'sl-broc',   nameEs: 'Brócoli',       nameEn: 'Broccoli',       tag: 'baby', checked: false },
    { id: 'sl-eggs',   nameEs: 'Huevos',         nameEn: 'Eggs',           tag: 'baby', checked: false },
    { id: 'sl-avoc',   nameEs: 'Aguacate',       nameEn: 'Avocado',        tag: 'baby', checked: true  },
    { id: 'sl-tom',    nameEs: 'Tomate cherry',  nameEn: 'Cherry tomatoes',tag: 'mom',  checked: false },
    { id: 'sl-onion',  nameEs: 'Cebolla morada', nameEn: 'Red onion',      tag: 'mom',  checked: false },
    { id: 'sl-lemon',  nameEs: 'Limón',          nameEn: 'Lemon',          tag: 'mom',  checked: false },
  ],
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
  };
}
