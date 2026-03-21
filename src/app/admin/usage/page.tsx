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

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Consultas de agregação
  const [
    { data: totalStats },
    { data: todayStats },
    { count: totalCount }
  ] = await Promise.all([
    supabase.from('usage_logs').select('tokens_input, tokens_output, cost_brl'),
    supabase.from('usage_logs').select('tokens_input, tokens_output, cost_brl').gte('created_at', today.toISOString()),
    supabase.from('usage_logs').select('*', { count: 'exact', head: true })
  ]);

  const totalTokens = (totalStats || []).reduce((acc, curr) => acc + (curr.tokens_input || 0) + (curr.tokens_output || 0), 0);
  const totalCost = (totalStats || []).reduce((acc, curr) => acc + (Number(curr.cost_brl) || 0), 0);
  const todayTokens = (todayStats || []).reduce((acc, curr) => acc + (curr.tokens_input || 0) + (curr.tokens_output || 0), 0);
  const todayCost = (todayStats || []).reduce((acc, curr) => acc + (Number(curr.cost_brl) || 0), 0);

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
            Metricas & Logs <History className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-slate-400">Monitoramento em tempo real do volume de requisições e custo financeiro.</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Tokens - Hoje</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-emerald-400">{todayTokens.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Custo Est. - Hoje</p>
          <div className="flex items-end gap-1">
            <span className="text-xs text-slate-400 mb-1">R$</span>
            <span className="text-2xl font-black text-white">{todayCost.toFixed(4)}</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Tokens Globais</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-indigo-400">{totalTokens.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Custo Histórico</p>
          <div className="flex items-end gap-1">
            <span className="text-xs text-slate-400 mb-1">R$</span>
            <span className="text-2xl font-black text-white">{totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-950/50 border-b border-indigo-500/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Motor/Provider</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Tokens (E/S)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Custo BRL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <p className="text-xs font-medium text-white">{new Date(log.created_at).toLocaleString('pt-BR')}</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                          {log.action === 'message' ? '💬 Chat' : '📑 Análise'}
                       </p>
                    </td>
                    
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">{(log.profiles as any)?.full_name || 'Desconhecido'}</span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {log.metadata?.telegram_id || 'Browser'}</span>
                       </div>
                    </td>

                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                             <span className="text-[10px] font-bold text-indigo-400 uppercase">
                                {log.provider || 'unknown'}
                             </span>
                          </div>
                       </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                       <div className="text-xs text-slate-300 font-mono">
                          <span className="text-emerald-500">{log.tokens_input || 0}</span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-blue-400">{log.tokens_output || 0}</span>
                       </div>
                       <p className="text-[9px] text-slate-500 uppercase font-bold">In/Out</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                       <span className="text-xs font-mono font-bold text-white">
                          R$ {log.metadata?.estimated_cost_brl || Number(log.cost_brl || 0).toFixed(4)}
                       </span>
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
           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Exibindo últimos 50 registros de um total de {totalCount}</p>
           <button className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase transition-colors">
              Próxima Página <ArrowRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </div>
  );
}
