import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Lang } from '../data/translations';
import type { Reaction, FoodLog } from '../data/foods';
import { FOODS } from '../data/foods';

export type FeedingMethod = 'BLW' | 'BLISS' | 'Purés';
export type Screen = 'login' | 'onboarding' | 'home' | 'food-detail' | 'shopping' | 'fridge' | 'profile' | 'world-recipes' | 'admin' | 'my-week';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;
  method: FeedingMethod;
  ownerId: string;
}

export type ShoppingSection = 'produce' | 'protein' | 'dairy' | 'pantry';

export interface ShoppingItem {
  id: string;
  nameEs: string;
  nameEn: string;
  tag: 'baby' | 'mom';
  section: ShoppingSection;
  quantity: number;
  checked: boolean;
}

export type ShoppingInput = Omit<ShoppingItem, 'id' | 'checked' | 'section' | 'quantity'> & {
  section?: ShoppingSection;
  quantity?: number;
};

export interface BabyShare {
  id: string;
  babyId: string;
  invitedEmail: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'revoked';
  token: string;
}

interface AppState {
  lang: Lang;
  screen: Screen;
  selectedFoodId: string | null;
  babies: BabyProfile[];
  activeBabyId: string | null;
  foodLogs: Record<string, FoodLog>;
  shoppingList: ShoppingItem[];
  pantry: Set<string>;
  weekPlanBlob: unknown | null;
  ageFilter: 6 | 8 | 12;
  userEmail: string | null;
  userId: string | null;
  isAdmin: boolean;
  loading: boolean;
}

const INITIAL_STATE: AppState = {
  lang: 'es',
  screen: 'login',
  selectedFoodId: null,
  babies: [],
  activeBabyId: null,
  foodLogs: {},
  shoppingList: [],
  pantry: new Set(),
  weekPlanBlob: null,
  ageFilter: 6,
  userEmail: null,
  userId: null,
  isAdmin: false,
  loading: false,
};

const EMPTY_BABY: BabyProfile = { id: '', name: '', birthDate: '', method: 'BLW', ownerId: '' };

function currentMonday(): string {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const lastLoadedBabyRef = useRef<string | null>(null);

  const activeBaby: BabyProfile = state.babies.find(b => b.id === state.activeBabyId) ?? EMPTY_BABY;

  // ─── Hydrate on auth change ──────────────────────────────────────
  const hydrate = useCallback(async (email: string, userId: string) => {
    const [{ data: roles }, { data: profile }, { data: babyRows }] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId),
      supabase.from('profiles').select('active_baby_id, lang').eq('id', userId).maybeSingle() as any,
      supabase.from('baby_profiles').select('id, user_id, name, birth_date, method').order('created_at', { ascending: true }),
    ]);

    const isAdmin = (roles ?? []).some(r => r.role === 'admin');
    const babies: BabyProfile[] = (babyRows ?? []).map((b: any) => ({
      id: b.id, name: b.name, birthDate: b.birth_date, method: b.method as FeedingMethod, ownerId: b.user_id,
    }));

    let activeId: string | null = profile?.active_baby_id ?? null;
    if (activeId && !babies.find(b => b.id === activeId)) activeId = null;
    if (!activeId && babies.length > 0) activeId = babies[0].id;

    setState(s => ({
      ...s,
      userEmail: email,
      userId,
      isAdmin,
      lang: (profile?.lang as Lang) ?? s.lang,
      babies,
      activeBabyId: activeId,
      screen:
        s.screen === 'login'
          ? babies.length === 0 ? 'onboarding' : 'home'
          : s.screen,
    }));
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setState({ ...INITIAL_STATE });
        return;
      }
      const u = session.user;
      if (u.email) void hydrate(u.email, u.id);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) void hydrate(data.session.user.email, data.session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [hydrate]);

  // ─── Load per-baby data when active baby changes ─────────────────
  useEffect(() => {
    if (!state.activeBabyId || !state.userId) return;
    if (lastLoadedBabyRef.current === state.activeBabyId) return;
    lastLoadedBabyRef.current = state.activeBabyId;

    const bid = state.activeBabyId;
    (async () => {
      const [{ data: shop }, { data: pant }, { data: tried }, { data: plan }] = await Promise.all([
        supabase.from('shopping_items').select('*').eq('baby_id', bid).order('created_at'),
        supabase.from('pantry_items').select('food_key').eq('baby_id', bid),
        supabase.from('tried_foods').select('food_id, reaction, notes, tried_on').eq('baby_id', bid),
        supabase.from('weekly_plans').select('slots, week_start').eq('baby_id', bid).order('week_start', { ascending: false }).limit(1).maybeSingle(),
      ]);

      const shoppingList: ShoppingItem[] = (shop ?? []).map((r: any) => ({
        id: r.id, nameEs: r.name_es, nameEn: r.name_en, tag: r.tag, section: r.section,
        quantity: r.quantity, checked: r.checked,
      }));
      const pantry = new Set<string>((pant ?? []).map((r: any) => r.food_key));
      const foodLogs: Record<string, FoodLog> = {};
      for (const r of (tried ?? []) as any[]) {
        foodLogs[r.food_id] = {
          foodId: r.food_id,
          tried: true,
          reaction: (r.reaction as Reaction) ?? null,
          notes: r.notes ?? '',
          date: r.tried_on ?? new Date().toISOString().slice(0, 10),
        };
      }
      setState(s => ({ ...s, shoppingList, pantry, foodLogs, weekPlanBlob: (plan as any)?.slots ?? null }));
    })();
  }, [state.activeBabyId, state.userId]);

  // ─── Basic setters ───────────────────────────────────────────────
  const setLang = useCallback((lang: Lang) => {
    setState(s => {
      if (s.userId) void supabase.from('profiles').update({ lang }).eq('id', s.userId);
      return { ...s, lang };
    });
  }, []);

  const setMethod = useCallback((method: FeedingMethod) => {
    setState(s => {
      if (s.activeBabyId) {
        void supabase.from('baby_profiles').update({ method }).eq('id', s.activeBabyId);
      }
      return {
        ...s,
        babies: s.babies.map(b => b.id === s.activeBabyId ? { ...b, method } : b),
      };
    });
  }, []);

  const updateBaby = useCallback(async (updates: { name?: string; birthDate?: string }) => {
    let babyId: string | null = null;
    setState(s => {
      babyId = s.activeBabyId;
      if (!babyId) return s;
      return {
        ...s,
        babies: s.babies.map(b => b.id === babyId ? {
          ...b,
          name: updates.name ?? b.name,
          birthDate: updates.birthDate ?? b.birthDate,
        } : b),
      };
    });
    if (!babyId) return;
    const payload: Record<string, string> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.birthDate !== undefined) payload.birth_date = updates.birthDate;
    if (Object.keys(payload).length) {
      await supabase.from('baby_profiles').update(payload).eq('id', babyId);
    }
  }, []);

  const navigateTo = useCallback((screen: Screen, foodId?: string) => {
    setState(s => ({ ...s, screen, selectedFoodId: foodId ?? s.selectedFoodId }));
  }, []);

  const setAgeFilter = useCallback((age: 6 | 8 | 12) => setState(s => ({ ...s, ageFilter: age })), []);

  // ─── Babies ──────────────────────────────────────────────────────
  const addBaby = useCallback(async (name: string, birthDate: string, method: FeedingMethod) => {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) return null;
    const { data, error } = await supabase.from('baby_profiles')
      .insert({ user_id: uid, name, birth_date: birthDate, method })
      .select('id, user_id, name, birth_date, method').single();
    if (error || !data) return null;
    const b: BabyProfile = { id: data.id, name: data.name, birthDate: data.birth_date, method: data.method as FeedingMethod, ownerId: data.user_id };
    await supabase.from('profiles').update({ active_baby_id: b.id }).eq('id', uid);
    lastLoadedBabyRef.current = null;
    setState(s => ({ ...s, babies: [...s.babies, b], activeBabyId: b.id, screen: 'home' }));
    return b;
  }, []);

  const completeOnboarding = useCallback(async (name: string, birthDate: string, method: FeedingMethod) => {
    await addBaby(name, birthDate, method);
  }, [addBaby]);

  const setActiveBaby = useCallback(async (babyId: string) => {
    if (!state.userId) return;
    await supabase.from('profiles').update({ active_baby_id: babyId }).eq('id', state.userId);
    lastLoadedBabyRef.current = null;
    setState(s => ({ ...s, activeBabyId: babyId }));
  }, [state.userId]);

  // ─── Food logs / tried ───────────────────────────────────────────
  const persistTried = useCallback(async (log: FoodLog) => {
    const bid = state.activeBabyId;
    if (!bid) return;
    await supabase.from('tried_foods').upsert({
      baby_id: bid, food_id: log.foodId, reaction: log.reaction, notes: log.notes, tried_on: log.date,
    }, { onConflict: 'baby_id,food_id' });
  }, [state.activeBabyId]);

  const saveLog = useCallback((foodId: string, log: Partial<FoodLog>) => {
    const full: FoodLog = {
      foodId,
      tried: log.tried ?? false,
      reaction: log.reaction ?? null,
      notes: log.notes ?? '',
      date: log.date ?? new Date().toISOString().slice(0, 10),
    };
    setState(s => ({ ...s, foodLogs: { ...s.foodLogs, [foodId]: full } }));
    if (full.tried) void persistTried(full);
  }, [persistTried]);

  const quickLog = useCallback((foodId: string, reaction: Reaction) => {
    const full: FoodLog = { foodId, tried: true, reaction, notes: '', date: new Date().toISOString().slice(0, 10) };
    setState(s => ({ ...s, foodLogs: { ...s.foodLogs, [foodId]: full } }));
    void persistTried(full);
  }, [persistTried]);

  // ─── Shopping ────────────────────────────────────────────────────
  const addToShoppingList = useCallback((items: ShoppingInput[]) => {
    const bid = state.activeBabyId;
    if (!bid) return;
    setState(s => {
      const next = [...s.shoppingList];
      const inserts: any[] = [];
      const updates: { id: string; quantity: number }[] = [];
      for (const raw of items) {
        const qty = raw.quantity ?? 1;
        const section = raw.section ?? 'pantry';
        const idx = next.findIndex(i => i.nameEs.trim().toLowerCase() === raw.nameEs.trim().toLowerCase());
        if (idx >= 0) {
          const merged = { ...next[idx], quantity: next[idx].quantity + qty };
          next[idx] = merged;
          updates.push({ id: merged.id, quantity: merged.quantity });
        } else {
          const tempId = `sl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          next.push({ id: tempId, nameEs: raw.nameEs, nameEn: raw.nameEn, tag: raw.tag, section, quantity: qty, checked: false });
          inserts.push({ baby_id: bid, name_es: raw.nameEs, name_en: raw.nameEn, tag: raw.tag, section, quantity: qty });
        }
      }
      (async () => {
        for (const u of updates) await supabase.from('shopping_items').update({ quantity: u.quantity }).eq('id', u.id);
        if (inserts.length) {
          const { data } = await supabase.from('shopping_items').insert(inserts).select('*');
          if (data) {
            setState(cur => {
              const list = [...cur.shoppingList];
              // Replace temp entries by name match with real DB rows (best-effort)
              for (const row of data as any[]) {
                const idx = list.findIndex(i => i.nameEs === row.name_es && i.id.startsWith('sl-'));
                if (idx >= 0) list[idx] = {
                  id: row.id, nameEs: row.name_es, nameEn: row.name_en, tag: row.tag,
                  section: row.section, quantity: row.quantity, checked: row.checked,
                };
              }
              return { ...cur, shoppingList: list };
            });
          }
        }
      })();
      return { ...s, shoppingList: next };
    });
  }, [state.activeBabyId]);

  const addWeekToShoppingList = addToShoppingList;

  const toggleShoppingItem = useCallback((id: string) => {
    setState(s => {
      const next = s.shoppingList.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
      const item = next.find(i => i.id === id);
      if (item) void supabase.from('shopping_items').update({ checked: item.checked }).eq('id', id);
      return { ...s, shoppingList: next };
    });
  }, []);

  const clearCheckedItems = useCallback(() => {
    setState(s => {
      const remove = s.shoppingList.filter(i => i.checked).map(i => i.id);
      if (remove.length) void supabase.from('shopping_items').delete().in('id', remove);
      return { ...s, shoppingList: s.shoppingList.filter(i => !i.checked) };
    });
  }, []);

  // ─── Pantry ──────────────────────────────────────────────────────
  const togglePantry = useCallback((foodKey: string) => {
    const bid = state.activeBabyId;
    if (!bid) return;
    const food = FOODS.find(f => f.id === foodKey);
    setState(s => {
      const next = new Set(s.pantry);
      if (next.has(foodKey)) {
        next.delete(foodKey);
        void supabase.from('pantry_items').delete().eq('baby_id', bid).eq('food_key', foodKey);
      } else {
        next.add(foodKey);
        void supabase.from('pantry_items').insert({
          baby_id: bid, food_key: foodKey,
          name_es: food?.nameEs ?? foodKey, name_en: food?.nameEn ?? foodKey,
        });
      }
      return { ...s, pantry: next };
    });
  }, [state.activeBabyId]);

  // ─── Weekly plan (blob) ──────────────────────────────────────────
  const saveWeekPlan = useCallback((plan: unknown) => {
    const bid = state.activeBabyId;
    if (!bid) return;
    setState(s => ({ ...s, weekPlanBlob: plan }));
    void supabase.from('weekly_plans').upsert(
      { baby_id: bid, week_start: currentMonday(), slots: plan as any, updated_at: new Date().toISOString() },
      { onConflict: 'baby_id,week_start' }
    );
  }, [state.activeBabyId]);

  // ─── Sharing ─────────────────────────────────────────────────────
  const shareBaby = useCallback(async (babyId: string, email: string, role: 'viewer' | 'editor') => {
    if (!state.userId) return null;
    const { data, error } = await supabase.from('baby_shares')
      .insert({ baby_id: babyId, owner_id: state.userId, invited_email: email.trim().toLowerCase(), role })
      .select('*').single();
    if (error || !data) return null;
    return data as any as { id: string; token: string };
  }, [state.userId]);

  const listShares = useCallback(async (babyId: string): Promise<BabyShare[]> => {
    const { data } = await supabase.from('baby_shares').select('*').eq('baby_id', babyId);
    return (data ?? []).map((r: any) => ({
      id: r.id, babyId: r.baby_id, invitedEmail: r.invited_email,
      role: r.role, status: r.status, token: r.token,
    }));
  }, []);

  const revokeShare = useCallback(async (shareId: string) => {
    await supabase.from('baby_shares').delete().eq('id', shareId);
  }, []);

  const acceptInvite = useCallback(async (token: string) => {
    if (!state.userId) return false;
    const { data } = await supabase.from('baby_shares')
      .update({ invited_user_id: state.userId, status: 'accepted' })
      .eq('token', token).eq('status', 'pending')
      .select('*').maybeSingle();
    if (data) {
      // Reload babies
      lastLoadedBabyRef.current = null;
      if (state.userEmail) await hydrate(state.userEmail, state.userId);
      return true;
    }
    return false;
  }, [state.userId, state.userEmail, hydrate]);

  // ─── Auth ────────────────────────────────────────────────────────
  const loginUser = useCallback((email: string) => {
    setState(s => ({ ...s, userEmail: email }));
  }, []);

  const logoutUser = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ ...INITIAL_STATE });
  }, []);

  // ─── Derived ─────────────────────────────────────────────────────
  const triedFoodIds = Object.keys(state.foodLogs).filter(id => state.foodLogs[id].tried);

  const getBabyAgeMonths = () => {
    if (!activeBaby.birthDate) return 0;
    const birth = new Date(activeBaby.birthDate);
    const now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  };

  return {
    ...state,
    baby: activeBaby, // backward-compat: exposes { id, name, birthDate, method, ownerId }
    activeBaby,
    method: activeBaby.method,
    setLang,
    setMethod,
    navigateTo,
    setAgeFilter,
    saveLog,
    quickLog,
    addToShoppingList,
    addWeekToShoppingList,
    toggleShoppingItem,
    clearCheckedItems,
    togglePantry,
    saveWeekPlan,
    triedFoodIds,
    getBabyAgeMonths,
    completeOnboarding,
    addBaby,
    setActiveBaby,
    shareBaby,
    listShares,
    revokeShare,
    acceptInvite,
    loginUser,
    logoutUser,
  };
}
