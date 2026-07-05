import { useState } from 'react';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  onLogin: (email: string) => void;
}

type Mode = 'login' | 'register';

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
  for (const [em, val] of Object.entries(raw)) {
    if (typeof val === 'string') {
      out[em] = { password: val, approved: em === ADMIN_EMAIL, createdAt: '—' };
    } else if (val && typeof val === 'object') {
      const v = val as Partial<UserRecord>;
      out[em] = {
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

export default function LoginScreen({ lang, onToggleLang, onLogin }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEs = lang === 'es';
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = () => {
    setError('');
    setPending(false);

    if (!isValidEmail(email)) {
      setError(isEs ? 'Ingresa un correo válido.' : 'Enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setError(isEs ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getUsers();

      if (mode === 'register') {
        if (users[email]) {
          setError(isEs ? 'Este correo ya está registrado.' : 'This email is already registered.');
          setLoading(false);
          return;
        }
        const isAdmin = email === ADMIN_EMAIL;
        users[email] = {
          password,
          approved: isAdmin,
          createdAt: new Date().toLocaleDateString(isEs ? 'es-CO' : 'en-US'),
        };
        saveUsers(users);

        if (isAdmin) {
          localStorage.setItem('maminu_session', email);
          onLogin(email);
        } else {
          setPending(true);
          setLoading(false);
        }
      } else {
        if (!users[email] || users[email].password !== password) {
          setError(isEs ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.');
          setLoading(false);
          return;
        }
        if (!users[email].approved) {
          setPending(true);
          setLoading(false);
          return;
        }
        saveUsers(users);
        localStorage.setItem('maminu_session', email);
        onLogin(email);
      }
    }, 600);
  };

  if (pending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">⏳</div>
          <h2 className="text-lg font-bold text-gray-900">
            {isEs ? 'Solicitud enviada' : 'Request sent'}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-snug">
            {isEs
              ? 'Tu cuenta está pendiente de aprobación. La administradora activará tu acceso pronto.'
              : 'Your account is pending approval. The admin will activate your access soon.'}
          </p>
          <p className="text-xs text-gray-400 mt-3">{email}</p>
          <button
            onClick={() => { setPending(false); setMode('login'); }}
            className="mt-6 text-sm text-green-600 font-medium"
          >
            {isEs ? '← Volver al inicio' : '← Back to sign in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-sm flex justify-end mb-4">
        <button
          onClick={onToggleLang}
          className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
        >
          <span className={lang === 'es' ? 'text-green-600 font-semibold' : ''}>ES</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className={lang === 'en' ? 'text-green-600 font-semibold' : ''}>EN</span>
        </button>
      </div>

      <div className="w-full max-w-sm text-center mb-6">
        <div className="text-5xl mb-2">🥑</div>
        <h1 className="text-2xl font-bold text-gray-900">Little Meal</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEs ? 'Alimentación complementaria para tu bebé' : 'Complementary feeding for your baby'}
        </p>
      </div>

      <div className="w-full max-w-sm bg-gray-100 rounded-xl p-1 flex mb-4">
        <button
          onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${
            mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {isEs ? 'Ingresar' : 'Sign in'}
        </button>
        <button
          onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${
            mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          {isEs ? 'Crear cuenta' : 'Sign up'}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isEs ? 'Correo electrónico' : 'Email address'}
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={isEs ? 'tu@correo.com' : 'you@email.com'}
            autoComplete="email"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isEs ? 'Contraseña' : 'Password'}
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={isEs ? 'Mínimo 6 caracteres' : 'At least 6 characters'}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {isEs ? 'Confirmar contraseña' : 'Confirm password'}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={isEs ? 'Repite la contraseña' : 'Repeat password'}
              autoComplete="new-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          {loading
            ? (isEs ? 'Cargando...' : 'Loading...')
            : mode === 'login'
              ? (isEs ? 'Ingresar' : 'Sign in')
              : (isEs ? 'Crear cuenta' : 'Create account')}
        </button>

        {mode === 'register' && (
          <p className="text-[11px] text-gray-500 text-center leading-snug px-2">
            {isEs
              ? 'Tu cuenta requiere aprobación de la administradora antes de poder acceder.'
              : 'Your account requires admin approval before you can access.'}
          </p>
        )}
      </div>
    </div>
  );
}
