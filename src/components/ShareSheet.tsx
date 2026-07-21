import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { BabyProfile, BabyShare } from '../hooks/useAppStore';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  baby: BabyProfile;
  onClose: () => void;
  shareBaby: (babyId: string, email: string, role: 'viewer' | 'editor') => Promise<{ id: string; token: string } | null>;
  listShares: (babyId: string) => Promise<BabyShare[]>;
  revokeShare: (shareId: string) => Promise<void>;
}

export default function ShareSheet({ lang, baby, onClose, shareBaby, listShares, revokeShare }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('editor');
  const [shares, setShares] = useState<BabyShare[]>([]);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const isEs = lang === 'es';

  const reload = async () => setShares(await listShares(baby.id));
  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, [baby.id]);

  const buildLink = (token: string) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/?invite=${token}`;
  };

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFlash(isEs ? 'Correo inválido' : 'Invalid email');
      return;
    }
    setBusy(true);
    const res = await shareBaby(baby.id, email, role);
    setBusy(false);
    if (!res) {
      setFlash(isEs ? 'No se pudo crear la invitación' : 'Could not create invite');
      return;
    }
    setEmail('');
    setFlash(isEs ? 'Invitación creada ✓' : 'Invite created ✓');
    void reload();
  };

  const copy = async (token: string) => {
    try {
      await navigator.clipboard.writeText(buildLink(token));
      setFlash(isEs ? 'Link copiado' : 'Link copied');
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div
        className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEs ? 'Compartir con mi pareja' : 'Share with partner'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEs ? `Perfil de ${baby.name}` : `${baby.name}'s profile`}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <label className="block text-xs font-medium text-gray-600">
            {isEs ? 'Correo de tu pareja' : 'Partner email'}
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="pareja@correo.com"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
          />

          <div className="flex gap-2">
            {(['editor', 'viewer'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                  role === r ? 'bg-green-50 border-green-500 text-green-800' : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {r === 'editor' ? (isEs ? '✏️ Editar' : '✏️ Editor') : (isEs ? '👀 Solo ver' : '👀 Viewer')}
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={busy}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold"
          >
            {busy ? (isEs ? 'Creando...' : 'Creating...') : (isEs ? 'Crear invitación' : 'Create invite')}
          </button>

          {flash && <p className="text-xs text-center text-green-700">{flash}</p>}
        </div>

        <div className="px-5 pb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase mb-2">
            {isEs ? 'Invitaciones' : 'Invitations'}
          </p>
          {shares.length === 0 && (
            <p className="text-xs text-gray-400 py-2">
              {isEs ? 'Todavía no compartiste con nadie.' : 'No shares yet.'}
            </p>
          )}
          <ul className="space-y-2">
            {shares.map(s => (
              <li key={s.id} className="border border-gray-200 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-800 truncate">{s.invitedEmail}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {s.role === 'editor' ? (isEs ? 'Editor' : 'Editor') : (isEs ? 'Solo ver' : 'Viewer')}
                      {' · '}
                      <span className={s.status === 'accepted' ? 'text-green-600' : 'text-amber-600'}>
                        {s.status === 'accepted'
                          ? (isEs ? 'Aceptado' : 'Accepted')
                          : (isEs ? 'Pendiente' : 'Pending')}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={async () => { await revokeShare(s.id); void reload(); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
                  >
                    {isEs ? 'Quitar' : 'Remove'}
                  </button>
                </div>
                {s.status === 'pending' && (
                  <div className="mt-2 flex gap-2">
                    <input
                      readOnly
                      value={buildLink(s.token)}
                      className="flex-1 text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 truncate"
                    />
                    <button
                      onClick={() => copy(s.token)}
                      className="text-[11px] bg-gray-900 text-white rounded-lg px-3 py-1 font-medium"
                    >
                      {isEs ? 'Copiar' : 'Copy'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
