'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Building2, Save, Loader2, CheckCircle, Moon, Sun } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  plan: string;
  telegram_id: string | null;
  telegram_pin: string | null;
  telegram_pin_expires_at: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const handleGeneratePin = async () => {
    if (!profile) return;
    
    // Gera PIN de 6 dígitos
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    // 15 minutos de validade
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error } = await supabase
      .from('profiles')
      .update({
        telegram_pin: pin,
        telegram_pin_expires_at: expiresAt
      })
      .eq('id', profile.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, telegram_pin: pin, telegram_pin_expires_at: expiresAt } : null);
    } else {
      alert("Falha ao gerar o PIN. Verifique se a migração 002 do banco foi aplicada.");
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

      {/* Appearance Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
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
      </div>

      {/* Telegram Linking (Magic Code) Section */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Vínculo com Assistente (Luna)</h3>
            <p className="text-sm text-slate-400 mt-1">
              Conecte sua conta do Telegram para interagir via chat e salvar contratos direto na nuvem.
            </p>
          </div>
        </div>

        {profile?.telegram_id ? (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> 
              Telegram Vinculado! (ID: {profile.telegram_id})
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGeneratePin}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 transition-all"
            >
              Gerar Magic Code (PIN)
            </button>

            {profile?.telegram_pin && (
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-900/20 shadow-inner">
                <p className="text-sm text-slate-300 mb-3">Envie o código abaixo para a Luna no Telegram ou use o botão mágico:</p>
                <code className="text-2xl font-mono font-bold text-white tracking-widest bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 block mb-5 w-fit shadow-lg">
                  /vincular {profile.telegram_pin}
                </code>
                
                <a 
                  href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'LunaEntrelinhasBot'}?start=${profile.telegram_pin}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2AABEE] hover:bg-[#228cbd] px-5 py-3 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                  Vincular com 1-Clique (Ir ao Telegram)
                </a>
                
                <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Este PIN de segurança expira em 15 minutos.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plan info */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Plano atual</h3>
            <p className="text-xs text-slate-400 mt-1">
              Você está no plano <span className="font-bold text-indigo-400 uppercase">{profile?.plan || 'free'}</span>
            </p>
          </div>
          <button
            disabled
            className="rounded-xl bg-indigo-600/50 px-4 py-2 text-sm text-indigo-200 cursor-not-allowed opacity-60"
          >
            Upgrade (em breve)
          </button>
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
