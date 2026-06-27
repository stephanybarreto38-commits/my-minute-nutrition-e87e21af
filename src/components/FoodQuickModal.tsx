import type { Food, FoodLog, Reaction } from '../data/foods';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';

interface Props {
  lang: Lang;
  food: Food;
  existingLog?: FoodLog;
  onReact: (reaction: Reaction) => void;
  onSeePrep: () => void;
  onClose: () => void;
}

const REACTIONS: { key: Reaction; emoji: string; labelKey: keyof typeof t['es']['log'] }[] = [
  { key: 'loved',    emoji: '😍', labelKey: 'loved' },
  { key: 'normal',   emoji: '🙂', labelKey: 'normal' },
  { key: 'disliked', emoji: '😒', labelKey: 'disliked' },
  { key: 'reaction', emoji: '⚠️', labelKey: 'reaction4' },
];

const REACTION_SELECTED: Record<string, string> = {
  loved:    'border-green-500 bg-green-50 text-green-900',
  normal:   'border-blue-400 bg-blue-50 text-blue-900',
  disliked: 'border-amber-400 bg-amber-50 text-amber-900',
  reaction: 'border-red-400 bg-red-50 text-red-900',
};

export default function FoodQuickModal({ lang, food, existingLog, onReact, onSeePrep, onClose }: Props) {
  const tx = t[lang];
  const name = lang === 'es' ? food.nameEs : food.nameEn;
  const isEs = lang === 'es';
  const selectedReaction = existingLog?.reaction;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-t-2xl p-5 pb-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{food.emoji}</span>
          <div>
            <p className="text-base font-medium text-gray-900">{name}</p>
            <p className="text-xs text-green-600 font-medium">{tx.modal.firstTime}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-2">{tx.modal.howWasIt}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {REACTIONS.map(r => {
            const isSelected = selectedReaction === r.key;
            return (
              <button
                key={r.key}
                onClick={() => onReact(r.key)}
                className={`py-2.5 rounded-xl border text-sm transition-all ${isSelected ? `${REACTION_SELECTED[r.key!]} border-[1.5px]` : 'border-gray-200 bg-gray-50 text-gray-700'}`}
              >
                {r.emoji} {tx.log[r.labelKey] as string}
              </button>
            );
          })}
        </div>

        {selectedReaction === 'reaction' && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <p className="text-xs font-semibold text-red-700 mb-1">
              {isEs ? '💛 Tranquila, estás haciendo bien en registrarlo' : "💛 You're doing great by logging this"}
            </p>
            <p className="text-[11px] text-red-800 leading-relaxed">
              {isEs
                ? 'Espera al menos 72 horas antes de introducir otro alimento nuevo. Si la reacción fue grave (dificultad para respirar, hinchazón), consulta a tu pediatra de inmediato.'
                : 'Wait at least 72 hours before introducing another new food. If the reaction was severe (breathing difficulty, swelling), contact your pediatrician immediately.'}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50">
            {tx.modal.cancel}
          </button>
          <button onClick={onSeePrep} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium">
            {tx.modal.seePrep}
          </button>
        </div>
      </div>
    </div>
  );
}
