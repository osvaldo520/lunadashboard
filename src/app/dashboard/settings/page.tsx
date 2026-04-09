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
  whatsapp_id: string | null;
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

      {/* Channels Linking (Magic Code) Section - Moved to top for better Onboarding UX */}
      <div id="telegram-link">
        <LinkChannelsCard profile={profile!} supabase={supabase} onUpdate={loadProfile} />
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
// Componente de Vínculo de Canais (Omnichannel)
// ─────────────────────────────────────────────────
import { RefreshCw, Link2, Unlink, Timer, Smartphone } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';

function LinkChannelsCard({ 
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
    if (!profile.telegram_pin || !profile.telegram_pin_expires_at || (profile.telegram_id && profile.whatsapp_id)) return;

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
  }, [profile.telegram_pin, profile.telegram_pin_expires_at, profile.telegram_id, profile.whatsapp_id]);

  // Escuta supersônica do Supabase Realtime
  useEffect(() => {
    if (!profile.id) return;

    const channel = supabase
      .channel(`profile_changes_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profile.id}`
        },
        (payload) => {
          // Se de repente o telegram_id ou whatsapp_id surgir, atualizamos
          if (payload.new.telegram_id !== profile.telegram_id || payload.new.whatsapp_id !== profile.whatsapp_id) {
            onUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile.id, profile.telegram_id, profile.whatsapp_id, supabase, onUpdate]);

  const handleGeneratePin = async () => {
    setGenerating(true);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error } = await supabase
      .from('profiles')
      .update({ telegram_pin: pin, telegram_pin_expires_at: expiresAt })
      .eq('id', profile.id);

    if (!error) {
      onUpdate();
    }
    setGenerating(false);
  };

  const handleUnlink = async (channel: 'telegram' | 'whatsapp') => {
    if (!confirm(`Tem certeza que deseja desvincular o ${channel === 'telegram' ? 'Telegram' : 'WhatsApp'}?`)) return;
    
    const updates = channel === 'telegram' 
      ? { telegram_id: null } 
      : { whatsapp_id: null };

    // Se ambos estão desvinculados após isso, zera o PIN também
    if ((channel === 'telegram' && !profile.whatsapp_id) || (channel === 'whatsapp' && !profile.telegram_id)) {
      Object.assign(updates, { telegram_pin: null, telegram_pin_expires_at: null });
    }

    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    onUpdate();
  };

  const hasPinActive = profile.telegram_pin && !isExpired;
  
  // Handlers para UI de estados
  const renderLinkedChannel = (channel: 'telegram' | 'whatsapp') => {
    const isTelegram = channel === 'telegram';
    const colorClass = isTelegram ? 'blue' : 'emerald';
    const icon = isTelegram ? (
      <svg className={`w-5 h-5 text-${colorClass}-400 fill-current`} viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
    ) : (
      <Smartphone className={`w-5 h-5 text-${colorClass}-400`} />
    );

    return (
      <div className={`p-4 rounded-xl border border-${colorClass}-500/20 bg-${colorClass}-500/5 flex flex-col justify-between h-full space-y-4`}>
         <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-${colorClass}-500/10`}>
            {icon}
          </div>
          <div>
            <h3 className="text-md font-semibold text-white">{isTelegram ? 'Telegram' : 'WhatsApp'} Vinculado</h3>
            <p className="text-xs text-slate-400">Ativo e aguardando comandos.</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleUnlink(channel)}
          className="text-xs text-slate-500 hover:text-red-400 mt-auto flex items-center gap-1 transition-colors self-start"
        >
          <Unlink className="w-3 h-3" /> Desvincular {isTelegram ? 'Telegram' : 'WhatsApp'}
        </button>
      </div>
    );
  };

  const renderLinkOptions = (channel: 'telegram' | 'whatsapp') => {
    const isTelegram = channel === 'telegram';
    const numWa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const botTg = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'JuditeAI_bot';

    const linkHref = isTelegram 
      ? `https://t.me/${botTg}?start=vincular_${profile.telegram_pin}`
      : `https://wa.me/${numWa}?text=vincular_${profile.telegram_pin}`;

    return (
      <div className="p-4 rounded-xl border border-indigo-500/20 bg-slate-900/50 flex flex-col space-y-4 h-full">
        <div>
          <h4 className="text-sm font-semibold text-white mb-1">Vincular {isTelegram ? 'Telegram' : 'WhatsApp'}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            {isTelegram ? 'O aplicativo mais fluido e rápido para lidar com arquivos grandes.' : 'O mensageiro líder de mercado. Praticidade extrema para consultas rápidas.'}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 mt-auto">
          {!hasPinActive ? (
            <button
               onClick={handleGeneratePin}
               disabled={generating}
               className="flex justify-center items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-white font-medium transition-all shadow-sm text-xs border border-slate-700"
             >
               {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
               Gerar Código de Vínculo
            </button>
          ) : (
            <a 
              href={linkHref} 
              target="_blank" 
              rel="noreferrer"
              className={`flex justify-center items-center gap-2 rounded-lg ${isTelegram ? 'bg-[#2AABEE] hover:bg-[#228cbd]' : 'bg-[#25D366] hover:bg-[#1DA851]'} px-4 py-2.5 text-white font-medium transition-all shadow-md text-xs`}
            >
              {isTelegram ? '📱 Enviar no Telegram' : '📱 Enviar no WhatsApp'}
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10">
          <Link2 className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Mensageiros e Dispositivos</h3>
          <p className="text-sm text-slate-400">Gerencie por onde a Judite vai responder aos seus comandos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slot Telegram */}
        {profile.telegram_id ? renderLinkedChannel('telegram') : renderLinkOptions('telegram')}
        
        {/* Slot WhatsApp */}
        {profile.whatsapp_id ? renderLinkedChannel('whatsapp') : renderLinkOptions('whatsapp')}
      </div>

      {hasPinActive && (
        <div className="col-span-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
           <div className="flex flex-col gap-1 w-full text-center sm:text-left">
             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seu Magic Code (PIN)</span>
             <p className="text-[11px] text-slate-500 mb-1">Pesquise pela Judite no celular e envie esse código, ou clique nos botões acima.</p>
             <code className="text-xl font-mono text-white tracking-widest">{profile.telegram_pin}</code>
           </div>
           
           <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                <Timer className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-mono text-indigo-300 font-bold">{countdown}</span>
              </div>
              <button
                onClick={handleGeneratePin}
                disabled={generating}
                className="text-xs flex items-center justify-center gap-1.5 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                title="Regerar código"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      )}

      {isExpired && (!profile.telegram_id || !profile.whatsapp_id) && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-amber-400 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" />
            O código expirou.
          </p>
          <button
            onClick={handleGeneratePin}
            disabled={generating}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm text-white font-medium transition-all flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Gerar Novo
          </button>
        </div>
      )}
    </div>
  );
}

