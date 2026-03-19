import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Activity,
  ArrowUpRight,
  ShieldCheck 
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Total de usuários
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 2. Total de documentos
  const { count: docCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true });

  // 3. Total de mensagens processadas
  const { count: msgCount } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action', 'message');

  // 4. Últimas análises do sistema
  const { data: recentAnalyses } = await supabase
    .from('analysis_logs')
    .select(`
      id,
      created_at,
      llm_provider,
      llm_model,
      document_id,
      documents (title)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      label: 'Usuários Cadastrados',
      value: userCount || 0,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Documentos na Nuvem',
      value: docCount || 0,
      icon: FileText,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: 'Mensagens Processadas',
      value: msgCount || 0,
      icon: MessageSquare,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Atividade de Análise',
      value: recentAnalyses?.length || 0,
      icon: Activity,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Admin Overview <ShieldCheck className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="mt-1 text-slate-400">
            Saúde global do Agente007 e métricas de uso em tempo real.
          </p>
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 transition-all hover:border-indigo-500/20"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Icon className="w-16 h-16" />
              </div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção Central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Controle Rápido */}
        <div className="lg:col-span-1 space-y-6">
           <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-6 h-full">
              <h2 className="text-lg font-bold text-white mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                 <Link href="/admin/users" className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/50 hover:bg-indigo-600 transition-all group">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">Gerenciar Planos</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                 </Link>
                 <Link href="/admin/config" className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all group">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">Provedor Global</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                 </Link>
              </div>
           </div>
        </div>

        {/* Últimas Análises do Sistema */}
        <div className="lg:col-span-2">
           <div className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-indigo-500/10 bg-slate-900/60 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-white">Análises Recentes (Global)</h2>
                 <Link href="/admin/usage" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">Ver todos os logs</Link>
              </div>
              
              <div className="divide-y divide-indigo-500/5">
                {recentAnalyses && recentAnalyses.length > 0 ? (
                  recentAnalyses.map((log: any) => (
                    <div key={log.id} className="p-4 hover:bg-slate-800/20 transition-colors flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                             <FileText className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-sm font-medium text-white">{(log.documents as any)?.title || 'Documento Removido'}</p>
                             <p className="text-[10px] text-slate-500">
                                Provedor: <span className="text-slate-400 uppercase">{log.llm_provider}</span> • 
                                Modelo: <span className="text-slate-400">{log.llm_model}</span>
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-slate-500">{new Date(log.created_at).toLocaleString('pt-BR')}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500 text-sm italic">
                    Nenhuma atividade de análise registrada ainda.
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
