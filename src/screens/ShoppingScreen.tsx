import type { Lang } from '../data/translations';
import { t } from '../data/translations';
import type { ShoppingItem, ShoppingSection } from '../hooks/useAppStore';

interface Props {
  lang: Lang;
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const SECTION_ORDER: ShoppingSection[] = ['produce', 'protein', 'dairy', 'pantry'];

export default function ShoppingScreen({ lang, items, onToggle, onClear }: Props) {
  const tx = t[lang];

  const grouped: Record<ShoppingSection, ShoppingItem[]> = {
    produce: [], protein: [], dairy: [], pantry: [],
  };
  for (const it of items) {
    const key = (SECTION_ORDER.includes(it.section) ? it.section : 'pantry') as ShoppingSection;
    grouped[key].push(it);
  }

  const SectionLabel = ({ label }: { label: string }) => (
    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 pt-3 pb-2">
      {label}
    </p>
  );

  const ItemRow = ({ item }: { item: ShoppingItem }) => {
    const name = lang === 'es' ? item.nameEs : item.nameEn;
    const tagLabel = item.tag === 'baby' ? tx.shopping.baby : tx.shopping.mom;
    const tagColor = item.tag === 'baby'
      ? 'bg-green-100 text-green-700'
      : 'bg-amber-100 text-amber-700';

    return (
      <button
        onClick={() => onToggle(item.id)}
        className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 w-full text-left"
      >
        <span className={`w-5 h-5 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center
          ${item.checked ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}
        >
          {item.checked && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-300' : 'text-gray-800'}`}>
          {name}
        </span>
        {item.quantity > 1 && (
          <span className="text-[11px] font-semibold text-gray-500">×{item.quantity}</span>
        )}
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagColor}`}>
          {tagLabel}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-base font-medium text-gray-900">{tx.shopping.title}</h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50"
        >
          {tx.shopping.clear}
        </button>
      </div>

    <div className="flex-1 min-h-0 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">{tx.shopping.empty}</p>
        ) : (
          <>
            {SECTION_ORDER.map(section => {
              const rows = grouped[section];
              if (!rows.length) return null;
              return (
                <div key={section}>
                  <SectionLabel label={tx.shopping[section]} />
                  {rows.map(item => <ItemRow key={item.id} item={item} />)}
                </div>
              );
            })}
          </>
        )}
        <div className="h-4" />
      </div>
    </div>
  );
}
