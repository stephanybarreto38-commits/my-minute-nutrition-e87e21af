import { useEffect, useState } from 'react';
import type { Lang } from '../data/translations';

type Platform = 'ios' | 'android' | 'desktop';

interface Props {
  lang: Lang;
  onClose: () => void;
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  if (isIOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

const COPY = {
  es: {
    title: 'Instalar Little Meal',
    sub: 'Agrégala a tu pantalla de inicio y ábrela como una app, sin buscar el link.',
    tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Computadora' },
    install: '⬇️ Instalar ahora',
    installed: '¡Listo! Ya está instalada 🎉',
    close: 'Entendido',
    note: 'No ocupa casi espacio: es un acceso directo que abre la app en pantalla completa.',
    steps: {
      ios: [
        'Abre esta página en **Safari** (no funciona desde Instagram o Chrome).',
        'Toca el botón **Compartir** ⬆️ en la barra inferior.',
        'Desliza y elige **“Agregar a inicio”** / “Add to Home Screen”.',
        'Toca **Agregar**. El ícono 🥑 aparecerá en tu pantalla de inicio.',
      ],
      android: [
        'Abre esta página en **Chrome**.',
        'Toca el menú **⋮** arriba a la derecha.',
        'Elige **“Instalar aplicación”** o “Agregar a pantalla principal”.',
        'Confirma con **Instalar**. Listo, ya la tienes en tu teléfono.',
      ],
      desktop: [
        'Abre la app en **Chrome, Edge o Brave**.',
        'En la barra de direcciones busca el ícono **⊕ / Instalar**.',
        'Haz clic en **Instalar** y confirma.',
        'Se abrirá en su propia ventana, como un programa más.',
      ],
    },
  },
  en: {
    title: 'Install Little Meal',
    sub: 'Add it to your home screen and open it like an app, no link needed.',
    tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Desktop' },
    install: '⬇️ Install now',
    installed: 'Done! It is installed 🎉',
    close: 'Got it',
    note: 'It barely takes space: it is a shortcut that opens the app full screen.',
    steps: {
      ios: [
        'Open this page in **Safari** (it will not work inside Instagram or Chrome).',
        'Tap the **Share** ⬆️ button in the bottom bar.',
        'Scroll and pick **“Add to Home Screen”**.',
        'Tap **Add**. The 🥑 icon will appear on your home screen.',
      ],
      android: [
        'Open this page in **Chrome**.',
        'Tap the **⋮** menu at the top right.',
        'Choose **“Install app”** or “Add to home screen”.',
        'Confirm with **Install**. That is it.',
      ],
      desktop: [
        'Open the app in **Chrome, Edge or Brave**.',
        'Look for the **⊕ / Install** icon in the address bar.',
        'Click **Install** and confirm.',
        'It opens in its own window, like any other program.',
      ],
    },
  },
} as const;

function Bold({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-gray-900">{p}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function InstallAppSheet({ lang, onClose }: Props) {
  const tx = COPY[lang];
  const [tab, setTab] = useState<Platform>('desktop');
  const [canPrompt, setCanPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setTab(detectPlatform());
    const w = window as unknown as { deferredInstallPrompt?: any };
    setCanPrompt(!!w.deferredInstallPrompt);
    const onAvailable = () => setCanPrompt(true);
    const onInstalled = () => {
      setInstalled(true);
      setCanPrompt(false);
    };
    window.addEventListener('beforeinstallprompt', onAvailable);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onAvailable);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const w = window as unknown as { deferredInstallPrompt?: any };
    const evt = w.deferredInstallPrompt;
    if (!evt) return;
    evt.prompt();
    const choice = await evt.userChoice;
    w.deferredInstallPrompt = undefined;
    setCanPrompt(false);
    if (choice?.outcome === 'accepted') setInstalled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-0 md:p-6" onClick={onClose}>
      <div
        className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-5 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <img src="/icon-192.png" alt="Little Meal" width={48} height={48} loading="lazy" className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900">{tx.title}</p>
            <p className="text-[12px] text-gray-500 mt-0.5">{tx.sub}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none px-1">×</button>
        </div>

        {installed ? (
          <p className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">{tx.installed}</p>
        ) : (
          <>
            {canPrompt && (
              <button
                onClick={handleInstall}
                className="mt-4 w-full bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl"
              >
                {tx.install}
              </button>
            )}

            <div className="mt-4 flex gap-1.5 bg-gray-100 rounded-xl p-1">
              {(['ios', 'android', 'desktop'] as Platform[]).map(p => (
                <button
                  key={p}
                  onClick={() => setTab(p)}
                  className={`flex-1 text-[11px] py-1.5 rounded-lg transition-colors ${
                    tab === p ? 'bg-white text-emerald-700 font-semibold shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {tx.tabs[p]}
                </button>
              ))}
            </div>

            <ol className="mt-3 space-y-2.5">
              {tx.steps[tab].map((step, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-gray-600 leading-snug">
                    <Bold text={step} />
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-3 text-[11px] text-gray-400">{tx.note}</p>
          </>
        )}

        <button onClick={onClose} className="mt-4 w-full border border-gray-200 text-sm text-gray-600 py-2.5 rounded-xl">
          {tx.close}
        </button>
      </div>
    </div>
  );
}
