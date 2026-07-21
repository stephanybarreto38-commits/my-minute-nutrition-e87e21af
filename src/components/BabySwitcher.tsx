import { useState } from 'react';
import type { BabyProfile } from '../hooks/useAppStore';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  babies: BabyProfile[];
  activeBabyId: string | null;
  onSelect: (babyId: string) => void;
  onAddBaby: () => void;
}

export default function BabySwitcher({ lang, babies, activeBabyId, onSelect, onAddBaby }: Props) {
  const [open, setOpen] = useState(false);
  const active = babies.find(b => b.id === activeBabyId);
  if (!active) return null;
  const initial = active.name?.[0]?.toUpperCase() ?? '👶';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-800 hover:bg-green-100 transition"
      >
        <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-[11px] font-bold text-green-900">
          {initial}
        </span>
        <span>{active.name}</span>
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100">
              {lang === 'es' ? 'Mis bebés' : 'My babies'}
            </div>
            {babies.map(b => (
              <button
                key={b.id}
                onClick={() => { onSelect(b.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition ${
                  b.id === activeBabyId ? 'bg-green-50 text-green-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[11px] font-bold text-green-800">
                  {b.name?.[0]?.toUpperCase() ?? '👶'}
                </span>
                <span className="flex-1 truncate">{b.name}</span>
                {b.id === activeBabyId && <span className="text-green-600">✓</span>}
              </button>
            ))}
            <button
              onClick={() => { onAddBaby(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-700 border-t border-gray-100 hover:bg-green-50 font-medium"
            >
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700">+</span>
              {lang === 'es' ? 'Agregar bebé' : 'Add baby'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
