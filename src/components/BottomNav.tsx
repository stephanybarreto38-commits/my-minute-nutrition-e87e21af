import type { Screen } from '../hooks/useAppStore';
import type { Lang } from '../data/translations';
import { t } from '../data/translations';

interface Props {
  current: Screen;
  lang: Lang;
  babyName: string;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { screen: Screen; emoji: string; labelKey: keyof typeof t['es']['nav'] }[] = [
  { screen: 'home',     emoji: '🏠', labelKey: 'home' },
  { screen: 'shopping', emoji: '🛒', labelKey: 'shopping' },
  { screen: 'profile',  emoji: '🐣', labelKey: 'profile' },
];

export default function BottomNav({ current, lang, babyName, onNavigate }: Props) {
  const tx = t[lang];

  return (
    <nav className="flex border-t border-gray-100 bg-white flex-shrink-0">
      {NAV_ITEMS.map(item => {
        const isActive = current === item.screen;
        const label = item.labelKey === 'profile' ? babyName : tx.nav[item.labelKey];
        return (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors
              ${isActive ? 'text-green-700' : 'text-gray-400'}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="text-[22px] leading-none">{item.emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
