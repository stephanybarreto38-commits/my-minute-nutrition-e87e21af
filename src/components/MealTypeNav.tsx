import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import type { MealType } from '../data/recipes';

interface Props {
  lang: Lang;
  activeMeal: MealType;
  onChange: (meal: MealType) => void;
}

const MEALS: { id: MealType; icon: string }[] = [
  { id: 'breakfast', icon: '🌅' },
  { id: 'lunch', icon: '☀️' },
  { id: 'dinner', icon: '🌙' },
  { id: 'snack', icon: '🍎' },
];

export default function MealTypeNav({ lang, activeMeal, onChange }: Props) {
  const tx = t[lang];

  return (
    <div className="flex items-center gap-2 px-4 pt-1 pb-3 overflow-x-auto md:grid md:grid-cols-4 md:gap-3 md:overflow-visible">
      {MEALS.map(({ id, icon }) => {
        const isActive = activeMeal === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              flex-shrink-0 flex flex-col items-center justify-center gap-1 min-w-[64px] px-3.5 py-2
              md:w-full md:min-w-0 md:py-3
              rounded-2xl transition-colors
              ${isActive
                ? 'bg-green-50 border-[1.5px] border-green-600'
                : 'bg-white border border-gray-200'}
            `}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className={`text-[11px] ${isActive ? 'font-medium text-green-900' : 'text-gray-500'}`}>
              {tx.home.mealNav[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
