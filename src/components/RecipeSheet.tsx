import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import type { Recipe } from '../data/recipes';

interface Props {
  lang: Lang;
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeSheet({ lang, recipe, onClose }: Props) {
  const tx = t[lang];
  const title = lang === 'es' ? recipe.titleEs : recipe.titleEn;
  const steps = lang === 'es' ? recipe.stepsEs : recipe.stepsEn;
  const adultDesc = lang === 'es' ? recipe.adultVersionEs : recipe.adultVersionEn;
  const stepsText = steps.map((s, i) => `${i + 1}. ${s}`).join(' · ');

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 p-0 md:p-6" onClick={onClose}>
      <div
        className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {lang === 'es' ? 'Receta' : 'Recipe'}
          </p>
          <button onClick={onClose} className="text-gray-400 text-sm px-2">✕</button>
        </div>

        <div className="mx-4 my-3 border border-gray-200 rounded-xl p-3.5">
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

          <div className="mt-2.5 bg-amber-50 rounded-xl p-2.5">
            <p className="text-[11px] font-medium text-amber-800 mb-1">⭐ {tx.detail.adultVersion}</p>
            <p className="text-[12px] text-amber-900 leading-snug">{adultDesc}</p>
          </div>
        </div>
        <div className="h-2" />
      </div>
    </div>
  );
}
