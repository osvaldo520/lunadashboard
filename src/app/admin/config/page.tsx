'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { saveGlobalConfig } from './actions';
import { 
  ShieldCheck, 
  Save, 
  Cpu, 
  Volume2, 
  AlertOctagon, 
  Database,
  Loader2,
  CheckCircle
} from 'lucide-react';

/**
 * Modelos disponíveis por provedor.
 * Reflete exatamente o que o ProviderFactory e AgentController suportam.
 */
const MODELS_BY_PROVIDER: Record<string, { value: string; label: string }[]> = {
  deepseek: [
    { value: '', label: 'Padrão (DeepSeek V3)' },
  ],
  gemini: [
    { value: '', label: 'Padrão (Gemini 2.0 Flash)' },
  ],
  groq: [
    { value: '', label: 'Padrão (Llama 3)' },
  ],
  openrouter: [
    { value: 'moonshotai/kimi-k2', label: 'Kimi K2 (Moonshot)' },
    { value: 'deepseek/deepseek-v3-0324:free', label: 'DeepSeek V3 (Free)' },
    { value: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 (Free)' },
    { value: 'qwen/qwen3-235b-a22b:free', label: 'Qwen 3 235B (Free)' },
    { value: 'meta-llama/llama-4-maverick:free', label: 'Llama 4 Maverick (Free)' },
  ],
};

/**
 * Vozes reais disponíveis no TextToSpeech.ts do Bot.
 */
const VOICE_OPTIONS = [
  { value: 'casual', label: '🗣️ Casual — Google (grátis)' },
  { value: 'formal', label: '📋 Formal — Google (grátis)' },
  { value: 'calorosa', label: '🔥 Calorosa — Google (grátis)' },
  { value: 'kokoro', label: '🎙️ Kokoro Mulher — Dora (grátis)' },
  { value: 'kokoro-homem', label: '🎙️ Kokoro Homem — Alex (grátis)' },
  { value: 'edge-tts', label: '✨ Edge Francisca — Microsoft (grátis)' },
  { value: 'edge-tts-homem', label: '✨ Edge Antonio — Microsoft (grátis)' },
  { value: 'google-cloud', label: '☁️ Google Neural2 Mulher (pago)' },
  { value: 'google-cloud-homem', label: '☁️ Google Neural2 Homem (pago)' },
  { value: 'openai', label: '🤖 OpenAI Nova (pago)' },
  { value: 'openai-hd', label: '🤖 OpenAI Nova HD (pago)' },
  { value: 'elevenlabs', label: '✨ ElevenLabs Premium (pago)' },
];

export default function AdminConfigPage() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data, error } = await supabase
      .from('global_config')
      .select('*');
    
    if (data) {
      const configObj = data.reduce((acc: any, item: any) => ({
        ...acc,
        [item.key]: item.value
      }), {});
      setConfig(configObj);
    }
    setLoading(false);
  };

  const handleUpdate = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const result = await saveGlobalConfig(config);

    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(`Erro ao salvar: ${result.error}`);
    }
  };

  const selectedProvider = config.default_llm_provider || 'deepseek';
  const availableModels = MODELS_BY_PROVIDER[selectedProvider] || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Configurações Globais <ShieldCheck className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-sm text-slate-400">Controles mestres que afetam o Bot de Telegram e o Dashboard Web simultaneamente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provedor Master */}
        <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 space-y-6">
           <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                 <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Inteligência Artificial (LLM)</h2>
           </div>

           <div className="space-y-4">
              {/* Provedor */}
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Provedor Padrão</label>
                 <select 
                    value={selectedProvider}
                    onChange={(e) => {
                      handleUpdate('default_llm_provider', e.target.value);
                      // Limpar modelo ao trocar provider (exceto OpenRouter)
                      if (e.target.value !== 'openrouter') {
                        handleUpdate('default_openrouter_model', '');
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500/50 outline-none appearance-none"
                 >
                    <option value="deepseek">DeepSeek (Recomendado)</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="groq">Groq (Llama 3)</option>
                    <option value="openrouter">OpenRouter (Multi-Modelo)</option>
                 </select>
              </div>

              {/* Modelo — Dinâmico por provedor */}
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                   Modelo {selectedProvider === 'openrouter' ? 'OpenRouter' : selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}
                 </label>
                 {availableModels.length > 1 ? (
                   <select
                     value={config.default_openrouter_model || ''}
                     onChange={(e) => handleUpdate('default_openrouter_model', e.target.value)}
                     className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500/50 outline-none appearance-none"
                   >
                     {availableModels.map(m => (
                       <option key={m.value} value={m.value}>{m.label}</option>
                     ))}
                   </select>
                 ) : (
                   <div className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-500 italic">
                     {availableModels[0]?.label || 'Modelo único — sem alternativas'}
                   </div>
                 )}
                 {selectedProvider !== 'openrouter' && (
                   <p className="mt-2 text-[10px] text-slate-500 italic">
                     O provedor {selectedProvider} usa seu modelo padrão. Para escolher modelos específicos, selecione OpenRouter.
                   </p>
                 )}
              </div>

              {/* Tom de Voz */}
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Tom de Voz Padrão</label>
                 <select 
                    value={config.default_voice_tone || 'casual'}
                    onChange={(e) => handleUpdate('default_voice_tone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-indigo-500/50 outline-none appearance-none"
                 >
                    {VOICE_OPTIONS.map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                 </select>
                 <p className="mt-2 text-[10px] text-slate-500 italic">Afeta todos os usuários que não escolheram uma voz via comando /voz.</p>
              </div>
           </div>
        </div>

        {/* Recursos do Sistema */}
        <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 space-y-6">
           <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                 <Volume2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Recursos e Limites</h2>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-bold text-white">Processamento de Voz</h3>
                    <p className="text-xs text-slate-500">Permitir áudios no Telegram (STT/TTS)</p>
                 </div>
                 <button 
                  onClick={() => handleUpdate('voice_enabled', !config.voice_enabled)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-all ${config.voice_enabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
                 >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${config.voice_enabled ? 'ml-auto' : 'ml-0'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-bold text-white">Modo de Manutenção</h3>
                    <p className="text-xs text-slate-500">Bloqueia acesso ao Bot e Dashboard</p>
                 </div>
                 <button 
                  onClick={() => handleUpdate('maintenance_mode', !config.maintenance_mode)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-all ${config.maintenance_mode ? 'bg-red-500' : 'bg-slate-800'}`}
                 >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${config.maintenance_mode ? 'ml-auto' : 'ml-0'}`} />
                 </button>
              </div>
           </div>
        </div>

        {/* Base de Dados */}
        <div className="lg:col-span-2 rounded-2xl border border-rose-500/10 bg-slate-900/40 p-6 space-y-6">
           <div className="flex items-center gap-3 pb-4 border-b border-rose-500/5">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                 <AlertOctagon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white underline decoration-rose-500/30">Zonas de Risco</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => alert('Função administrativa: Limpeza via Dashboard Supabase recomendada.')}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-all"
              >
                 <Database className="w-4 h-4" /> Limpar Histórico Antigo
              </button>
              <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 text-xs font-bold opacity-50 cursor-not-allowed">
                 Reiniciar Instância VPS
              </button>
           </div>
        </div>
      </div>

      {/* Save FAB */}
      <div className="fixed bottom-10 right-10 z-50">
         <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-2xl shadow-indigo-600/40 transition-all active:scale-95 group disabled:opacity-50"
         >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5 text-emerald-300" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
            {saved ? 'Configurações Salvas!' : saving ? 'Salvando...' : 'Salvar Alterações'}
         </button>
      </div>
    </div>
  );
}
