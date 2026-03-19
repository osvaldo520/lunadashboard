import { createClient } from '@/lib/supabase/server';
import { 
  History, 
  MessageSquare, 
  Search, 
  Filter,
  ArrowRight,
  ExternalLink 
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminUsagePage() {
  const supabase = await createClient();

  // Buscar logs de uso com join no perfil
  const { data: logs, error } = await supabase
    .from('usage_logs')
    .select(`
      *,
      profiles (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 bg-red-500/5 rounded-2xl border border-red-500/20">
        Erro ao carregar logs de uso: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Logs de Consumo <History className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-slate-400">Monitoramento em tempo real das mensagens e tokens processados.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white transition-all">
              <Filter className="w-3.5 h-3.5" /> Filtrar
           </button>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950/50 border-b border-indigo-500/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Ação</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Plataforma/Meta</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                       <p className="text-xs font-medium text-white">{new Date(log.created_at).toLocaleString('pt-BR')}</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-tighter">UTC Reset {new Date(log.created_at).getHours() === 0 ? '!!!' : ''}</p>
                    </td>
                    
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">{(log.profiles as any)?.full_name || 'Desconhecido'}</span>
                          <span className="text-[10px] text-slate-500">{(log.profiles as any)?.email}</span>
                       </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                       <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/10">
                          <MessageSquare className="w-2.5 h-2.5" />
                          {log.action}
                       </div>
                    </td>

                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="p-1 rounded bg-slate-800">
                             <span className="text-[9px] font-bold text-indigo-400 uppercase">
                                {log.metadata?.telegram_id ? 'Telegram' : 'Web'}
                             </span>
                          </div>
                          <span className="text-[10px] text-slate-600 font-mono truncate max-w-[100px]">
                             {log.metadata?.telegram_id || 'Browser'}
                          </span>
                       </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                       <button className="text-slate-600 hover:text-indigo-400 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    Nenhum log de uso encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-950/30 border-t border-indigo-500/10 flex justify-between items-center">
           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Exibindo últimos 50 registros</p>
           <button className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase transition-colors">
              Próxima Página <ArrowRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </div>
  );
}
