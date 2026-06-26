import type { FeedingMethod } from '../hooks/useAppStore';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';

interface Props {
  lang: Lang;
  current: FeedingMethod;
  onSelect: (method: FeedingMethod) => void;
  onClose: () => void;
}

const METHODS: { id: FeedingMethod; badge: string; badgeColor: string; descKey: keyof typeof t['es']['method'] }[] = [
  { id: 'BLW',   badge: 'BLW',   badgeColor: 'bg-green-100 text-green-700',  descKey: 'blwDesc' },
  { id: 'BLISS', badge: 'BLISS', badgeColor: 'bg-blue-100 text-blue-700',    descKey: 'blissDesc' },
  { id: 'Purés', badge: 'Purés', badgeColor: 'bg-purple-100 text-purple-700',descKey: 'puresDesc' },
];

export default function MethodSheet({ lang, current, onSelect, onClose }: Props) {
  const tx = t[lang];

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
      onClick={onClose}
      style={{ maxWidth: '100vw' }}
    >
      <div
        className="bg-white rounded-t-2xl p-5 pb-8 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-medium text-gray-900 mb-3">{tx.method.title}</h3>
        <div className="flex flex-col gap-2">
          {METHODS.map(m => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50 text-left"
            >
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.badgeColor}`}>
                {m.badge}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {m.id === 'Purés' ? tx.method.puresTitle : m.id === 'BLW' ? 'Baby Led Weaning' : 'BLISS'}
                </p>
                <p className="text-xs text-gray-500">{tx.method[m.descKey] as string}</p>
              </div>
              {current === m.id && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-green-600 flex-shrink-0">
                  <path d="M4 9l3.5 3.5L14 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="mt-3 bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
          {tx.method.note}
        </div>
      </div>
    </div>
  );
}
