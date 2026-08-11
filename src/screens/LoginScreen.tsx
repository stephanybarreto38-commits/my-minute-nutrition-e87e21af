import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  onLogin: (email: string) => void;
}

type Mode = 'login' | 'register';

const PURCHASE_URL = 'https://pay.hotmart.com/E106617642L';

const ensureAccessRequest = async (userId: string, userEmail: string) => {
  const normalizedEmail = userEmail.trim().toLowerCase();
  await supabase.from('profiles').upsert(
    { id: userId, email: normalizedEmail, approved: false },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  await supabase.from('user_roles').upsert(
    { user_id: userId, role: 'user' },
    { onConflict: 'user_id,role', ignoreDuplicates: true },
  );
};

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

  const handleSubmit = async () => {
    setError('');
    setPending(false);
    if (!isValidEmail(email)) { setError(isEs ? 'Ingresa un correo válido.' : 'Enter a valid email.'); return; }
    if (password.length < 6) { setError(isEs ? 'Mínimo 6 caracteres.' : 'At least 6 characters.'); return; }
    if (mode === 'register' && password !== confirmPassword) {
      setError(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) { setError(signUpError.message); setLoading(false); return; }
        const userId = data.user?.id;
        if (userId) {
          await ensureAccessRequest(userId, normalizedEmail);
          const { data: profile } = await supabase.from('profiles').select('approved').eq('id', userId).maybeSingle();
          if (profile?.approved) { onLogin(email); return; }
        }
        await supabase.auth.signOut();
        setPending(true); setLoading(false);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (signInError) { setError(isEs ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.'); setLoading(false); return; }
        const userId = data.user?.id;
        if (userId) await ensureAccessRequest(userId, normalizedEmail);
        const { data: profile } = await supabase.from('profiles').select('approved').eq('id', userId!).maybeSingle();
        if (!profile?.approved) { await supabase.auth.signOut(); setPending(true); setLoading(false); return; }
        onLogin(email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  if (pending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-lg font-bold text-gray-900">
            {isEs ? 'Este correo aún no tiene acceso' : 'This email has no access yet'}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-snug">
            {isEs
              ? 'No encontramos una compra activa con este correo. Compra Little Meal y tu acceso se activa automáticamente con el mismo correo.'
              : 'We could not find an active purchase for this email. Buy Little Meal and your access is activated automatically with the same email.'}
          </p>
          <p className="text-xs text-gray-400 mt-3">{email}</p>
          <a
            href={PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {isEs ? 'Comprar acceso' : 'Get access'}
          </a>
          <p className="text-[11px] text-gray-400 mt-3 leading-snug">
            {isEs
              ? 'Si ya compraste, usa el mismo correo de la compra o espera unos minutos y vuelve a intentar.'
              : 'If you already purchased, use the same email from your purchase or wait a few minutes and try again.'}
          </p>
          <button onClick={() => { setPending(false); setMode('login'); }} className="mt-5 text-sm text-green-600 font-medium">
            {isEs ? '← Volver al inicio' : '← Back to sign in'}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-sm flex justify-end mb-4">
        <button onClick={onToggleLang} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
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
        <button onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
          {isEs ? 'Ingresar' : 'Sign in'}
        </button>
        <button onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
          {isEs ? 'Crear cuenta' : 'Sign up'}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isEs ? 'Correo electrónico' : 'Email address'}
          </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" autoComplete="email"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isEs ? 'Contraseña' : 'Password'}
          </label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEs ? 'Mínimo 6 caracteres' : 'At least 6 characters'}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {isEs ? 'Confirmar contraseña' : 'Confirm password'}
            </label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-green-400 focus:bg-white"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
          {loading ? (isEs ? 'Cargando...' : 'Loading...') : mode === 'login' ? (isEs ? 'Ingresar' : 'Sign in') : (isEs ? 'Crear cuenta' : 'Create account')}
        </button>
        <p className="text-center text-xs text-gray-500 pt-1">
          {isEs ? '¿Aún no tienes acceso? ' : "Don't have access yet? "}
          <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold underline">
            {isEs ? 'Comprar Little Meal' : 'Buy Little Meal'}
          </a>
        </p>
      </div>
    </div>
  );
}
