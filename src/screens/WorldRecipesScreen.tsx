import { useState } from 'react';
import type { Lang } from '../data/translations';
import { COUNTRIES, getRecipesByCountry } from '../data/worldRecipes';
import type { WorldRecipe } from '../data/worldRecipes';

interface Props {
  lang: Lang;
  babyMonths: number;
}

export default function WorldRecipesScreen({ lang, babyMonths }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<WorldRecipe['country']>('mexico');
  const isEs = lang === 'es';
  const recipes = getRecipesByCountry(selectedCountry);
  const country = COUNTRIES.find(c => c.id === selectedCountry)!;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-base font-medium text-gray-900">
          {isEs ? '🌍 Recetas del mundo' : '🌍 World recipes'}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {isEs ? 'Inspiración de cocinas del mundo adaptadas para bebés' : 'World cuisine inspiration adapted for babies'}
        </p>
      </div>
      <div className="flex gap-2 px-4 py-3 overflow-x-auto flex-shrink-0">
        {COUNTRIES.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all ${
              selectedCountry === c.id ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-xl">{c.flag}</span>
            <span className={`text-[10px] font-medium ${selectedCountry === c.id ? 'text-green-700' : 'text-gray-500'}`}>
              {isEs ? c.nameEs : c.nameEn}
            </span>
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{isEs ? country.nameEs : country.nameEn}</p>
            <p className="text-[11px] text-gray-400">{recipes.length} {isEs ? 'recetas' : 'recipes'}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {recipes.map(recipe => {
            const title = isEs ? recipe.titleEs : recipe.titleEn;
            const desc = isEs ? recipe.descEs : recipe.descEn;
            const steps = isEs ? recipe.stepsEs : recipe.stepsEn;
            const adultVersion = isEs ? recipe.adultVersionEs : recipe.adultVersionEn;
            const ready = recipe.fromMonths <= babyMonths;
            return (
              <div key={recipe.id} className={`rounded-xl border p-3.5 ${ready ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                <div className="flex items-start gap-2.5 mb-2">
                  <span className="text-2xl flex-shrink-0">{recipe.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{title}</p>
                      {ready ? (
                        <span className="text-[10px] bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                          {isEs ? '¡ya puede!' : 'ready!'}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {isEs ? `desde ${recipe.fromMonths}m` : `from ${recipe.fromMonths}m`}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-2.5 flex-wrap">
                  <span className="text-[10px] text-gray-400">⏱ {recipe.timeMin} min</span>
                  {recipe.methodBadges.map(b => (
                    <span key={b} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      b === 'BLW' ? 'bg-green-100 text-green-700' : b === 'BLISS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>{b}</span>
                  ))}
                </div>
                <ol className="space-y-1 mb-2.5">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[12px] text-gray-600 leading-snug">
                      <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                  <p className="text-[10px] font-medium text-amber-700 mb-0.5">⭐ {isEs ? 'Versión adulto' : 'Adult version'}</p>
                  <p className="text-[11px] text-amber-900 leading-snug">{adultVersion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
