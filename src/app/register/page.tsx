'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, Loader2, Phone } from 'lucide-react';
import { useLocale, LocaleToggle } from '@/lib/i18n';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState(''); // Agora opcional
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // confirmPassword removido — reduzir atrito no cadastro
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLocale();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação de Senha Forte (Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\];:,.?~-]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setError(t('register.passwordError'));
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          ...(whatsapp && { whatsapp })
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      // Como o Supabase Email Confirmation está desligado, 
      // o usuário já está logado. Redireciona na hora pro app.
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
      </div>

      <div className="absolute top-4 right-6"><LocaleToggle /></div>
      <div className="w-full max-w-md px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4 overflow-hidden">
            <img src="/judite-logo.png" alt="Judite Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t('register.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {t('register.subtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="full-name" className="text-sm font-medium text-slate-300">
                {t('register.nameLabel')}
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. João Silva"
                required
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                {t('register.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@escritorio.com"
                required
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* WhatsApp — Opcional */}
            <div className="space-y-1.5">
              <label htmlFor="whatsapp" className="text-sm font-medium text-slate-300 flex justify-between">
                <span>{t('register.whatsappLabel')} <span className="text-slate-600 font-normal">{t('register.whatsappOptional')}</span></span>
              </label>
              <div className="relative">
                <input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                  placeholder="11999999999"
                  maxLength={11}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 pr-12 text-white placeholder:text-slate-600 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
              </div>
              <p className="text-[10px] text-slate-600">{t('register.whatsappHint')}</p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-300 flex justify-between">
                <span>{t('register.passwordLabel')}</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha segura"
                  required
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 pr-12 text-white placeholder:text-slate-600 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Regras da Senha — Só mostra o que falta */}
              {password.length > 0 && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/50">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { ok: password.length >= 8, label: '8+ chars' },
                      { ok: /[A-Z]/.test(password), label: t('register.uppercase') },
                      { ok: /[a-z]/.test(password), label: t('register.lowercase') },
                      { ok: /\d/.test(password), label: t('register.number') },
                      { ok: /[!@#$%^&*()_+{}[\];:,.?~-]/.test(password), label: t('register.symbol') },
                    ].map((rule) => (
                      <span key={rule.label} className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        rule.ok ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800/50'
                      }`}>
                        {rule.ok ? '✓' : '○'} {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400" role="alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold 
                hover:bg-indigo-700 active:scale-[0.98] 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  {t('register.submit')}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {t('register.hasAccount')}{' '}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              {t('register.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
