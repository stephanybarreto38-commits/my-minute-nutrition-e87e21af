import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  onBack: () => void;
}

interface ProfileRow {
  id: string;
  email: string;
  approved: boolean;
  created_at: string;
}

const ADMIN_EMAIL = 'stephanybarreto38@gmail.com';

export default function AdminScreen({ lang, onBack }: Props) {
  const isEs = lang === 'es';
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, approved, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setProfiles(data as ProfileRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setApproved = async (id: string, approved: boolean) => {
    await supabase.from('profiles').update({ approved }).eq('id', id);
    await load();
  };

  const others = profiles.filter(p => p.email.toLowerCase() !== ADMIN_EMAIL);
  const pending = others.filter(p => !p.approved);
  const approved = others.filter(p => p.approved);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(isEs ? 'es-CO' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-5 py-4">
        <button onClick={onBack} className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          ← {isEs ? 'Volver' : 'Back'}
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isEs ? '⚙️ Panel de Admin' : '⚙️ Admin Panel'}
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5">{ADMIN_EMAIL}</p>
      </div>

      <div className="px-5 py-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
            <p className="text-xs text-gray-500">{isEs ? 'Pendientes' : 'Pending'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-green-600">{approved.length}</p>
            <p className="text-xs text-gray-500">{isEs ? 'Aprobados' : 'Approved'}</p>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-gray-500 text-center py-4">
            {isEs ? 'Cargando...' : 'Loading...'}
          </p>
        )}

        {!loading && pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              {isEs ? '⏳ Esperando aprobación' : '⏳ Awaiting approval'}
            </h2>
            <ul className="space-y-2">
              {pending.map(p => (
                <li key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{p.email}</p>
                    <p className="text-[11px] text-gray-500">
                      {isEs ? 'Registrado el ' : 'Registered '}{fmt(p.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setApproved(p.id, true)}
                    className="text-[11px] bg-green-600 text-white px-2.5 py-1 rounded-lg font-medium"
                  >
                    {isEs ? 'Aprobar' : 'Approve'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && approved.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              {isEs ? '✅ Usuarios activos' : '✅ Active users'}
            </h2>
            <ul className="space-y-2">
              {approved.map(p => (
                <li key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{p.email}</p>
                    <p className="text-[11px] text-gray-500">
                      {isEs ? 'Registrado el ' : 'Registered '}{fmt(p.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setApproved(p.id, false)}
                    className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-medium flex-shrink-0"
                  >
                    {isEs ? 'Revocar' : 'Revoke'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && others.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-4xl mb-2">👋</p>
            <p className="text-sm text-gray-500">
              {isEs ? 'Aún no hay usuarios registrados.' : 'No users registered yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
