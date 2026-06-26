import { useState } from 'react';
import type { Food, FoodLog, Reaction } from '../data/foods';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import type { FeedingMethod } from '../hooks/useAppStore';
import type { ShoppingItem } from '../hooks/useAppStore';
import { getRecipesByFoodId } from '../data/recipes';

interface Props {
  lang: Lang;
  food: Food;
  log?: FoodLog;
  method: FeedingMethod;
  onBack: () => void;
  onSaveLog: (foodId: string, log: Partial<FoodLog>) => void;
  onAddToShopping: (items: Omit<ShoppingItem, 'id' | 'checked'>[]) => void;
}

type Tab = 'prep' | 'menu' | 'log';

const REACTION_SELECTED: Record<string, string> = {
  loved:    'border-green-500 bg-green-50 text-green-900',
  normal:   'border-blue-400 bg-blue-50 text-blue-900',
  disliked: 'border-amber-400 bg-amber-50 text-amber-900',
  reaction: 'border-red-400 bg-red-50 text-red-900',
};

export default function FoodDetailScreen({
  lang, food, log, method, onBack, onSaveLog, onAddToShopping,
}: Props) {
  const tx = t[lang];
  const [tab, setTab] = useState<Tab>('prep');
  const [tried, setTried] = useState(log?.tried ?? false);
  const [reaction, setReaction] = useState<Reaction>(log?.reaction ?? null);
  const [notes, setNotes] = useState(log?.notes ?? '');
  const [saved, setSaved] = useState(false);

  const name = lang === 'es' ? food.nameEs : food.nameEn;
  const recipes = getRecipesByFoodId(food.id);

  const handleSave = () => {
    onSaveLog(food.id, { tried, reaction, notes, date: new Date().toISOString().split('T')[0] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddToShopping = () => {
    onAddToShopping([{ nameEs: food.nameEs, nameEn: food.nameEn, tag: 'baby' }]);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'prep', label: tx.detail.tabs.prep },
    { id: 'menu', label: tx.detail.tabs.menu },
    { id: 'log',  label: tx.detail.tabs.log },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-4 py-2.5 text-green-700 text-sm flex-shrink-0"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        {tx.detail.backBtn}
      </button>

      {/* HERO */}
      <div className="bg-green-50 px-4 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{food.emoji}</span>
          <div>
            <h1 className="text-lg font-medium text-green-900">{name}</h1>
            <div className="flex gap-1.5 flex-wrap mt-1.5">
              <span className="text-[10px] bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                {tx.detail.fromMonths(food.fromMonths)}
              </span>
              {food.chokingRisk && (
                <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                  {tx.detail.chokingRisk}
                </span>
              )}
              {food.isAllergen && (
                <span className="text-[10px] bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded-full">
                  {tx.food.allergen} *
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleAddToShopping}
          className="mt-3 flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
        >
          🛒 {tx.food.addToList}
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        {TABS.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex-1 py-2.5 text-sm border-b-2 transition-colors ${
              tab === tb.id
                ? 'text-green-700 border-green-600 font-medium'
                : 'text-gray-400 border-transparent'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto">

        {/* PREPARATION */}
        {tab === 'prep' && (
          <div className="py-2">
            {/* BLW */}
            <div className="mx-4 my-2 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50">
                <span className="text-[11px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">BLW</span>
                <span className="text-[13px] font-medium text-green-900">Baby Led Weaning</span>
              </div>
              <ol className="px-4 pb-3 pt-1 space-y-1.5 list-decimal list-inside">
                {[tx.prep.blw.step1, tx.prep.blw.step2, tx.prep.blw.step3].map((s, i) => (
                  <li key={i} className="text-[13px] text-gray-500 leading-snug pl-1">{s}</li>
                ))}
              </ol>
            </div>

            {/* BLISS */}
            <div className="mx-4 my-2 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50">
                <span className="text-[11px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">BLISS</span>
                <span className="text-[13px] font-medium text-blue-900">BLISS variant</span>
              </div>
              <ol className="px-4 pb-3 pt-1 space-y-1.5 list-decimal list-inside">
                {[tx.prep.bliss.step1, tx.prep.bliss.step2, tx.prep.bliss.step3].map((s, i) => (
                  <li key={i} className="text-[13px] text-gray-500 leading-snug pl-1">{s}</li>
                ))}
              </ol>
            </div>

            {/* PURÉS */}
            <div className="mx-4 my-2 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-purple-50">
                <span className="text-[11px] font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Purés</span>
                <span className="text-[13px] font-medium text-purple-900">{tx.prep.pures.title}</span>
              </div>
              <ol className="px-4 pb-3 pt-1 space-y-1.5 list-decimal list-inside">
                {[tx.prep.pures.step1, tx.prep.pures.step2, tx.prep.pures.step3].map((s, i) => (
                  <li key={i} className="text-[13px] text-gray-500 leading-snug pl-1">{s}</li>
                ))}
              </ol>
            </div>

            {/* Cook time note */}
            <div className="mx-4 my-2 flex gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
              <span className="text-red-500 flex-shrink-0 text-sm">⏱</span>
              <p className="text-[12px] text-red-800 leading-snug">
                {tx.detail.cookTime('8–15')}
              </p>
            </div>
          </div>
        )}

        {/* MENU */}
        {tab === 'menu' && (
          <div className="py-2">
            {recipes.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">Próximamente más recetas</p>
            ) : (
              recipes.map(recipe => {
                const title = lang === 'es' ? recipe.titleEs : recipe.titleEn;
                const steps = lang === 'es' ? recipe.stepsEs : recipe.stepsEn;
                const adultDesc = lang === 'es' ? recipe.adultVersionEs : recipe.adultVersionEn;
                const adultItems = lang === 'es' ? recipe.adultIngredientsEs : recipe.adultIngredientsEn;
                const stepsText = steps.map((s, i) => `${i + 1}. ${s}`).join(' · ');

                return (
                  <div key={recipe.id} className="mx-4 my-2 border border-gray-200 rounded-xl p-3.5">
                    <h3 className="text-sm font-medium text-gray-900 mb-1.5">{title}</h3>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">⏱ {recipe.timeMin} min</span>
                      {recipe.methodBadges.map(b => (
                        <span key={b} className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                          ${b === 'BLW' ? 'bg-green-100 text-green-700'
                          : b === 'BLISS' ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{stepsText}</p>

                    {/* Adult version */}
                    <div className="mt-2.5 bg-amber-50 rounded-xl p-2.5">
                      <p className="text-[11px] font-medium text-amber-800 mb-1">
                        ⭐ {tx.detail.adultVersion}
                      </p>
                      <p className="text-[12px] text-amber-900 leading-snug">{adultDesc}</p>
                      <button
                        onClick={() => onAddToShopping(
                          adultItems.map((name, i) => ({
                            nameEs: recipe.adultIngredientsEs[i],
                            nameEn: recipe.adultIngredientsEn[i],
                            tag: 'mom' as const,
                          }))
                        )}
                        className="mt-1.5 text-[11px] text-amber-700 flex items-center gap-1"
                      >
                        🛒 {tx.detail.addAdultIngredients}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            <div className="h-4" />
          </div>
        )}

        {/* LOG / REGISTRO */}
        {tab === 'log' && (
          <div>
            {/* Toggle tried */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{tx.log.alreadyTried}</p>
                <p className="text-xs text-gray-500 mt-0.5">{tx.log.firstTime}</p>
              </div>
              <button
                onClick={() => setTried(v => !v)}
                className={`w-11 h-6 rounded-full relative transition-colors ${tried ? 'bg-green-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-all ${tried ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {/* Reactions */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-2">{tx.log.reaction}</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: 'loved' as Reaction,    emoji: '😍', label: tx.log.loved },
                  { key: 'normal' as Reaction,   emoji: '🙂', label: tx.log.normal },
                  { key: 'disliked' as Reaction, emoji: '😒', label: tx.log.disliked },
                  { key: 'reaction' as Reaction, emoji: '⚠️', label: tx.log.reaction4 },
                ]).map(r => (
                  <button
                    key={r.key}
                    onClick={() => setReaction(r.key)}
                    className={`py-2.5 rounded-xl border text-sm transition-all
                      ${reaction === r.key
                        ? `${REACTION_SELECTED[r.key!]} border-[1.5px]`
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                  >
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="px-4 py-3 border-b border-gray-100">
              <label className="text-xs text-gray-500 block mb-1.5">{tx.log.notes}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={tx.log.notesPlaceholder}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-white resize-none h-20 placeholder:text-gray-300 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Save */}
            <div className="px-4 py-3">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-medium"
              >
                {saved ? '✓ Guardado' : tx.log.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
