import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
}

const TIPS_ES = [
  { emoji: '🔄', text: 'Un bebé puede necesitar probar un alimento hasta 15 veces antes de aceptarlo. ¡La paciencia es clave!' },
  { emoji: '⏰', text: 'Espera 3 días entre cada alimento nuevo. Así puedes identificar si hay alguna reacción.' },
  { emoji: '💧', text: 'El agua se puede ofrecer desde los 6 meses en pequeñas cantidades con las comidas.' },
  { emoji: '🥦', text: 'Los sabores amargos como el brócoli son importantes. No los evites — los bebés pueden aprenderlos a amar.' },
  { emoji: '🤌', text: 'El desorden es aprendizaje. Tocar, oler y explorar la comida es parte del proceso.' },
  { emoji: '🫁', text: 'Si tu bebé hace una mueca no significa que no le gustó. Puede ser solo el sabor nuevo.' },
  { emoji: '🌿', text: 'Las hierbas suaves como el cilantro y la albahaca se pueden introducir desde los 6 meses.' },
  { emoji: '🎯', text: 'BLISS recomienda siempre incluir un alimento rico en hierro en cada comida.' },
  { emoji: '🌡️', text: 'La comida para bebés debe estar tibia, no caliente. Prueba siempre con tu muñeca.' },
  { emoji: '🤱', text: 'La leche materna o fórmula sigue siendo el alimento principal hasta los 12 meses.' },
  { emoji: '🥄', text: 'No hay un método perfecto. BLW, BLISS o purés — lo mejor es lo que funciona para tu familia.' },
  { emoji: '🫶', text: 'Come junto a tu bebé siempre que puedas. Ver a los adultos comer es la mejor motivación.' },
];

const TIPS_EN = [
  { emoji: '🔄', text: 'A baby may need to try a food up to 15 times before accepting it. Patience is key!' },
  { emoji: '⏰', text: 'Wait 3 days between each new food. This helps you identify any reactions.' },
  { emoji: '💧', text: 'Water can be offered from 6 months in small amounts with meals.' },
  { emoji: '🥦', text: "Bitter flavors like broccoli are important. Don't avoid them — babies can learn to love them." },
  { emoji: '🤌', text: 'Mess is learning. Touching, smelling and exploring food is part of the process.' },
  { emoji: '🫁', text: "A grimace doesn't mean they didn't like it. It might just be the new flavor." },
  { emoji: '🌿', text: 'Mild herbs like cilantro and basil can be introduced from 6 months.' },
  { emoji: '🎯', text: 'BLISS recommends always including an iron-rich food in every meal.' },
  { emoji: '🌡️', text: 'Baby food should be warm, not hot. Always test on your wrist first.' },
  { emoji: '🤱', text: 'Breast milk or formula remains the main food until 12 months.' },
  { emoji: '🥄', text: "There's no perfect method. BLW, BLISS or purées — the best is what works for your family." },
  { emoji: '🫶', text: 'Eat together with your baby whenever you can. Watching adults eat is the best motivation.' },
];

export default function WeeklyTip({ lang }: Props) {
  const tips = lang === 'es' ? TIPS_ES : TIPS_EN;
  const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const tip = tips[weekNumber % tips.length];

  return (
    <div className="mx-4 mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 flex gap-2.5 items-start">
      <span className="text-lg flex-shrink-0 mt-0.5">{tip.emoji}</span>
      <div>
        <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide mb-0.5">
          {lang === 'es' ? 'Tip de la semana' : 'Tip of the week'}
        </p>
        <p className="text-[12px] text-blue-900 leading-relaxed">{tip.text}</p>
      </div>
    </div>
  );
}
