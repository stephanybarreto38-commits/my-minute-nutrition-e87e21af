import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  onBack: () => void;
}

interface UserRecord {
  password: string;
  approved: boolean;
  createdAt: string;
}

const ADMIN_EMAIL = 'stephanybarreto38@gmail.com';
const STORAGE_KEY = 'maminu_users';

function getUsers(): Record<string, UserRecord> {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, unknown>;
  const out: Record<string, UserRecord> = {};
  for (const [email, val] of Object.entries(raw)) {
    if (typeof val === 'string') {
      // legacy shape: just a password string
      out[email] = { password: val, approved: email === ADMIN_EMAIL, createdAt: '—' };
    } else if (val && typeof val === 'object') {
      const v = val as Partial<UserRecord>;
      out[email] = {
        password: v.password ?? '',
        approved: v.approved ?? false,
        createdAt: v.createdAt ?? '—',
      };
    }
  }
  return out;
}

function saveUsers(users: Record<string, UserRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export default function AdminScreen({ lang, onBack }: Props) {
  const isEs = lang === 'es';

  const users = getUsers();
  const emails = Object.keys(users).filter(e => e !== ADMIN_EMAIL);
  const pending = emails.filter(e => !users[e].approved);
  const approved = emails.filter(e => users[e].approved);

  const approve = (email: string) => {
    const updated = getUsers();
    updated[email].approved = true;
    saveUsers(updated);
    window.location.reload();
  };

  const revoke = (email: string) => {
    const updated = getUsers();
    updated[email].approved = false;
    saveUsers(updated);
    window.location.reload();
  };

  const remove = (email: string) => {
    const updated = getUsers();
    delete updated[email];
    saveUsers(updated);
    window.location.reload();
  };

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

        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              {isEs ? '⏳ Esperando aprobación' : '⏳ Awaiting approval'}
            </h2>
            <ul className="space-y-2">
              {pending.map(email => (
                <li key={email} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{email}</p>
                    <p className="text-[11px] text-gray-500">
                      {isEs ? 'Registrado el ' : 'Registered '}{users[email].createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => approve(email)}
                      className="text-[11px] bg-green-600 text-white px-2.5 py-1 rounded-lg font-medium"
                    >
                      {isEs ? 'Aprobar' : 'Approve'}
                    </button>
                    <button
                      onClick={() => remove(email)}
                      className="text-[11px] bg-red-100 text-red-600 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {isEs ? 'Eliminar' : 'Delete'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {approved.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              {isEs ? '✅ Usuarios activos' : '✅ Active users'}
            </h2>
            <ul className="space-y-2">
              {approved.map(email => (
                <li key={email} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{email}</p>
                    <p className="text-[11px] text-gray-500">
                      {isEs ? 'Registrado el ' : 'Registered '}{users[email].createdAt}
                    </p>
                  </div>
                  <button
                    onClick={() => revoke(email)}
                    className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-medium flex-shrink-0"
                  >
                    {isEs ? 'Revocar' : 'Revoke'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {emails.length === 0 && (
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
