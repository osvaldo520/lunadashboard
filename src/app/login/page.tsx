'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email ou senha incorretos.' 
        : error.message);
      setLoading(false);
    } else {
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

      <div className="w-full max-w-md px-6">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
            <span className="text-3xl">🌙</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Luna Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Gestão inteligente de documentos
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email profissional
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@escritorio.com"
                required
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Senha inteligente
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 pr-12 text-white placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
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
                  <LogIn className="h-5 w-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Não tem conta?{' '}
            <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
