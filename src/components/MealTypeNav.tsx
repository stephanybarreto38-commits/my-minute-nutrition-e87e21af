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
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
      {MEALS.map(({ id, icon }) => {
        const isActive = activeMeal === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              whitespace-nowrap transition-colors
              ${isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}
            `}
          >
            <span className="text-sm">{icon}</span>
            <span>{tx.home.mealNav[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
