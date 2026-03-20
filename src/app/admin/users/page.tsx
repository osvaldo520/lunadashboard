'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users as UsersIcon, 
  Search, 
  CheckCircle2, 
  Clock, 
  Loader2,
  CheckCircle,
  Ban,
  Settings,
  X
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan_type: string;
  telegram_id: string | null;
  created_at: string;
  custom_messages_limit?: number | null;
  custom_analysis_limit?: number | null;
  custom_generations_limit?: number | null;
  custom_max_docs?: number | null;
  custom_daily_reset?: boolean | null;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  
  // Custom Limits Modal State
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [savingCustom, setSavingCustom] = useState(false);
  const [customLimits, setCustomLimits] = useState({
    custom_messages_limit: '',
    custom_analysis_limit: '',
    custom_generations_limit: '',
    custom_max_docs: '',
    custom_daily_reset: false
  });

  const supabase = createClient();

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProfiles(data);
    if (error) console.error('Erro ao carregar perfis:', error.message);
    setLoading(false);
  };

  const handlePlanChange = async (profileId: string, newPlan: string) => {
    setSavingId(profileId);
    setSavedId(null);

    // Atualiza local state imediatamente (optimistic update)
    setProfiles(prev => prev.map(p => 
      p.id === profileId ? { ...p, plan_type: newPlan } : p
    ));

    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: newPlan })
      .eq('id', profileId);

    setSavingId(null);
    if (!error) {
      setSavedId(profileId);
      setTimeout(() => setSavedId(null), 3000);
    } else {
      alert(`Erro ao atualizar plano: ${error.message}`);
      loadProfiles(); // Reverte UI em caso de erro
    }
  };

  const openLimitsModal = (profile: Profile) => {
    setEditingProfile(profile);
    setCustomLimits({
      custom_messages_limit: profile.custom_messages_limit?.toString() || '',
      custom_analysis_limit: profile.custom_analysis_limit?.toString() || '',
      custom_generations_limit: profile.custom_generations_limit?.toString() || '',
      custom_max_docs: profile.custom_max_docs?.toString() || '',
      custom_daily_reset: profile.custom_daily_reset || false
    });
  };

  const handleSaveCustomLimits = async () => {
    if (!editingProfile) return;
    setSavingCustom(true);
    
    const payload = {
      custom_messages_limit: customLimits.custom_messages_limit ? parseInt(customLimits.custom_messages_limit) : null,
      custom_analysis_limit: customLimits.custom_analysis_limit ? parseInt(customLimits.custom_analysis_limit) : null,
      custom_generations_limit: customLimits.custom_generations_limit ? parseInt(customLimits.custom_generations_limit) : null,
      custom_max_docs: customLimits.custom_max_docs ? parseInt(customLimits.custom_max_docs) : null,
      custom_daily_reset: customLimits.custom_daily_reset ? true : null
    };

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', editingProfile.id);

    if (!error) {
      setProfiles(prev => prev.map(p => 
        p.id === editingProfile.id ? { ...p, ...payload } : p
      ));
      setEditingProfile(null);
    } else {
      alert(`Erro ao salvar overrides: ${error.message}`);
    }
    setSavingCustom(false);
  };


  const planColors: Record<string, string> = {
    free: 'bg-slate-700 text-slate-300',
    pro: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30',
    enterprise: 'bg-amber-600/20 text-amber-400 border border-amber-500/30',
  };

  const filteredProfiles = profiles.filter(p => {
    const q = search.toLowerCase();
    return !q || 
      (p.full_name?.toLowerCase().includes(q)) || 
      (p.email?.toLowerCase().includes(q));
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Gestão de Usuários <UsersIcon className="w-6 h-6 text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-400">Total de {profiles.length} usuários registrados na plataforma.</p>
        </div>
        
        {/* Barra de Busca Funcional */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-950/50 border-b border-indigo-500/10">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Usuário</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status Vínculo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Plano Ativo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Membro Desde</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/5">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-indigo-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm">
                        {profile.full_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{profile.full_name || 'Usuário sem nome'}</p>
                        <p className="text-xs text-slate-500 mb-1">{profile.email}</p>
                        { (profile.custom_messages_limit || profile.custom_analysis_limit || profile.custom_generations_limit) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            VIP OVERRIDE ATIVO
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {profile.telegram_id ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        TELEGRAM VINCULADO
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold border border-slate-700">
                        <Clock className="w-3 h-3" />
                        AGUARDANDO VÍNCULO
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md ${planColors[profile.plan_type] || planColors.free}`}>
                      {profile.plan_type || 'FREE'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <p className="text-xs text-slate-400">{new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-600">{new Date(profile.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>

                   <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button 
                         onClick={() => openLimitsModal(profile)}
                         className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                         title="Customizar Limites / Superpoderes"
                       >
                         <Settings className="w-4 h-4" />
                       </button>

                       <select 
                         value={profile.plan_type || 'free'}
                         onChange={(e) => handlePlanChange(profile.id, e.target.value)}
                         disabled={savingId === profile.id}
                         className="bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 rounded-lg px-2 py-1 outline-none focus:border-indigo-500/50 disabled:opacity-50"
                       >
                          <option value="free">FREE</option>
                          <option value="pro">PRO</option>
                          <option value="enterprise">ENT.</option>
                       </select>
                       
                       {savingId === profile.id && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />}
                       {savedId === profile.id && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                     {search ? 'Nenhum usuário encontrado com esse filtro.' : 'Nenhum usuário registrado.'}
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL VIP OVERRIDES */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-500" />
                Superpoderes (VIP Limits)
              </h3>
              <button onClick={() => setEditingProfile(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400 mb-6">
                Defina limites isolados para <strong className="text-indigo-400">{editingProfile.email}</strong>. 
                Se preenchidos, eles anulam as regras do plano corporativo. Deixe em branco para respeitar o padrão do plano {editingProfile.plan_type.toUpperCase()}.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Max Mensagens</label>
                  <input 
                    type="number" value={customLimits.custom_messages_limit}
                    onChange={(e) => setCustomLimits(p => ({...p, custom_messages_limit: e.target.value}))}
                    placeholder="Vazio = Padrão"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Max Análises</label>
                  <input 
                    type="number" value={customLimits.custom_analysis_limit}
                    onChange={(e) => setCustomLimits(p => ({...p, custom_analysis_limit: e.target.value}))}
                    placeholder="Vazio = Padrão"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Criar/Gerar PDFs (Saída)</label>
                  <input 
                    type="number" value={customLimits.custom_generations_limit}
                    onChange={(e) => setCustomLimits(p => ({...p, custom_generations_limit: e.target.value}))}
                    placeholder="Vazio = Padrão"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Upload de Docs (Entrada)</label>
                  <input 
                    type="number" value={customLimits.custom_max_docs}
                    onChange={(e) => setCustomLimits(p => ({...p, custom_max_docs: e.target.value}))}
                    placeholder="Vazio = Padrão"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-slate-800">
                 <button onClick={() => setEditingProfile(null)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">Cancelar</button>
                 <button onClick={handleSaveCustomLimits} disabled={savingCustom} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                   {savingCustom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />} Salvar Overrides
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
