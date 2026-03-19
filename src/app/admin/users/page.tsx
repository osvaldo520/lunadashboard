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
  Ban
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan_type: string;
  telegram_id: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
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
                        <p className="text-xs text-slate-500">{profile.email}</p>
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
                    <div className="flex items-center justify-end gap-2">
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
    </div>
  );
}
