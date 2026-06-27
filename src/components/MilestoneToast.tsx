import { useEffect, useState } from 'react';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  babyName: string;
  triedCount: number;
  lastFoodName: string;
  lastFoodEmoji: string;
  lastFoodCategory: string;
  onDismiss: () => void;
}

function getMilestone(count: number, lang: string, name: string, foodEmoji: string, foodName: string, category: string) {
  const isEs = lang === 'es';
  if (count === 1) return {
    emoji: '🎉',
    title: isEs ? `¡Primer alimento de ${name}!` : `${name}'s first food!`,
    sub: isEs ? `${foodEmoji} ${foodName} — el inicio de una gran aventura` : `${foodEmoji} ${foodName} — the start of a great adventure`,
  };
  if (count === 5) return {
    emoji: '⭐',
    title: isEs ? '¡5 alimentos probados!' : '5 foods tried!',
    sub: isEs ? `${name} está explorando sabores increíbles` : `${name} is exploring amazing flavors`,
  };
  if (count === 10) return {
    emoji: '🏆',
    title: isEs ? '¡10 alimentos! ¡Increíble!' : '10 foods! Amazing!',
    sub: isEs ? `Eres una mamá espectacular. ${name} lo sabe 💚` : `You're a wonderful mama. ${name} knows it 💚`,
  };
  if (count === 20) return {
    emoji: '🌟',
    title: isEs ? '¡20 alimentos probados!' : '20 foods tried!',
    sub: isEs ? `${name} tiene un paladar aventurero` : `${name} has an adventurous palate`,
  };
  if (count === 30) return {
    emoji: '🎊',
    title: isEs ? '¡30 alimentos! ¡Qué progreso!' : '30 foods! What progress!',
    sub: isEs ? `La alimentación de ${name} es cada vez más variada` : `${name}'s diet is getting more and more varied`,
  };
  if (category === 'proteins' && count <= 5) return {
    emoji: '💪',
    title: isEs ? `¡Primera proteína de ${name}!` : `${name}'s first protein!`,
    sub: isEs ? `${foodEmoji} ${foodName} — clave para su desarrollo` : `${foodEmoji} ${foodName} — key for development`,
  };
  return {
    emoji: foodEmoji,
    title: isEs ? `¡${foodName} anotado!` : `${foodName} logged!`,
    sub: isEs ? `Ya son ${count} alimentos probados 🌱` : `${count} foods tried so far 🌱`,
  };
}

export default function MilestoneToast({ lang, babyName, triedCount, lastFoodName, lastFoodEmoji, lastFoodCategory, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 400); }, 3200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const m = getMilestone(triedCount, lang, babyName, lastFoodEmoji, lastFoodName, lastFoodCategory);

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-sm bg-white border border-green-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 transition-all duration-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
      <span className="text-3xl flex-shrink-0">{m.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight">{m.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{m.sub}</p>
      </div>
      <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }} className="text-gray-300 flex-shrink-0 text-lg leading-none">×</button>
    </div>
  );
}
