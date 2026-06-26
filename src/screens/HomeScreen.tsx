import { useState } from 'react';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import { FOODS, FOOD_CATEGORIES, getFoodsByCategory } from '../data/foods';
import type { FoodLog, FoodCategory } from '../data/foods';
import type { FeedingMethod, Screen } from '../hooks/useAppStore';
import FoodCard from '../components/FoodCard';

interface Props {
  lang: Lang;
  method: FeedingMethod;
  babyName: string;
  babyMonths: number;
  babyWeek: number;
  foodLogs: Record<string, FoodLog>;
  triedFoodIds: string[];
  onFoodClick: (foodId: string) => void;
  onNavigate: (screen: Screen) => void;
  onMethodOpen: () => void;
  onToggleLang: () => void;
}

const PREVIEW_COUNT = 3;

const SUGGESTED_FOOD_ID = 'broccoli';
const SUGGESTED_FOOD = FOODS.find(f => f.id === SUGGESTED_FOOD_ID)!;

export default function HomeScreen({
  lang, method, babyName, babyMonths, babyWeek,
  foodLogs, triedFoodIds, onFoodClick, onNavigate, onMethodOpen, onToggleLang,
}: Props) {
  const tx = t[lang];
  const [ageFilter, setAgeFilter] = useState<6 | 8 | 12>(6);
  const [expanded, setExpanded] = useState<Record<FoodCategory, boolean>>({
    fruits: false, vegetables: false, proteins: false, grains: false,
  });

  const totalFoods = FOODS.length;
  const progress = Math.round((triedFoodIds.length / totalFoods) * 100);

  const toggleExpand = (cat: FoodCategory) => {
    setExpanded(e => ({ ...e, [cat]: !e[cat] }));
  };

  const getCategoryLabel = (cat: FoodCategory) => {
    const map = {
      fruits: tx.category.fruitsPlural,
      vegetables: tx.category.vegetablesPlural,
      proteins: tx.category.proteinsPlural,
      grains: tx.category.grainsPlural,
    };
    return map[cat];
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* TOP BAR */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">
          🐣
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {tx.home.greeting(babyName)}
          </p>
          <p className="text-xs text-gray-500">
            {tx.home.ageLabel(babyMonths, babyWeek)}
          </p>
        </div>
        {/* Language toggle */}
        <button onClick={onToggleLang} className="flex bg-gray-100 rounded-full border border-gray-200 overflow-hidden text-xs">
          <span className={`px-2.5 py-1 ${lang === 'es' ? 'bg-green-600 text-white rounded-full' : 'text-gray-500'}`}>ES</span>
          <span className={`px-2.5 py-1 ${lang === 'en' ? 'bg-green-600 text-white rounded-full' : 'text-gray-500'}`}>EN</span>
        </button>
        <button
          onClick={onMethodOpen}
          className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 text-gray-700 flex-shrink-0"
        >
          {method}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* STAGE BANNER */}
      <div className="mx-4 mt-3 rounded-xl bg-green-50 border border-green-200 p-3">
        <span className="inline-block bg-green-900 text-green-100 text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-1.5">
          {tx.stage.pill(`${babyMonths}–${babyMonths + 1}`)}
        </span>
        <p className="text-sm font-medium text-green-900">{tx.stage.title}</p>
        <p className="text-[11px] text-green-700 mt-0.5">{tx.stage.sub}</p>

        <div className="mt-2 bg-white rounded-lg border border-green-200 p-2 flex items-center gap-2.5">
          <span className="text-2xl">{SUGGESTED_FOOD.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-green-900 truncate">
              {tx.stage.suggested(lang === 'es' ? SUGGESTED_FOOD.nameEs : SUGGESTED_FOOD.nameEn)}
            </p>
            <p className="text-[11px] text-green-700">{tx.stage.suggestedSub}</p>
          </div>
          <button
            onClick={() => onFoodClick(SUGGESTED_FOOD_ID)}
            className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0"
          >
            {tx.stage.tryBtn}
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-4 mt-3">
        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
          <span>{tx.home.progressLabel}</span>
          <span className="text-green-700 font-medium">{triedFoodIds.length} / {totalFoods}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-600 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* COOK CTA */}
      <div className="px-4 mt-2.5">
        <button
          onClick={() => onNavigate('fridge')}
          className="w-full flex items-center gap-2.5 p-3 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            🧑‍🍳
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[13px] font-medium text-gray-900">{tx.home.cookCta}</p>
            <p className="text-[11px] text-gray-500 truncate">{tx.home.cookCtaSub(babyName)}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-gray-400">
            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* AGE FILTER */}
      <div className="flex gap-2 px-4 pt-3 pb-1">
        {([6, 8, 12] as const).map(age => (
          <button
            key={age}
            onClick={() => setAgeFilter(age)}
            className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
              ageFilter === age
                ? 'bg-green-50 border-green-300 text-green-700 font-medium'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            {age === 6 ? tx.home.ageFilterAll : age === 8 ? tx.home.ageFilter8 : tx.home.ageFilter12}
          </button>
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex gap-3 flex-wrap px-4 py-2">
        {[
          { dot: 'bg-green-600 rounded-full', label: tx.home.legend.tried },
          { dot: 'bg-green-50 border-[1.5px] border-green-500', label: tx.home.legend.introduce },
          { dot: 'bg-gray-100 border border-gray-300', label: tx.home.legend.soon },
          { dot: 'bg-red-50 border border-red-200', label: tx.home.legend.avoid },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <div className={`w-2.5 h-2.5 flex-shrink-0 rounded-sm ${dot}`} />
            {label}
          </div>
        ))}
      </div>

      {/* FOOD CATEGORIES */}
      {FOOD_CATEGORIES.map(cat => {
        const allFoods = getFoodsByCategory(cat.id).filter(f => f.fromMonths <= ageFilter || f.status === 'avoid');
        const visible = expanded[cat.id] ? allFoods : allFoods.slice(0, PREVIEW_COUNT);
        const hidden = allFoods.length - PREVIEW_COUNT;
        const triedInCat = allFoods.filter(f => foodLogs[f.id]?.tried).length;
        const catLabel = lang === 'es' ? cat.labelEs : cat.labelEn;
        const catLabelPlural = getCategoryLabel(cat.id);

        return (
          <div key={cat.id}>
            <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                {catLabel}
              </span>
              <span className="text-[10px] text-gray-300">
                {tx.food.count(triedInCat, allFoods.length)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pb-1">
              {visible.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  log={foodLogs[food.id]}
                  lang={lang}
                  onClick={() => onFoodClick(food.id)}
                />
              ))}
            </div>

            {allFoods.length > PREVIEW_COUNT && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className="flex items-center justify-center gap-1.5 mx-4 mb-1 w-[calc(100%-32px)] py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500"
              >
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`transition-transform ${expanded[cat.id] ? 'rotate-180' : ''}`}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {expanded[cat.id]
                  ? tx.home.seeLess
                  : tx.home.seeMore(hidden, catLabelPlural)
                }
              </button>
            )}
          </div>
        );
      })}

      <div className="h-4" />
    </div>
  );
}
