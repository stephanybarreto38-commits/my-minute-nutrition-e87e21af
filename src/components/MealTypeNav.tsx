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
    <div className="grid grid-cols-4 gap-2 px-4 pt-1 pb-3 md:gap-3">
      {MEALS.map(({ id, icon }) => {
        const isActive = activeMeal === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              w-full min-w-0 flex flex-col items-center justify-center gap-1 px-1 py-2
              md:py-3
              rounded-2xl transition-colors
              ${isActive
                ? 'bg-green-50 border-[1.5px] border-green-600'
                : 'bg-white border border-gray-200'}
            `}
          >

            <span className="text-xl leading-none">{icon}</span>
            <span className={`text-[11px] leading-tight text-center truncate w-full ${isActive ? 'font-medium text-green-900' : 'text-gray-500'}`}>
              {tx.home.mealNav[id]}
            </span>

          </button>
        );
      })}
    </div>
  );
}
