import { useState } from 'react';
import type { FeedingMethod } from '../hooks/useAppStore';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  onComplete: (name: string, birthDate: string, method: FeedingMethod) => void;
}

type Step = 1 | 2 | 3;

const METHODS: { id: FeedingMethod; emoji: string; titleEs: string; titleEn: string; descEs: string; descEn: string }[] = [
  {
    id: 'BLW',
    emoji: '🤲',
    titleEs: 'Baby Led Weaning',
    titleEn: 'Baby Led Weaning',
    descEs: 'El bebé se alimenta solo con trozos de comida desde el inicio.',
    descEn: 'Baby self-feeds with finger foods from the start.',
  },
  {
    id: 'BLISS',
    emoji: '🥄',
    titleEs: 'BLISS',
    titleEn: 'BLISS',
    descEs: 'Variante de BLW. Siempre incluye alimento rico en hierro y energía.',
    descEn: 'BLW variant. Always includes iron-rich and energy-rich food.',
  },
  {
    id: 'Purés',
    emoji: '🍲',
    titleEs: 'Purés y papillas',
    titleEn: 'Purees',
    descEs: 'Método tradicional. Progresar a texturas antes de los 10 meses.',
    descEn: 'Traditional spoon method. Progress to textures before 10 months.',
  },
];

export default function OnboardingScreen({ lang, onToggleLang, onComplete }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [method, setMethod] = useState<FeedingMethod | null>(null);

  const isEs = lang === 'es';

  const handleNext = () => {
    if (step === 1 && babyName.trim()) setStep(2);
    else if (step === 2 && birthDate) setStep(3);
    else if (step === 3 && method) onComplete(babyName.trim(), birthDate, method);
  };

  const canNext =
    (step === 1 && babyName.trim().length > 0) ||
    (step === 2 && birthDate !== '') ||
    (step === 3 && method !== null);

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      {/* Lang toggle */}
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={onToggleLang}
          className="flex bg-gray-100 rounded-full border border-gray-200 overflow-hidden text-xs"
        >
          <span className={`px-2.5 py-1 ${lang === 'es' ? 'bg-green-600 text-white rounded-full' : 'text-gray-500'}`}>ES</span>
          <span className={`px-2.5 py-1 ${lang === 'en' ? 'bg-green-600 text-white rounded-full' : 'text-gray-500'}`}>EN</span>
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-3 pb-6">
        {([1, 2, 3] as Step[]).map(s => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? 'w-6 bg-green-600' : s < step ? 'w-2 bg-green-300' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col px-6 overflow-y-auto">

        {/* STEP 1 — Baby name */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-5">🐣</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              {isEs ? '¡Hola mamá!' : 'Hello mama!'}
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              {isEs
                ? 'Vamos a crear el perfil de tu bebé para personalizar su plan de alimentación.'
                : 'Let\'s create your baby\'s profile to personalize their feeding plan.'}
            </p>
            <label className="text-xs font-medium text-gray-500 self-start mb-1.5">
              {isEs ? '¿Cómo se llama tu bebé?' : 'What\'s your baby\'s name?'}
            </label>
            <input
              type="text"
              value={babyName}
              onChange={e => setBabyName(e.target.value)}
              placeholder={isEs ? 'Nombre del bebé' : 'Baby\'s name'}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
              onKeyDown={e => e.key === 'Enter' && canNext && handleNext()}
            />
          </div>
        )}

        {/* STEP 2 — Birth date */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-5">🎂</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              {isEs ? `¿Cuándo nació ${babyName}?` : `When was ${babyName} born?`}
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              {isEs
                ? 'Con la fecha de nacimiento calculamos automáticamente qué alimentos puede introducir según su edad.'
                : 'We use the birth date to automatically show which foods are appropriate for their age.'}
            </p>
            <label className="text-xs font-medium text-gray-500 self-start mb-1.5">
              {isEs ? 'Fecha de nacimiento' : 'Date of birth'}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
            />
            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-xs text-green-800 text-left w-full">
              {isEs
                ? '💡 La alimentación complementaria se recomienda iniciar a los 6 meses.'
                : '💡 Complementary feeding is recommended to start at 6 months.'}
            </div>
          </div>
        )}

        {/* STEP 3 — Feeding method */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🍽️</div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                {isEs ? '¿Qué método de alimentación usarás?' : 'Which feeding method will you use?'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEs
                  ? 'Puedes cambiarlo después en cualquier momento.'
                  : 'You can change this anytime later.'}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    method === m.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{m.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${method === m.id ? 'text-green-900' : 'text-gray-800'}`}>
                      {isEs ? m.titleEs : m.titleEn}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {isEs ? m.descEs : m.descEn}
                    </p>
                  </div>
                  {method === m.id && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green-600 flex-shrink-0 ml-auto mt-0.5">
                      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/>
                      <path d="M6 10l2.5 2.5L14 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="px-6 pb-8 pt-4 flex gap-3 flex-shrink-0">
        {step > 1 && (
          <button
            onClick={() => setStep(s => (s - 1) as Step)}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-gray-50"
          >
            {isEs ? 'Atrás' : 'Back'}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canNext}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            canNext
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {step === 3
            ? (isEs ? '¡Empezar! 🎉' : 'Let\'s go! 🎉')
            : (isEs ? 'Siguiente' : 'Next')}
        </button>
      </div>
    </div>
  );
}
