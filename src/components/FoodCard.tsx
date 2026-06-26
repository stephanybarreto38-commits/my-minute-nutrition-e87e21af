import type { Food, FoodLog } from '../data/foods';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';

interface Props {
  food: Food;
  log?: FoodLog;
  lang: Lang;
  onClick: () => void;
}

const REACTION_EMOJI: Record<string, string> = {
  loved: '😍',
  normal: '🙂',
  disliked: '😒',
  reaction: '⚠️',
};

export default function FoodCard({ food, log, lang, onClick }: Props) {
  const tx = t[lang];
  const tried = log?.tried ?? false;
  const isNew = food.status === 'new';
  const isAvoid = food.status === 'avoid';
  const name = lang === 'es' ? food.nameEs : food.nameEn;

  let cardClass = 'relative bg-gray-50 border border-gray-200';
  if (tried) cardClass = 'relative bg-gray-50 border border-gray-200';
  if (isNew) cardClass = 'relative bg-green-50 border-[1.5px] border-green-500';
  if (isAvoid) cardClass = 'relative bg-red-50 border border-red-200';

  return (
    <button
      onClick={onClick}
      className={`${cardClass} rounded-xl p-2.5 text-center cursor-pointer w-full flex flex-col items-center`}
    >
      {tried && (
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-green-600 rounded-full flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}

      <span className="text-2xl leading-none mb-1">{food.emoji}</span>
      <span className="text-[10px] text-gray-800 leading-tight font-medium">
        {name}{food.isAllergen ? '*' : ''}
      </span>

      <span className="text-[9px] mt-0.5 leading-none">
        {tried && log?.reaction
          ? REACTION_EMOJI[log.reaction]
          : isNew
          ? <span className="text-green-700 font-medium flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full inline-block" />
              {tx.food.suggested}
            </span>
          : isAvoid
          ? <span className="text-red-700">{tx.food.avoidUntil(food.fromMonths)}</span>
          : <span className="text-gray-400">{tx.food.fromMonths(food.fromMonths)}</span>
        }
      </span>
    </button>
  );
}
