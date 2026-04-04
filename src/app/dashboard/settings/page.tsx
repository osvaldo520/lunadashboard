'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Building2, Save, Loader2, CheckCircle, Moon, Sun, Zap, Crown } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  plan: string;
  plan_type: string;
  plan_expires_at: string | null;
  telegram_id: string | null;
  telegram_pin: string | null;
  telegram_pin_expires_at: string | null;
  expert_mode: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expertToggling, setExpertToggling] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        company_name: profile.company_name,
        phone: profile.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };


  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Configurações</h1>
        <p className="mt-1 text-sm text-slate-400">
          Gerencie seu perfil e preferências.
        </p>
      </div>

      {/* Telegram Linking (Magic Code) Section - Moved to top for better Onboarding UX */}
      <div id="telegram-link">
        <TelegramLinkCard profile={profile!} supabase={supabase} onUpdate={loadProfile} />
      </div>

      {/* Expert Mode Section */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 ${
        profile?.expert_mode 
          ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 shadow-lg shadow-amber-500/5' 
          : 'border-slate-800 bg-slate-900/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
              profile?.expert_mode 
                ? 'bg-amber-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/10' 
                : 'bg-slate-800 border border-slate-700'
            }`}>
              <Zap className={`h-5 w-5 transition-colors duration-300 ${profile?.expert_mode ? 'text-amber-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Modo Expert</h3>
                {profile?.expert_mode && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider animate-pulse">
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile?.expert_mode 
                  ? 'Precisão jurídica máxima — Motor premium da Judite IA' 
                  : 'Ative para usar o motor de IA mais avançado da Judite'
                }
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              if (!profile) return;
              setExpertToggling(true);
              const newValue = !profile.expert_mode;
              const { error } = await supabase
                .from('profiles')
                .update({ expert_mode: newValue })
                .eq('id', profile.id);
              if (!error) {
                setProfile(prev => prev ? { ...prev, expert_mode: newValue } : null);
              }
              setExpertToggling(false);
            }}
            disabled={expertToggling}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
              profile?.expert_mode ? 'bg-amber-500' : 'bg-slate-700'
            } ${expertToggling ? 'opacity-50' : ''}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                profile?.expert_mode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {profile?.expert_mode && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-300/90 leading-relaxed">
              ⚡ O Modo Expert utiliza o motor de IA mais preciso da Judite para análises jurídicas de alta complexidade. 
              Cada interação consome <strong>5x mais</strong> do seu limite diário.
            </p>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10">
            <User className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Perfil</h2>
            <p className="text-xs text-slate-500">Informações pessoais e de contato</p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="full-name" className="text-sm font-medium text-slate-300">Nome completo</label>
          <input
            id="full-name"
            type="text"
            value={profile?.full_name || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-white
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Email (readonly) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-600">O email não pode ser alterado.</p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-300">Telefone</label>
          <input
            id="phone"
            type="tel"
            value={profile?.phone || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
            placeholder="(11) 99999-0000"
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-600
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Company Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
            <Building2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Empresa / Escritório</h2>
            <p className="text-xs text-slate-500">Dados profissionais</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-slate-300">Nome da empresa</label>
          <input
            id="company"
            type="text"
            value={profile?.company_name || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, company_name: e.target.value } : null)}
            placeholder="Ex: Escritório Silva Advocacia"
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-600
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Appearance Section — Comentado até implementação completa */}
      {/* <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10">
              {theme === 'dark' ? <Moon className="h-5 w-5 text-amber-400" /> : <Sun className="h-5 w-5 text-amber-400" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Tema</h3>
              <p className="text-xs text-slate-500">{theme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            Alternar
          </button>
        </div>
      </div> */}


      {/* Plan & Upgrade */}
      <div className={`rounded-2xl border p-6 ${
        (profile?.plan_type || profile?.plan || 'free') === 'pro' 
          ? 'border-emerald-500/20 bg-emerald-500/5' 
          : 'border-indigo-500/20 bg-indigo-500/5'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              (profile?.plan_type || profile?.plan || 'free') === 'pro'
                ? 'bg-emerald-500/20 border border-emerald-500/30'
                : 'bg-indigo-500/20 border border-indigo-500/30'
            }`}>
              <Crown className={`h-5 w-5 ${
                (profile?.plan_type || profile?.plan || 'free') === 'pro' ? 'text-emerald-400' : 'text-indigo-400'
              }`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Plano atual</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {(profile?.plan_type || profile?.plan || 'free') === 'pro' ? (
                  profile?.plan_expires_at ? (
                    <span className="text-amber-400 font-bold">PRO — Cancelado, acesso até {new Date(profile.plan_expires_at).toLocaleDateString('pt-BR')}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">PRO — Limites renovam diariamente</span>
                  )
                ) : (
                  <span>Plano <span className="font-bold text-indigo-400 uppercase">gratuito</span> — 50 mensagens totais</span>
                )}
              </p>
            </div>
          </div>
          {(profile?.plan_type || profile?.plan || 'free') !== 'pro' ? (
            <button
              onClick={async () => {
                setUpgrading(true);
                try {
                  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
                    method: 'POST',
                  });
                  
                  if (error) throw error;
                  if (data?.url) {
                    window.location.href = data.url;
                  } else {
                    alert('Erro ao iniciar checkout. Tente novamente.');
                  }
                } catch (err) {
                  console.error('[Checkout]', err);
                  alert('Erro ao conectar com Stripe.');
                } finally {
                  setUpgrading(false);
                }
              }}
              disabled={upgrading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white 
                hover:bg-indigo-500 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              {upgrading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Redirecionando...</>
              ) : (
                <><Crown className="h-4 w-4" /> Upgrade para Pro</>
              )}
            </button>
          ) : profile?.plan_expires_at ? (
            /* Cancelamento pendente — acesso até fim do ciclo */
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                ⏳ Cancelado
              </span>
              <button
                onClick={async () => {
                  setUpgrading(true);
                  try {
                    const { data, error } = await supabase.functions.invoke('stripe-portal', {
                      method: 'POST',
                    });
                    if (error) throw error;
                    if (data?.url) window.location.href = data.url;
                  } catch (err) {
                    console.error('[Portal]', err);
                    alert('Erro ao conectar com Stripe.');
                  } finally {
                    setUpgrading(false);
                  }
                }}
                disabled={upgrading}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2 font-medium"
              >
                {upgrading ? '⏳ Redirecionando...' : 'Reativar assinatura'}
              </button>
            </div>
          ) : (
            /* Pro ativo normal */
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                ✅ Ativo
              </span>
              <button
                onClick={async () => {
                  setUpgrading(true);
                  try {
                    const { data, error } = await supabase.functions.invoke('stripe-portal', {
                      method: 'POST',
                    });
                    if (error) throw error;
                    if (data?.url) window.location.href = data.url;
                  } catch (err) {
                    console.error('[Portal]', err);
                    alert('Erro ao conectar com Stripe.');
                  } finally {
                    setUpgrading(false);
                  }
                }}
                disabled={upgrading}
                className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
              >
                {upgrading ? '⏳ Redirecionando...' : 'Gerenciar assinatura'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold 
          hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 shadow-lg shadow-indigo-500/25"
      >
        {saving ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Salvando...</>
        ) : saved ? (
          <><CheckCircle className="h-5 w-5" /> Salvo com sucesso!</>
        ) : (
          <><Save className="h-5 w-5" /> Salvar alterações</>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Componente de Vínculo com Telegram (Magic Code)
// ─────────────────────────────────────────────────
import { RefreshCw, Link2, Unlink, Timer } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';

function TelegramLinkCard({ 
  profile, 
  supabase, 
  onUpdate 
}: { 
  profile: Profile; 
  supabase: SupabaseClient; 
  onUpdate: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Countdown em tempo real
  useEffect(() => {
    if (!profile.telegram_pin || !profile.telegram_pin_expires_at || profile.telegram_id) return;

    const tick = () => {
      const now = Date.now();
      const expires = new Date(profile.telegram_pin_expires_at!).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setIsExpired(true);
        setCountdown('00:00');
        return;
      }

      setIsExpired(false);
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    tick(); // executar imediatamente
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [profile.telegram_pin, profile.telegram_pin_expires_at, profile.telegram_id]);

  const handleGeneratePin = async () => {
    setGenerating(true);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error } = await supabase
      .from('profiles')
      .update({ telegram_pin: pin, telegram_pin_expires_at: expiresAt })
      .eq('id', profile.id);

    if (!error) {
      onUpdate(); // Recarrega o perfil da tela principal
    }
    setGenerating(false);
  };

  const handleUnlink = async () => {
    if (!confirm('Tem certeza que deseja desvincular o Telegram?')) return;
    
    await supabase
      .from('profiles')
      .update({ telegram_id: null, telegram_pin: null, telegram_pin_expires_at: null })
      .eq('id', profile.id);

    onUpdate();
  };

  // ── Estado: JÁ VINCULADO ──
  if (profile.telegram_id) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
            <Link2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Telegram Vinculado</h3>
            <p className="text-sm text-slate-400">Sua conta do Telegram está conectada com a Judite.</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <p className="text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Assistente pronta para receber comandos via Telegram.
          </p>
          <button 
            onClick={handleUnlink}
            className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Unlink className="w-3 h-3" /> Desvincular
          </button>
        </div>
      </div>
    );
  }

  // ── Estado: PIN ATIVO (não expirado) ──
  const hasPinActive = profile.telegram_pin && !isExpired;

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10">
          <svg className="w-5 h-5 text-blue-400 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Conectar Telegram</h3>
          <p className="text-sm text-slate-400">Vincule sua conta para conversar com a Judite via Telegram.</p>
        </div>
      </div>

      {hasPinActive ? (
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-900/20 space-y-4">
          <p className="text-sm text-slate-300">Clique no botão abaixo para vincular automaticamente, ou copie o comando para enviar manualmente:</p>
          
          <div className="flex items-center gap-3">
            <code className="text-2xl font-mono font-bold text-white tracking-widest bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 shadow-lg">
              /vincular {profile.telegram_pin}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`/vincular ${profile.telegram_pin}`);
                const btn = document.getElementById('copy-pin-btn');
                if (btn) { btn.textContent = '✅ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000); }
              }}
              id="copy-pin-btn"
              className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-2 rounded-lg transition-all whitespace-nowrap"
            >
              📋 Copiar
            </button>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-mono text-blue-300">
              Expira em <span className="font-bold">{countdown}</span>
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a 
                href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'JuditeAI_bot'}?start=pin_${profile.telegram_pin}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-1 justify-center items-center gap-2 rounded-xl bg-[#2AABEE] hover:bg-[#228cbd] px-5 py-3 text-white font-medium transition-all shadow-lg shadow-blue-500/20 text-sm"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                Abrir no Aplicativo (Mobile/App)
              </a>
              
              <a 
                href={`https://web.telegram.org/a/#?tgaddr=${encodeURIComponent(`tg://resolve?domain=${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'JuditeAI_bot'}&start=pin_${profile.telegram_pin}`)}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-1 justify-center items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 text-white font-medium transition-all shadow-lg shadow-slate-900/50 text-sm"
              >
                🌐 Abrir no navegador (Web)
              </a>

              <button
                onClick={handleGeneratePin}
                disabled={generating}
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-all flex items-center justify-center gap-2 shrink-0 sm:w-auto w-full"
                title="Gerar um novo PIN"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            💡 Se o Telegram Web abrir sem vincular, cole o comando copiado na conversa com a Judite e envie.
          </p>
        </div>
      ) : isExpired ? (
        // ── Estado: PIN EXPIROU ──
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
          <p className="text-amber-400 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" />
            O PIN anterior expirou. Gere um novo para continuar.
          </p>
          <button
            onClick={handleGeneratePin}
            disabled={generating}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm text-white font-medium transition-all flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Gerar Novo Magic Code
          </button>
        </div>
      ) : (
        // ── Estado: NENHUM PIN GERADO ──
        <button
          onClick={handleGeneratePin}
          disabled={generating}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
          Gerar Magic Code (PIN)
        </button>
      )}
    </div>
  );
}

