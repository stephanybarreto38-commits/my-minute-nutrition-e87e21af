import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Settings, ChefHat, ShoppingCart, Shuffle } from 'lucide-react';
import type { Lang } from '../data/translations';
import type { FeedingMethod, ShoppingInput, ShoppingSection } from '../hooks/useAppStore';
import { FOODS } from '../data/foods';
import { RECIPES, type Recipe } from '../data/recipes';

interface Props {
  lang: Lang;
  currentMethod: FeedingMethod;
  babyMonths: number;
  savedPlan: unknown | null;
  onSavePlan: (plan: unknown) => void;
  pantry: Set<string>;
  onTogglePantry: (foodId: string) => void;
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
  allergies: string[];
}

interface Cell { recipeId: string; extras: string[]; }

interface WeekPlan {
  config: WeekConfig;
  grid: (Cell | null)[][];
}

const ALL_MEALS: { key: MealSlot; es: string; en: string; emoji: string }[] = [
  { key: 'breakfast', es: 'Desayuno', en: 'Breakfast', emoji: '☀️' },
  { key: 'lunch',     es: 'Almuerzo', en: 'Lunch',     emoji: '🍽️' },
  { key: 'snack',     es: 'Merienda', en: 'Snack',     emoji: '🍎' },
  { key: 'dinner',    es: 'Cena',     en: 'Dinner',    emoji: '🌙' },
];

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

function buildGrid(cfg: WeekConfig): (Cell | null)[][] {
  const pool = eligibleRecipes(cfg);
  const grid: (Cell | null)[][] = [];
  const recent = new Set<string>();
  for (let d = 0; d < 7; d++) {
    const row: (Cell | null)[] = [];
    for (let m = 0; m < cfg.meals.length; m++) {
      const id = pickRecipe(pool, recent);
      row.push(id ? { recipeId: id, extras: [] } : null);
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

const DAIRY_IDS = new Set<string>(['yogurt', 'cheese', 'milk', 'butter']);
function foodSection(foodId: string): Section {
  if (DAIRY_IDS.has(foodId)) return 'dairy';
  const f = FOODS.find(x => x.id === foodId);
  if (!f) return 'pantry';
  if (f.category === 'fruits' || f.category === 'vegetables') return 'produce';
  if (f.category === 'proteins') return 'protein';
  return 'pantry';
}

interface ShoppingAgg { foodId: string; count: number; section: Section; }

function buildShoppingList(plan: WeekPlan): Record<Section, ShoppingAgg[]> {
  const counts = new Map<string, number>();
  for (const row of plan.grid) {
    for (const cell of row) {
      if (!cell) continue;
      const recipe = RECIPES.find(r => r.id === cell.recipeId);
      if (recipe) {
        for (const fid of recipe.foodIds) counts.set(fid, (counts.get(fid) ?? 0) + 1);
      }
      for (const fid of cell.extras) counts.set(fid, (counts.get(fid) ?? 0) + 1);
    }
  }
  const groups: Record<Section, ShoppingAgg[]> = { produce: [], protein: [], dairy: [], pantry: [] };
  for (const [foodId, count] of counts.entries()) {
    groups[foodSection(foodId)].push({ foodId, count, section: foodSection(foodId) });
  }
  (Object.keys(groups) as Section[]).forEach(s => groups[s].sort((a, b) => b.count - a.count));
  return groups;
}

// Migrate legacy grid (string | null) → Cell | null
function normalizePlan(raw: any): WeekPlan | null {
  if (!raw || !raw.config || !Array.isArray(raw.grid)) return null;
  const grid: (Cell | null)[][] = raw.grid.map((row: any[]) =>
    row.map((cell: any) => {
      if (!cell) return null;
      if (typeof cell === 'string') return { recipeId: cell, extras: [] };
      if (typeof cell === 'object' && cell.recipeId) return { recipeId: cell.recipeId, extras: Array.isArray(cell.extras) ? cell.extras : [] };
      return null;
    })
  );
  return { config: raw.config, grid };
}

export default function MyWeekScreen({
  lang, currentMethod, babyMonths, savedPlan, onSavePlan, pantry, onTogglePantry,
  onMethodChange, onAddToShopping, onGoToShopping,
}: Props) {
  const [plan, setPlanState] = useState<WeekPlan | null>(() => normalizePlan(savedPlan));
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sync when store hydrates the plan asynchronously
  useEffect(() => {
    const n = normalizePlan(savedPlan);
    if (n && !plan) setPlanState(n);
     
  }, [savedPlan]);

  const setPlan = (p: WeekPlan | null) => {
    setPlanState(p);
    if (p) onSavePlan(p);
  };

  const [method, setMethod] = useState<FeedingMethod>(currentMethod);
  const [ageMonths, setAgeMonths] = useState<number>(Math.max(6, babyMonths || 6));
  const [meals, setMeals] = useState<MealSlot[]>(['breakfast', 'lunch', 'snack', 'dinner']);
  const [allergies, setAllergies] = useState<Set<string>>(new Set());

  const commonAllergens = useMemo(() => FOODS.filter(f => f.isAllergen), []);

  const [swapFor, setSwapFor] = useState<{ day: number; meal: number } | null>(null);
  const [addedToast, setAddedToast] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pantrySheetOpen, setPantrySheetOpen] = useState(false);
  const [alreadyHave, setAlreadyHave] = useState<Set<string>>(new Set());

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
    previewTitle: 'Revisá tu lista',
    previewSub: 'Marcá lo que ya tenés en casa para excluirlo.',
    alreadyHave: 'Ya lo tengo',
    fromPantry: 'De mi despensa',
    managePantry: 'Mi despensa',
    addFinal: 'Agregar a la lista',
    pantryTitle: 'Mi despensa',
    pantrySub: 'Alimentos básicos que siempre tenés. Se excluyen automáticamente de cada nueva lista.',
    pantryEmpty: 'Todavía no guardaste alimentos.',
    saveClose: 'Listo',
    customize: 'Personalizar plato',
    customizeHint: 'Agregá ingredientes extra al plato (proteína, fruta, vegetal…).',
    extras: 'Extras',
    randomSuggest: 'Sugerencia aleatoria',
    catFruits: 'Frutas',
    catVeg: 'Vegetales',
    catProt: 'Proteínas',
    catGrains: 'Granos',
    catOther: 'Otros',
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
    previewTitle: 'Review your list',
    previewSub: 'Check off what you already have to exclude it.',
    alreadyHave: 'I already have it',
    fromPantry: 'From my pantry',
    managePantry: 'My pantry',
    addFinal: 'Add to shopping list',
    pantryTitle: 'My pantry',
    pantrySub: 'Staples you always have. They\u2019re auto-excluded from every new list.',
    pantryEmpty: 'No staples saved yet.',
    saveClose: 'Done',
    customize: 'Customize plate',
    customizeHint: 'Add extras to this plate (protein, fruit, veggie…).',
    extras: 'Extras',
    randomSuggest: 'Random suggestion',
    catFruits: 'Fruits',
    catVeg: 'Vegetables',
    catProt: 'Proteins',
    catGrains: 'Grains',
    catOther: 'Other',
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
      method, ageMonths,
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
    const current = plan.grid[day][meal]?.recipeId;
    const avoid = new Set<string>(current ? [current] : []);
    const next = pickRecipe(pool, avoid);
    const grid = plan.grid.map((row, di) => row.map((cell, mi) =>
      di === day && mi === meal ? (next ? { recipeId: next, extras: [] } : null) : cell
    ));
    setPlan({ ...plan, grid });
    setSwapFor(null);
  };

  const toggleExtra = (day: number, meal: number, foodId: string) => {
    if (!plan) return;
    const grid = plan.grid.map((row, di) => row.map((cell, mi) => {
      if (di !== day || mi !== meal || !cell) return cell;
      const has = cell.extras.includes(foodId);
      return { ...cell, extras: has ? cell.extras.filter(x => x !== foodId) : [...cell.extras, foodId] };
    }));
    setPlan({ ...plan, grid });
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
          <button onClick={openOnboarding}
            className="mt-2 bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow hover:bg-green-800 transition">
            {tx.startCta}
          </button>
        </div>
      )}

      {showOnboarding && (
        <OnboardingForm
          tx={tx} method={method} setMethod={setMethod}
          ageMonths={ageMonths} setAgeMonths={setAgeMonths}
          meals={meals} setMeals={setMeals}
          allergies={allergies} setAllergies={setAllergies}
          commonAllergens={commonAllergens} lang={lang}
          onCancel={() => setShowOnboarding(false)}
          onSubmit={submitOnboarding} canCancel={!!plan}
        />
      )}

      {plan && !showOnboarding && (
        <>
          <div className="px-5 py-3 flex flex-wrap items-center gap-2">
            <button onClick={regenerate} className="text-xs font-semibold bg-gray-900 text-white px-3 py-2 rounded-xl hover:bg-black transition">
              🔄 {tx.regenerate}
            </button>
            <button onClick={openOnboarding} className="text-xs font-medium border border-gray-300 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
              ⚙️ {tx.editConfig}
            </button>
            <button onClick={() => setPantrySheetOpen(true)} className="text-xs font-medium border border-gray-300 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
              🥫 {tx.managePantry}
            </button>
            <button
              onClick={() => { setAlreadyHave(new Set(pantry)); setPreviewOpen(true); }}
              className="text-xs font-semibold bg-green-700 text-white px-3 py-2 rounded-xl hover:bg-green-800 transition ml-auto">
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
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">{plan.config.method}</span>
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${plan.config.meals.length}, minmax(0, 1fr))` }}>
                  {row.map((cell, mealIdx) => {
                    const mealDef = ALL_MEALS.find(m => m.key === plan.config.meals[mealIdx])!;
                    const recipe = cell ? RECIPES.find(r => r.id === cell.recipeId) : null;
                    const sig = recipe ? recipeSignal(recipe, plan.config.ageMonths) : 'unknown';
                    return (
                      <button key={mealIdx} onClick={() => setSwapFor({ day: dayIdx, meal: mealIdx })}
                        className={`text-left bg-white rounded-xl p-2.5 border border-gray-200 hover:ring-2 ${colors.ring} transition flex flex-col gap-1 min-h-[92px]`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase">
                            {mealDef.emoji} {lang === 'es' ? mealDef.es : mealDef.en}
                          </span>
                          {recipe && signalPill(sig, lang)}
                        </div>
                        {recipe ? (
                          <>
                            <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">
                              {lang === 'es' ? recipe.titleEs : recipe.titleEn}
                            </p>
                            {cell && cell.extras.length > 0 && (
                              <div className="flex flex-wrap gap-0.5 mt-0.5">
                                {cell.extras.map(fid => {
                                  const f = FOODS.find(x => x.id === fid);
                                  if (!f) return null;
                                  return <span key={fid} className="text-[9px]" title={lang === 'es' ? f.nameEs : f.nameEn}>{f.emoji}</span>;
                                })}
                              </div>
                            )}
                          </>
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
          lang={lang} tx={tx} plan={plan} day={swapFor.day} meal={swapFor.meal}
          onPick={(rid) => {
            const grid = plan.grid.map((row, di) => row.map((cell, mi) =>
              di === swapFor.day && mi === swapFor.meal ? { recipeId: rid, extras: cell?.extras ?? [] } : cell
            ));
            setPlan({ ...plan, grid });
            setSwapFor(null);
          }}
          onRandom={() => swapMeal(swapFor.day, swapFor.meal)}
          onToggleExtra={(fid) => toggleExtra(swapFor.day, swapFor.meal, fid)}
          onClose={() => setSwapFor(null)}
        />
      )}

      {previewOpen && plan && (
        <PreviewSheet
          lang={lang} tx={tx} plan={plan} pantry={pantry} alreadyHave={alreadyHave}
          onToggleHave={(fid) => setAlreadyHave(prev => {
            const next = new Set(prev);
            if (next.has(fid)) next.delete(fid); else next.add(fid);
            return next;
          })}
          onOpenPantry={() => setPantrySheetOpen(true)}
          onClose={() => setPreviewOpen(false)}
          onConfirm={() => {
            const groups = buildShoppingList(plan);
            const items: ShoppingInput[] = [];
            (['produce', 'protein', 'dairy', 'pantry'] as Section[]).forEach(sec => {
              groups[sec].forEach(g => {
                if (alreadyHave.has(g.foodId)) return;
                const f = FOODS.find(x => x.id === g.foodId);
                if (!f) return;
                items.push({ nameEs: f.nameEs, nameEn: f.nameEn, tag: 'baby', section: sec, quantity: g.count });
              });
            });
            setPreviewOpen(false);
            if (items.length === 0) return;
            onAddToShopping(items);
            setAddedToast(true);
            setTimeout(() => { setAddedToast(false); onGoToShopping(); }, 700);
          }}
        />
      )}

      {pantrySheetOpen && (
        <PantrySheet lang={lang} tx={tx} pantry={pantry} onToggle={onTogglePantry} onClose={() => setPantrySheetOpen(false)} />
      )}

      {addedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          🛒 {tx.shoppingCta} ✓
        </div>
      )}
    </div>
  );
}

// ─── Onboarding form ────────────────────────────────────────────────
function OnboardingForm(props: {
  tx: any; method: FeedingMethod; setMethod: (m: FeedingMethod) => void;
  ageMonths: number; setAgeMonths: (n: number) => void;
  meals: MealSlot[]; setMeals: (m: MealSlot[]) => void;
  allergies: Set<string>; setAllergies: (s: Set<string>) => void;
  commonAllergens: typeof FOODS; lang: Lang;
  onCancel: () => void; onSubmit: () => void; canCancel: boolean;
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

// ─── Swap sheet with plate customization ──────────────────────────────
function SwapSheet(props: {
  lang: Lang; tx: any; plan: WeekPlan; day: number; meal: number;
  onPick: (recipeId: string) => void;
  onRandom: () => void;
  onToggleExtra: (foodId: string) => void;
  onClose: () => void;
}) {
  const { lang, tx, plan, day, meal, onPick, onRandom, onToggleExtra, onClose } = props;
  const pool = useMemo(() => eligibleRecipes(plan.config), [plan.config]);
  const cell = plan.grid[day][meal];
  const current = cell?.recipeId;
  const extras = cell?.extras ?? [];
  const currentRecipe = current ? RECIPES.find(r => r.id === current) : null;
  const recipeFoodIds = new Set(currentRecipe?.foodIds ?? []);

  const categoryGroups = useMemo(() => {
    const groups: { key: string; label: string; foods: typeof FOODS }[] = [
      { key: 'proteins', label: tx.catProt, foods: [] },
      { key: 'vegetables', label: tx.catVeg, foods: [] },
      { key: 'fruits', label: tx.catFruits, foods: [] },
      { key: 'grains', label: tx.catGrains, foods: [] },
      { key: 'other', label: tx.catOther, foods: [] },
    ];
    for (const f of FOODS) {
      if (recipeFoodIds.has(f.id)) continue;
      if (f.status === 'avoid') continue;
      if (f.fromMonths > plan.config.ageMonths + 2) continue;
      if (plan.config.allergies.includes(f.id)) continue;
      const g = groups.find(x => x.key === f.category) ?? groups[groups.length - 1];
      g.foods.push(f);
    }
    return groups.filter(g => g.foods.length > 0);
  }, [plan.config, recipeFoodIds, tx]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{tx.swapTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto flex-1">
          {currentRecipe && (
            <section className="px-4 pt-4 pb-3 border-b bg-green-50/40">
              <p className="text-[11px] font-bold text-green-800 uppercase tracking-wide mb-1">🍽️ {tx.customize}</p>
              <p className="text-[11px] text-gray-600 mb-2">{tx.customizeHint}</p>
              {extras.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {extras.map(fid => {
                    const f = FOODS.find(x => x.id === fid);
                    if (!f) return null;
                    return (
                      <button key={fid} onClick={() => onToggleExtra(fid)}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-green-700 text-white flex items-center gap-1">
                        <span>{f.emoji}</span>
                        <span>{lang === 'es' ? f.nameEs : f.nameEn}</span>
                        <span className="opacity-80">×</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="space-y-2">
                {categoryGroups.map(g => (
                  <div key={g.key}>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">{g.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {g.foods.slice(0, 14).map(f => {
                        const active = extras.includes(f.id);
                        return (
                          <button key={f.id} onClick={() => onToggleExtra(f.id)}
                            className={`text-[11px] px-2 py-0.5 rounded-full border transition ${active ? 'bg-green-700 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                            {f.emoji} {lang === 'es' ? f.nameEs : f.nameEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="p-4 flex gap-2 border-b">
            <button onClick={onRandom} className="flex-1 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold">
              🎲 {tx.randomSuggest}
            </button>
          </div>

          <div className="px-3 py-3 space-y-2">
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
            {pool.length === 0 && <p className="text-sm text-gray-500 text-center py-6">{tx.noMatches}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Preview sheet ──────────────────────────────────────────────
function PreviewSheet(props: {
  lang: Lang; tx: any; plan: WeekPlan; pantry: Set<string>; alreadyHave: Set<string>;
  onToggleHave: (foodId: string) => void; onOpenPantry: () => void; onClose: () => void; onConfirm: () => void;
}) {
  const { lang, tx, plan, pantry, alreadyHave, onToggleHave, onOpenPantry, onClose, onConfirm } = props;
  const groups = useMemo(() => buildShoppingList(plan), [plan]);
  const order: Section[] = ['produce', 'protein', 'dairy', 'pantry'];
  const totalItems = order.reduce((sum, s) => sum + groups[s].length, 0);
  const remaining = order.reduce((sum, s) => sum + groups[s].filter(g => !alreadyHave.has(g.foodId)).length, 0);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">{tx.previewTitle}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{tx.previewSub}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="px-4 py-2 border-b flex items-center justify-between">
          <span className="text-[11px] text-gray-500">{remaining} / {totalItems}</span>
          <button onClick={onOpenPantry} className="text-[11px] font-semibold text-green-700 hover:underline">
            🥫 {tx.managePantry}
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-3 pb-3 space-y-3 pt-3">
          {totalItems === 0 && <p className="text-sm text-gray-500 text-center py-6">{tx.shoppingEmpty}</p>}
          {order.map(sec => {
            const items = groups[sec];
            if (!items.length) return null;
            return (
              <div key={sec} className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">{tx.sections[sec]}</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {items.map(g => {
                    const f = FOODS.find(x => x.id === g.foodId);
                    if (!f) return null;
                    const have = alreadyHave.has(g.foodId);
                    const isStaple = pantry.has(g.foodId);
                    return (
                      <li key={g.foodId}>
                        <label className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 ${have ? 'opacity-50' : ''}`}>
                          <input type="checkbox" checked={have} onChange={() => onToggleHave(g.foodId)}
                            className="w-4 h-4 accent-green-700" />
                          <span className="text-lg">{f.emoji}</span>
                          <span className={`flex-1 text-sm font-medium text-gray-800 ${have ? 'line-through' : ''}`}>
                            {lang === 'es' ? f.nameEs : f.nameEn}
                            {g.count > 1 && <span className="ml-1 text-[11px] text-gray-500">×{g.count}</span>}
                          </span>
                          {isStaple && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              🥫 {tx.fromPantry}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500">{have ? tx.alreadyHave : ''}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t bg-white">
          <button onClick={onConfirm} disabled={remaining === 0}
            className="w-full py-3 rounded-2xl bg-green-700 text-white font-semibold shadow hover:bg-green-800 transition disabled:opacity-50">
            🛒 {tx.addFinal} {remaining > 0 && <span className="opacity-80">({remaining})</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pantry sheet ──────────────────────────────
function PantrySheet(props: {
  lang: Lang; tx: any; pantry: Set<string>;
  onToggle: (foodId: string) => void; onClose: () => void;
}) {
  const { lang, tx, pantry, onToggle, onClose } = props;
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = useMemo(() => {
    const withSection = FOODS.map(f => ({ f, sec: (function () {
      if (f.category === 'fruits' || f.category === 'vegetables') return 'produce';
      if (f.category === 'proteins') return 'protein';
      if (['yogurt', 'cheese', 'milk', 'butter'].includes(f.id)) return 'dairy';
      return 'pantry';
    })() as Section }));
    const filtered = q
      ? withSection.filter(({ f }) => f.nameEs.toLowerCase().includes(q) || f.nameEn.toLowerCase().includes(q))
      : withSection;
    return filtered.sort((a, b) => {
      const inA = pantry.has(a.f.id) ? 0 : 1;
      const inB = pantry.has(b.f.id) ? 0 : 1;
      if (inA !== inB) return inA - inB;
      return (lang === 'es' ? a.f.nameEs.localeCompare(b.f.nameEs) : a.f.nameEn.localeCompare(b.f.nameEn));
    });
  }, [q, pantry, lang]);

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">🥫 {tx.pantryTitle}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{tx.pantrySub}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="p-3 border-b">
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar alimento…' : 'Search food…'}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>

        <div className="overflow-y-auto flex-1 px-3 py-2">
          {pantry.size === 0 && !q && <p className="text-xs text-gray-500 text-center py-3">{tx.pantryEmpty}</p>}
          <ul className="divide-y divide-gray-100">
            {list.map(({ f }) => {
              const active = pantry.has(f.id);
              return (
                <li key={f.id}>
                  <label className="flex items-center gap-3 px-2 py-2.5 cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={active} onChange={() => onToggle(f.id)}
                      className="w-4 h-4 accent-green-700" />
                    <span className="text-lg">{f.emoji}</span>
                    <span className="flex-1 text-sm font-medium text-gray-800">
                      {lang === 'es' ? f.nameEs : f.nameEn}
                    </span>
                    {active && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">✓</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-3 border-t">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-green-700 text-white font-semibold text-sm hover:bg-green-800 transition">
            {tx.saveClose}
          </button>
        </div>
      </div>
    </div>
  );
}
