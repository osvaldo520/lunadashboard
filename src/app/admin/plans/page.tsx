'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Zap, 
  Save, 
  Clock,
  Loader2,
  CheckCircle
} from 'lucide-react';

interface PlanData {
  plan_type: string;
  messages: number;
  analysis: number;
  generations: number;
  max_documents: number;
  daily_reset: boolean;
  limit_message: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState<string | null>(null);
  const [savedPlan, setSavedPlan] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('plan_limits')
      .select('*')
      .order('plan_type');
    
    if (data) setPlans(data);
    if (error) console.error('Erro ao carregar planos:', error.message);
    setLoading(false);
  };

  const handleChange = (planType: string, field: keyof PlanData, value: any) => {
    setPlans(prev => prev.map(p => 
      p.plan_type === planType ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = async (plan: PlanData) => {
    setSavingPlan(plan.plan_type);
    setSavedPlan(null);

    const { error } = await supabase
      .from('plan_limits')
      .upsert({
        plan_type: plan.plan_type,
        messages: plan.messages,
        analysis: plan.analysis,
        generations: plan.generations,
        max_documents: plan.max_documents,
        daily_reset: plan.daily_reset,
        limit_message: plan.limit_message,
        updated_at: new Date().toISOString()
      });

    setSavingPlan(null);
    if (!error) {
      setSavedPlan(plan.plan_type);
      setTimeout(() => setSavedPlan(null), 3000);
    } else {
      alert(`Erro ao salvar plano: ${error.message}`);
    }
  };

  const planAccent: Record<string, string> = {
    free: 'bg-slate-700',
    pro: 'bg-indigo-600',
    enterprise: 'bg-amber-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Planos &amp; Cotas <Sparkles className="w-6 h-6 text-indigo-400" />
        </h1>
        <p className="text-sm text-slate-400">Defina os limites de mensagens e recursos para cada nível de assinatura. Alterações são aplicadas em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.plan_type} className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 space-y-6 relative group overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${planAccent[plan.plan_type] || 'bg-slate-700'}`} />
            
            <div className="flex items-center justify-between border-b border-indigo-500/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">{plan.plan_type}</h2>
              {savedPlan === plan.plan_type && (
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Salvo!
                </span>
              )}
            </div>

            <div className="space-y-5">
              {/* Mensagens */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Mensagens</span>
                </div>
                <input 
                  type="number" 
                  value={plan.messages} 
                  onChange={(e) => handleChange(plan.plan_type, 'messages', parseInt(e.target.value) || 0)}
                  className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-white text-right focus:border-indigo-500/50 outline-none"
                />
              </div>

              {/* Análises */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Análises</span>
                </div>
                <input 
                  type="number" 
                  value={plan.analysis} 
                  onChange={(e) => handleChange(plan.plan_type, 'analysis', parseInt(e.target.value) || 0)}
                  className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-white text-right focus:border-indigo-500/50 outline-none"
                />
              </div>

              {/* Gerações PDF */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Gerações PDF</span>
                </div>
                <input 
                  type="number" 
                  value={plan.generations} 
                  onChange={(e) => handleChange(plan.plan_type, 'generations', parseInt(e.target.value) || 0)}
                  className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-white text-right focus:border-indigo-500/50 outline-none"
                />
              </div>

              {/* Max Documentos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Max Docs</span>
                </div>
                <input 
                  type="number" 
                  value={plan.max_documents} 
                  onChange={(e) => handleChange(plan.plan_type, 'max_documents', parseInt(e.target.value) || 0)}
                  className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-white text-right focus:border-indigo-500/50 outline-none"
                />
              </div>

              {/* Toggle Reset Diário */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Reset Diário</span>
                </div>
                <button 
                  onClick={() => handleChange(plan.plan_type, 'daily_reset', !plan.daily_reset)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${plan.daily_reset ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                   <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${plan.daily_reset ? 'ml-auto' : 'ml-0'}`} />
                </button>
              </div>
            </div>

            {/* Mensagem de Limite */}
            <div className="pt-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Mensagem de Limite</label>
              <textarea 
                value={plan.limit_message || ''}
                onChange={(e) => handleChange(plan.plan_type, 'limit_message', e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-indigo-500/50 outline-none resize-none"
              />
            </div>
            
            {/* Botão Salvar */}
            <button 
              onClick={() => handleSave(plan)}
              disabled={savingPlan === plan.plan_type}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            >
               {savingPlan === plan.plan_type ? (
                 <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...</>
               ) : savedPlan === plan.plan_type ? (
                 <><CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> Salvo!</>
               ) : (
                 <><Save className="w-3.5 h-3.5" /> Salvar Plano</>
               )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
