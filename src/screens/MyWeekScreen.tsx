import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '../data/translations';
import type { FeedingMethod, ShoppingInput, ShoppingSection } from '../hooks/useAppStore';
import { FOODS } from '../data/foods';
import { RECIPES, type Recipe } from '../data/recipes';

interface Props {
  lang: Lang;
  currentMethod: FeedingMethod;
  babyMonths: number;
  userKey: string; // for persistence scoping
  onMethodChange?: (m: FeedingMethod) => void;
  onAddToShopping: (items: ShoppingInput[]) => void;
  onGoToShopping: () => void;
}

type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner';
type Section = ShoppingSection;

interface WeekConfig {
  method: FeedingMethod;
  ageMonths: number;
  meals: MealSlot[];
  allergies: string[]; // food ids
}

interface WeekPlan {
  config: WeekConfig;
  grid: (string | null)[][]; // [day 0..6][mealIndex] → recipeId
}

const ALL_MEALS: { key: MealSlot; es: string; en: string; emoji: string }[] = [
  { key: 'breakfast', es: 'Desayuno', en: 'Breakfast', emoji: '☀️' },
  { key: 'lunch',     es: 'Almuerzo', en: 'Lunch',     emoji: '🍽️' },
  { key: 'snack',     es: 'Merienda', en: 'Snack',     emoji: '🍎' },
  { key: 'dinner',    es: 'Cena',     en: 'Dinner',    emoji: '🌙' },
];

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Semáforo (4 estados) según edad del bebé y estado del alimento
type Signal = 'ready' | 'soon' | 'avoid' | 'unknown';
function foodSignal(foodId: string, ageMonths: number): Signal {
  const f = FOODS.find(x => x.id === foodId);
  if (!f) return 'unknown';
  if (f.status === 'avoid') return 'avoid';
  if (f.fromMonths <= ageMonths) return 'ready';
  if (f.fromMonths <= ageMonths + 2) return 'soon';
  return 'avoid';
}
function recipeSignal(r: Recipe, ageMonths: number): Signal {
  const signals = r.foodIds.map(id => foodSignal(id, ageMonths));
  if (signals.includes('avoid')) return 'avoid';
  if (signals.includes('soon')) return 'soon';
  if (signals.every(s => s === 'ready')) return 'ready';
  return 'unknown';
}

function methodColors(m: FeedingMethod) {
  // BLW = green (design system), BLISS = blue, Purés = purple
  if (m === 'BLISS') return { bg: 'bg-blue-50', border: 'border-blue-200', chip: 'bg-blue-600 text-white', ring: 'ring-blue-300' };
  if (m === 'Purés') return { bg: 'bg-purple-50', border: 'border-purple-200', chip: 'bg-purple-600 text-white', ring: 'ring-purple-300' };
  return { bg: 'bg-green-50', border: 'border-green-200', chip: 'bg-green-700 text-white', ring: 'ring-green-300' };
}

function signalPill(s: Signal, lang: Lang) {
  const map = {
    ready:   { cls: 'bg-green-100 text-green-800',   es: 'Apto', en: 'OK' },
    soon:    { cls: 'bg-yellow-100 text-yellow-800', es: 'Pronto', en: 'Soon' },
    avoid:   { cls: 'bg-red-100 text-red-700',       es: 'Evitar', en: 'Avoid' },
    unknown: { cls: 'bg-gray-100 text-gray-600',     es: '—', en: '—' },
  }[s];
  return <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${map.cls}`}>{lang === 'es' ? map.es : map.en}</span>;
}

function eligibleRecipes(cfg: WeekConfig): Recipe[] {
  const allergySet = new Set(cfg.allergies);
  return RECIPES.filter(r => {
    if (!r.methodBadges.includes(cfg.method)) return false;
    if (r.foodIds.some(id => allergySet.has(id))) return false;
    const sig = recipeSignal(r, cfg.ageMonths);
    return sig === 'ready' || sig === 'soon';
  });
}

function pickRecipe(pool: Recipe[], avoid: Set<string>): string | null {
  if (!pool.length) return null;
  const fresh = pool.filter(r => !avoid.has(r.id));
  const src = fresh.length ? fresh : pool;
  return src[Math.floor(Math.random() * src.length)].id;
}

function buildGrid(cfg: WeekConfig): (string | null)[][] {
  const pool = eligibleRecipes(cfg);
  const grid: (string | null)[][] = [];
  const recent = new Set<string>();
  for (let d = 0; d < 7; d++) {
    const row: (string | null)[] = [];
    for (let m = 0; m < cfg.meals.length; m++) {
      const id = pickRecipe(pool, recent);
      row.push(id);
      if (id) {
        recent.add(id);
        if (recent.size > Math.min(6, Math.max(3, pool.length - 2))) {
          const first = recent.values().next().value;
          if (first) recent.delete(first);
        }
      }
    }
    grid.push(row);
  }
  return grid;
}

// Explicit overrides for foods that don't map cleanly by category
const DAIRY_IDS = new Set<string>(['yogurt', 'cheese', 'milk', 'butter']);
function foodSection(foodId: string): Section {
  if (DAIRY_IDS.has(foodId)) return 'dairy';
  const f = FOODS.find(x => x.id === foodId);
  if (!f) return 'pantry';
  if (f.category === 'fruits' || f.category === 'vegetables') return 'produce';
  if (f.category === 'proteins') return 'protein';
  return 'pantry';
}

interface ShoppingItem { foodId: string; count: number; section: Section; }

function buildShoppingList(plan: WeekPlan): Record<Section, ShoppingItem[]> {
  const counts = new Map<string, number>();
  for (const row of plan.grid) {
    for (const rid of row) {
      if (!rid) continue;
      const recipe = RECIPES.find(r => r.id === rid);
      if (!recipe) continue;
      for (const fid of recipe.foodIds) {
        counts.set(fid, (counts.get(fid) ?? 0) + 1);
      }
    }
  }
  const groups: Record<Section, ShoppingItem[]> = { produce: [], protein: [], dairy: [], pantry: [] };
  for (const [foodId, count] of counts.entries()) {
    const section = foodSection(foodId);
    groups[section].push({ foodId, count, section });
  }
  (Object.keys(groups) as Section[]).forEach(s => {
    groups[s].sort((a, b) => b.count - a.count);
  });
  return groups;
}

export default function MyWeekScreen({ lang, currentMethod, babyMonths, userKey, onMethodChange }: Props) {
  const storageKey = `little_meal_week_plan_${userKey}`;
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setPlan(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);

  // persist
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (plan) window.localStorage.setItem(storageKey, JSON.stringify(plan));
  }, [plan, storageKey]);

  // onboarding form state
  const [method, setMethod] = useState<FeedingMethod>(currentMethod);
  const [ageMonths, setAgeMonths] = useState<number>(Math.max(6, babyMonths || 6));
  const [meals, setMeals] = useState<MealSlot[]>(['breakfast', 'lunch', 'snack', 'dinner']);
  const [allergies, setAllergies] = useState<Set<string>>(new Set());

  const commonAllergens = useMemo(() => FOODS.filter(f => f.isAllergen), []);

  const [swapFor, setSwapFor] = useState<{ day: number; meal: number } | null>(null);
  const [showShopping, setShowShopping] = useState(false);

  // Shopping list checked state — persisted separately so it survives regenerations
  const shoppingKey = `little_meal_week_shopping_${userKey}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(shoppingKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [shoppingKey]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(shoppingKey, JSON.stringify(checked));
  }, [checked, shoppingKey]);


  const tx = lang === 'es' ? {
    title: 'Mi semana',
    sub: 'Planificá 7 días de comidas para tu bebé.',
    startCta: 'Configurar mi semana',
    obTitle: 'Configurá tu semana',
    method: 'Método de alimentación',
    age: 'Edad del bebé (meses)',
    mealsPerDay: 'Comidas del día',
    allergies: 'Alergias o restricciones',
    allergiesHint: 'Se excluirán recetas con estos alimentos.',
    generate: 'Generar mi semana',
    regenerate: 'Regenerar toda la semana',
    editConfig: 'Editar configuración',
    empty: 'Sin sugerencia',
    swapTitle: 'Cambiar esta comida',
    close: 'Cerrar',
    noMatches: 'No encontramos recetas compatibles. Ajustá el método o restricciones.',
    shoppingCta: 'Generar lista de compras',
    shoppingTitle: 'Lista de compras de la semana',
    shoppingEmpty: 'Todavía no hay ingredientes.',
    clearChecked: 'Limpiar marcados',
    sections: { produce: 'Verdulería / Frutas', protein: 'Proteínas', dairy: 'Lácteos', pantry: 'Almacén / Despensa' } as Record<Section, string>,
    unit: (n: number) => `${n} porción${n === 1 ? '' : 'es'}`,
  } : {
    title: 'My week',
    sub: 'Plan 7 days of meals for your baby.',
    startCta: 'Set up my week',
    obTitle: 'Set up your week',
    method: 'Feeding method',
    age: 'Baby age (months)',
    mealsPerDay: 'Meals per day',
    allergies: 'Allergies / restrictions',
    allergiesHint: 'Recipes with these foods will be excluded.',
    generate: 'Generate my week',
    regenerate: 'Regenerate whole week',
    editConfig: 'Edit setup',
    empty: 'No suggestion',
    swapTitle: 'Swap this meal',
    close: 'Close',
    noMatches: 'No compatible recipes found. Adjust method or restrictions.',
    shoppingCta: 'Generate shopping list',
    shoppingTitle: 'This week\u2019s shopping list',
    shoppingEmpty: 'No ingredients yet.',
    clearChecked: 'Clear checked',
    sections: { produce: 'Produce', protein: 'Proteins', dairy: 'Dairy', pantry: 'Pantry' } as Record<Section, string>,
    unit: (n: number) => `${n} serving${n === 1 ? '' : 's'}`,
  };

  const openOnboarding = () => {
    if (plan) {
      setMethod(plan.config.method);
      setAgeMonths(plan.config.ageMonths);
      setMeals(plan.config.meals);
      setAllergies(new Set(plan.config.allergies));
    }
    setShowOnboarding(true);
  };

  const submitOnboarding = () => {
    const cfg: WeekConfig = {
      method,
      ageMonths,
      meals: meals.length ? meals : ['breakfast', 'lunch', 'snack', 'dinner'],
      allergies: Array.from(allergies),
    };
    const grid = buildGrid(cfg);
    setPlan({ config: cfg, grid });
    setShowOnboarding(false);
    onMethodChange?.(method);
  };

  const regenerate = () => {
    if (!plan) return;
    setPlan({ config: plan.config, grid: buildGrid(plan.config) });
  };

  const swapMeal = (day: number, meal: number) => {
    if (!plan) return;
    const pool = eligibleRecipes(plan.config);
    const current = plan.grid[day][meal];
    const avoid = new Set<string>(current ? [current] : []);
    const next = pickRecipe(pool, avoid);
    const grid = plan.grid.map((row, di) => row.map((cell, mi) => (di === day && mi === meal ? next : cell)));
    setPlan({ ...plan, grid });
    setSwapFor(null);
  };

  const days = lang === 'es' ? DAYS_ES : DAYS_EN;
  const colors = plan ? methodColors(plan.config.method) : methodColors(currentMethod);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <header className="px-5 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📅 {tx.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{tx.sub}</p>
          </div>
          {plan && (
            <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${colors.chip}`}>
              {plan.config.method}
            </div>
          )}
        </div>
      </header>

      {!plan && !showOnboarding && (
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="text-6xl">🗓️</div>
          <p className="text-gray-600 max-w-sm">{tx.sub}</p>
          <button
            onClick={openOnboarding}
            className="mt-2 bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow hover:bg-green-800 transition"
          >
            {tx.startCta}
          </button>
        </div>
      )}

      {showOnboarding && (
        <OnboardingForm
          tx={tx}
          method={method}
          setMethod={setMethod}
          ageMonths={ageMonths}
          setAgeMonths={setAgeMonths}
          meals={meals}
          setMeals={setMeals}
          allergies={allergies}
          setAllergies={setAllergies}
          commonAllergens={commonAllergens}
          lang={lang}
          onCancel={() => setShowOnboarding(false)}
          onSubmit={submitOnboarding}
          canCancel={!!plan}
        />
      )}

      {plan && !showOnboarding && (
        <>
          <div className="px-5 py-3 flex flex-wrap items-center gap-2">
            <button
              onClick={regenerate}
              className="text-xs font-semibold bg-gray-900 text-white px-3 py-2 rounded-xl hover:bg-black transition"
            >
              🔄 {tx.regenerate}
            </button>
            <button
              onClick={openOnboarding}
              className="text-xs font-medium border border-gray-300 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              ⚙️ {tx.editConfig}
            </button>
            <button
              onClick={() => setShowShopping(true)}
              className="text-xs font-semibold bg-green-700 text-white px-3 py-2 rounded-xl hover:bg-green-800 transition ml-auto"
            >
              🛒 {tx.shoppingCta}
            </button>
          </div>

          {eligibleRecipes(plan.config).length === 0 && (
            <div className="mx-5 mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {tx.noMatches}
            </div>
          )}

          <div className="px-4 pb-24 space-y-3">
            {plan.grid.map((row, dayIdx) => (
              <div key={dayIdx} className={`rounded-2xl border ${colors.border} ${colors.bg} p-3`}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-sm font-bold text-gray-800">{days[dayIdx]}</p>
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    {plan.config.method}
                  </span>
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${plan.config.meals.length}, minmax(0, 1fr))` }}>
                  {row.map((rid, mealIdx) => {
                    const mealDef = ALL_MEALS.find(m => m.key === plan.config.meals[mealIdx])!;
                    const recipe = rid ? RECIPES.find(r => r.id === rid) : null;
                    const sig = recipe ? recipeSignal(recipe, plan.config.ageMonths) : 'unknown';
                    return (
                      <button
                        key={mealIdx}
                        onClick={() => setSwapFor({ day: dayIdx, meal: mealIdx })}
                        className={`text-left bg-white rounded-xl p-2.5 border border-gray-200 hover:ring-2 ${colors.ring} transition flex flex-col gap-1 min-h-[92px]`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase">
                            {mealDef.emoji} {lang === 'es' ? mealDef.es : mealDef.en}
                          </span>
                          {recipe && signalPill(sig, lang)}
                        </div>
                        {recipe ? (
                          <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-3">
                            {lang === 'es' ? recipe.titleEs : recipe.titleEn}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">{tx.empty}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {swapFor && plan && (
        <SwapSheet
          lang={lang}
          tx={tx}
          plan={plan}
          day={swapFor.day}
          meal={swapFor.meal}
          onPick={(rid) => {
            const grid = plan.grid.map((row, di) => row.map((cell, mi) => (di === swapFor.day && mi === swapFor.meal ? rid : cell)));
            setPlan({ ...plan, grid });
            setSwapFor(null);
          }}
          onRandom={() => swapMeal(swapFor.day, swapFor.meal)}
          onClose={() => setSwapFor(null)}
        />
      )}

      {showShopping && plan && (
        <ShoppingSheet
          lang={lang}
          tx={tx}
          plan={plan}
          checked={checked}
          onToggle={(id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))}
          onClearChecked={() => setChecked({})}
          onClose={() => setShowShopping(false)}
        />
      )}
    </div>
  );
}

// ─── Onboarding form ────────────────────────────────────────────────
function OnboardingForm(props: {
  tx: any;
  method: FeedingMethod;
  setMethod: (m: FeedingMethod) => void;
  ageMonths: number;
  setAgeMonths: (n: number) => void;
  meals: MealSlot[];
  setMeals: (m: MealSlot[]) => void;
  allergies: Set<string>;
  setAllergies: (s: Set<string>) => void;
  commonAllergens: typeof FOODS;
  lang: Lang;
  onCancel: () => void;
  onSubmit: () => void;
  canCancel: boolean;
}) {
  const { tx, method, setMethod, ageMonths, setAgeMonths, meals, setMeals, allergies, setAllergies, commonAllergens, lang, onCancel, onSubmit, canCancel } = props;
  const toggleMeal = (k: MealSlot) => {
    setMeals(meals.includes(k) ? meals.filter(m => m !== k) : [...meals, k].sort((a, b) => ALL_MEALS.findIndex(x => x.key === a) - ALL_MEALS.findIndex(x => x.key === b)));
  };
  const toggleAllergy = (id: string) => {
    const next = new Set(allergies);
    if (next.has(id)) next.delete(id); else next.add(id);
    setAllergies(next);
  };
  const methods: FeedingMethod[] = ['BLW', 'BLISS', 'Purés'];
  return (
    <div className="p-5 space-y-5 pb-24">
      <h2 className="text-lg font-bold text-gray-900">{tx.obTitle}</h2>

      <div>
        <label className="text-sm font-semibold text-gray-700">{tx.method}</label>
        <div className="flex gap-2 mt-2">
          {methods.map(m => {
            const c = methodColors(m);
            const active = method === m;
            return (
              <button key={m} onClick={() => setMethod(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${active ? `${c.chip} border-transparent` : 'bg-white text-gray-700 border-gray-300'}`}>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">{tx.age}: <span className="font-bold">{ageMonths}m</span></label>
        <input type="range" min={6} max={24} step={1} value={ageMonths} onChange={e => setAgeMonths(Number(e.target.value))}
          className="w-full mt-2 accent-green-700" />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">{tx.mealsPerDay}</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {ALL_MEALS.map(m => {
            const active = meals.includes(m.key);
            return (
              <button key={m.key} onClick={() => toggleMeal(m.key)}
                className={`py-2 rounded-xl text-sm font-medium border transition ${active ? 'bg-green-700 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300'}`}>
                {m.emoji} {lang === 'es' ? m.es : m.en}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">{tx.allergies}</label>
        <p className="text-[11px] text-gray-500 mb-2">{tx.allergiesHint}</p>
        <div className="flex flex-wrap gap-1.5">
          {commonAllergens.map(f => {
            const active = allergies.has(f.id);
            return (
              <button key={f.id} onClick={() => toggleAllergy(f.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${active ? 'bg-red-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                {f.emoji} {lang === 'es' ? f.nameEs : f.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        {canCancel && (
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 font-semibold">
            {lang === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
        )}
        <button onClick={onSubmit} disabled={meals.length === 0}
          className="flex-1 py-3 rounded-2xl bg-green-700 text-white font-semibold shadow hover:bg-green-800 transition disabled:opacity-50">
          {tx.generate}
        </button>
      </div>
    </div>
  );
}

// ─── Swap sheet ────────────────────────────────────────────────
function SwapSheet(props: {
  lang: Lang;
  tx: any;
  plan: WeekPlan;
  day: number;
  meal: number;
  onPick: (recipeId: string) => void;
  onRandom: () => void;
  onClose: () => void;
}) {
  const { lang, tx, plan, day, meal, onPick, onRandom, onClose } = props;
  const pool = useMemo(() => eligibleRecipes(plan.config), [plan.config]);
  const current = plan.grid[day][meal];
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{tx.swapTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>
        <div className="p-4 flex gap-2">
          <button onClick={onRandom} className="flex-1 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold">
            🎲 {lang === 'es' ? 'Sugerencia aleatoria' : 'Random suggestion'}
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-3 pb-4 space-y-2">
          {pool.map(r => {
            const sig = recipeSignal(r, plan.config.ageMonths);
            const active = current === r.id;
            return (
              <button key={r.id} onClick={() => onPick(r.id)}
                className={`w-full text-left p-3 rounded-xl border transition ${active ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {lang === 'es' ? r.titleEs : r.titleEn}
                  </p>
                  {signalPill(sig, lang)}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {r.timeMin} min · {r.methodBadges.join(' · ')}
                </p>
              </button>
            );
          })}
          {pool.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">{tx.noMatches}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shopping list sheet ────────────────────────────────────────────
function ShoppingSheet(props: {
  lang: Lang;
  tx: any;
  plan: WeekPlan;
  checked: Record<string, boolean>;
  onToggle: (foodId: string) => void;
  onClearChecked: () => void;
  onClose: () => void;
}) {
  const { lang, tx, plan, checked, onToggle, onClearChecked, onClose } = props;
  const groups = useMemo(() => buildShoppingList(plan), [plan]);
  const orderedSections: Section[] = ['produce', 'protein', 'dairy', 'pantry'];
  const anyItems = orderedSections.some(s => groups[s].length > 0);
  const hasChecked = Object.values(checked).some(Boolean);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-900">🛒 {tx.shoppingTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        {hasChecked && (
          <div className="px-4 pt-3">
            <button onClick={onClearChecked}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-800 underline">
              {tx.clearChecked}
            </button>
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-3 py-3 space-y-3">
          {!anyItems && (
            <p className="text-sm text-gray-500 text-center py-6">{tx.shoppingEmpty}</p>
          )}
          {orderedSections.map(section => {
            const items = groups[section];
            if (!items.length) return null;
            return (
              <div key={section} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2 px-1">
                  {tx.sections[section]}
                </p>
                <ul className="space-y-1.5">
                  {items.map(item => {
                    const food = FOODS.find(f => f.id === item.foodId);
                    const isChecked = !!checked[item.foodId];
                    const name = food ? (lang === 'es' ? food.nameEs : food.nameEn) : item.foodId;
                    return (
                      <li key={item.foodId}>
                        <button
                          onClick={() => onToggle(item.foodId)}
                          className={`w-full flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border transition text-left ${
                            isChecked ? 'border-green-200 opacity-60' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                            isChecked ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'
                          }`}>
                            {isChecked && <span className="text-[11px] leading-none">✓</span>}
                          </span>
                          <span className="text-lg">{food?.emoji ?? '🥣'}</span>
                          <span className={`flex-1 text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {name}
                          </span>
                          <span className="text-[11px] text-gray-500 font-semibold">
                            ×{item.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
