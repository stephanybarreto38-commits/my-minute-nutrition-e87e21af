import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  userId: string | null;
  isAdmin: boolean;
}

const INITIAL_STATE: AppState = {
  lang: 'es',
  method: 'BLW',
  screen: 'login',
  selectedFoodId: null,
  baby: { name: '', birthDate: '' },
  foodLogs: {},
  shoppingList: [],
  ageFilter: 6,
  userEmail: null,
  userId: null,
  isAdmin: false,
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const hydrate = useCallback(async (email: string, userId: string) => {
    const [{ data: roles }, { data: babyRow }] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId),
      supabase
        .from('baby_profiles')
        .select('name, birth_date, method')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);
    const isAdmin = (roles ?? []).some(r => r.role === 'admin');
    setState(s => {
      const hasBaby = !!babyRow;
      return {
        ...s,
        userEmail: email,
        userId,
        isAdmin,
        baby: hasBaby
          ? { name: babyRow!.name, birthDate: babyRow!.birth_date }
          : s.baby,
        method: hasBaby ? (babyRow!.method as FeedingMethod) : s.method,
        screen:
          s.screen === 'login' || s.screen === 'onboarding'
            ? hasBaby
              ? 'home'
              : 'onboarding'
            : s.screen,
      };
    });
  }, []);

  useEffect(() => {
    // Listen first, then get current session
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setState(s => ({ ...s, userEmail: null, userId: null, isAdmin: false, screen: 'login' }));
        return;
      }
      const u = session.user;
      if (u.email) void hydrate(u.email, u.id);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        void hydrate(data.session.user.email, data.session.user.id);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [hydrate]);

  const setLang = useCallback((lang: Lang) => setState(s => ({ ...s, lang })), []);

  const setMethod = useCallback((method: FeedingMethod) => {
    setState(s => {
      if (s.userId && s.baby.name) {
        void supabase
          .from('baby_profiles')
          .update({ method })
          .eq('user_id', s.userId);
      }
      return { ...s, method };
    });
  }, []);

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

  const completeOnboarding = useCallback(async (name: string, birthDate: string, method: FeedingMethod) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user?.id;
    if (uid) {
      await supabase.from('baby_profiles').upsert(
        { user_id: uid, name, birth_date: birthDate, method },
        { onConflict: 'user_id' }
      );
    }
    setState(s => ({ ...s, baby: { name, birthDate }, method, screen: 'home' }));
  }, []);

  const loginUser = useCallback((email: string) => {
    // Session listener will hydrate isAdmin + set screen to onboarding
    setState(s => ({ ...s, userEmail: email, screen: 'onboarding' }));
  }, []);

  const logoutUser = useCallback(async () => {
    await supabase.auth.signOut();
    setState(s => ({
      ...s,
      userEmail: null,
      userId: null,
      isAdmin: false,
      screen: 'login',
      baby: { name: '', birthDate: '' },
      foodLogs: {},
      shoppingList: [],
    }));
  }, []);

  const triedFoodIds = Object.keys(state.foodLogs).filter(
    id => state.foodLogs[id].tried
  );

  const getBabyAgeMonths = () => {
    if (!state.baby.birthDate) return 0;
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
    loginUser,
    logoutUser,
  };
}
