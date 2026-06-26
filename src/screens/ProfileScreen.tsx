import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import type { FeedingMethod } from '../hooks/useAppStore';
import type { BabyProfile } from '../hooks/useAppStore';
import type { FoodLog } from '../data/foods';

interface Props {
  lang: Lang;
  baby: BabyProfile;
  babyMonths: number;
  method: FeedingMethod;
  foodLogs: Record<string, FoodLog>;
  totalFoods: number;
  onMethodChange: (m: FeedingMethod) => void;
}

const METHODS: FeedingMethod[] = ['BLW', 'BLISS', 'Purés'];

export default function ProfileScreen({
  lang, baby, babyMonths, method, foodLogs, totalFoods, onMethodChange,
}: Props) {
  const tx = t[lang];

  const triedCount = Object.values(foodLogs).filter(l => l.tried).length;
  const recipesCount = 3; // placeholder
  const reactionCount = Object.values(foodLogs).filter(l => l.reaction === 'reaction').length;
  const progress = Math.round((triedCount / totalFoods) * 100);

  const birthFormatted = new Date(baby.birthDate).toLocaleDateString(
    lang === 'es' ? 'es-CO' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  const stats = [
    { value: triedCount,    label: tx.profile.statTried,    color: 'text-green-700' },
    { value: recipesCount,  label: tx.profile.statRecipes,  color: 'text-blue-700' },
    { value: reactionCount, label: tx.profile.statReaction, color: 'text-amber-700' },
    { value: `${progress}%`, label: tx.profile.statProgress, color: 'text-green-600' },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-900">{tx.profile.title(baby.name)}</h2>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-5">
        <div className="w-18 h-18 rounded-full bg-green-100 flex items-center justify-center text-4xl mb-2">
          🐣
        </div>
        <p className="text-lg font-medium text-gray-900">{baby.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {babyMonths} {lang === 'es' ? 'meses' : 'months'} · {tx.profile.bornLabel(birthFormatted)}
        </p>
      </div>

      {/* Stats */}
      <div className="mx-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Method selector */}
      <div className="px-4 py-4">
        <p className="text-sm font-medium text-gray-900 mb-2">{tx.profile.activeMethod}</p>
        <div className="flex gap-2">
          {METHODS.map(m => {
            const isActive = m === method;
            return (
              <button
                key={m}
                onClick={() => onMethodChange(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all border-2
                  ${isActive
                    ? 'bg-green-50 border-green-600 text-green-900 font-medium'
                    : 'bg-gray-50 border-transparent text-gray-400'
                  }`}
              >
                <span>{m}</span>
                {isActive && (
                  <p className="text-[10px] text-green-600 mt-0.5">{tx.profile.active}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
