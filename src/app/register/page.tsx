'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, Loader2, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação de Senha Forte (Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\];:,.?~-]).{8,}$/;
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('A senha não atende a todos os requisitos de segurança.');
      setLoading(false);
      return;
    }

    if (!whatsapp || whatsapp.length < 10) {
      setError('Por favor, insira um número de WhatsApp válido.');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          whatsapp: whatsapp
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

      <div className="w-full max-w-md px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
            <span className="text-3xl">⚖️</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Criar Conta
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Comece a usar a Judite agora
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="full-name" className="text-sm font-medium text-slate-300">
                Nome completo
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
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label htmlFor="whatsapp" className="text-sm font-medium text-slate-300">
                WhatsApp com DDD
              </label>
              <div className="relative">
                <input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))} // Limita a apenas números
                  placeholder="11999999999"
                  maxLength={11}
                  required
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 pr-12 text-white placeholder:text-slate-600 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-300 flex justify-between">
                <span>Senha inteligente</span>
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
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Regras da Senha */}
              <div className="mt-2 space-y-1.5 p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Requisitos da Senha:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className={`flex items-center gap-1.5 text-[11px] ${password.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    Mín. 8 caracteres
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] ${/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    1 Letra Maiúscula
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] ${/[a-z]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    1 Letra Minúscula
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] ${/\d/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    1 Número
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] ${/[!@#$%^&*()_+{}[\];:,.?~-]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*()_+{}[\];:,.?~-]/.test(password) ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    1 Símbolo (!@#...)
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium text-slate-300">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  required
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 pr-12 text-white placeholder:text-slate-600 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                />
                {confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {password === confirmPassword ? (
                      <span className="text-emerald-500 text-xs font-bold">Coincide</span>
                    ) : (
                      <span className="text-red-500 text-xs font-bold">Diferente</span>
                    )}
                  </div>
                )}
              </div>
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
                  Criar conta
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Já tem conta?{' '}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
