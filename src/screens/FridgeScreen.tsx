import { useState } from 'react';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import { FOODS, getFoodById } from '../data/foods';
import { getRecipesByIngredients } from '../data/recipes';

interface Props {
  lang: Lang;
  babyName: string;
  triedFoodIds: string[];
  onBack: () => void;
  onFoodClick: (foodId: string) => void;
}

export default function FridgeScreen({ lang, babyName, triedFoodIds, onBack, onFoodClick }: Props) {
  const tx = t[lang];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const triedFoods = FOODS.filter(f => triedFoodIds.includes(f.id));
  const recipes = showResults ? getRecipesByIngredients([...selected]) : [];

  const toggle = (id: string) => {
    setSelected(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setShowResults(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <button onClick={onBack} className="text-green-700">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 16L7 10l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <h2 className="text-base font-medium text-gray-900">{tx.fridge.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-4 mt-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-800">
          {tx.fridge.info(babyName)}
        </div>

        {triedFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <span className="text-5xl mb-4">🥣</span>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {lang === 'es' ? 'Aún no hay alimentos probados' : 'No foods tried yet'}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === 'es'
                ? `Cuando marques alimentos como probados en la pantalla principal, aparecerán aquí para crear recetas con lo que ${babyName} ya conoce.`
                : `When you mark foods as tried on the home screen, they'll appear here to create recipes with what ${babyName} already knows.`}
            </p>
            <button
              onClick={onBack}
              className="mt-6 bg-green-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl"
            >
              {lang === 'es' ? '← Ir a alimentos' : '← Go to foods'}
            </button>
          </div>
        ) : (
          <>
        <p className="px-4 pt-3 pb-2 text-sm text-gray-500">{tx.fridge.selectLabel}</p>

        <div className="grid grid-cols-3 gap-2 px-4 pb-3">
          {triedFoods.map(food => {
            const isSelected = selected.has(food.id);
            const name = lang === 'es' ? food.nameEs : food.nameEn;
            return (
              <button
                key={food.id}
                onClick={() => toggle(food.id)}
                className={`rounded-xl border p-2.5 flex flex-col items-center gap-1 transition-colors
                  ${isSelected ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'}`}
              >
                <span className="text-[22px] leading-none">{food.emoji}</span>
                <span className="text-[10px] text-gray-600 leading-tight text-center">{name}</span>
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-3">
          <button
            onClick={() => setShowResults(true)}
            className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-medium"
          >
            {tx.fridge.showRecipes}
          </button>
        </div>

        {showResults && (
          <>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 pb-2">
              {tx.fridge.resultsLabel}
            </p>

            {recipes.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6 px-4">{tx.fridge.noResults}</p>
            ) : (
              recipes.map(recipe => {
                const title = lang === 'es' ? recipe.titleEs : recipe.titleEn;
                return (
                  <div key={recipe.id} className="mx-4 mb-3 bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {recipe.foodIds.map(id => getFoodById(id)?.emoji).join('')}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{title}</p>
                        <p className="text-[11px] text-gray-400">
                          {recipe.timeMin} min · {recipe.methodBadges.join(' + ')}
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                      {(lang === 'es' ? recipe.stepsEs : recipe.stepsEn).join(' · ')}
                    </p>
                    <button
                      onClick={() => onFoodClick(recipe.foodIds[0])}
                      className="mt-2 text-[11px] text-green-700 flex items-center gap-1"
                    >
                      → {lang === 'es' ? 'Ver preparación completa' : 'See full preparation'}
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}
        <div className="h-4" />
          </>
        )}
      </div>
    </div>
  );
}
