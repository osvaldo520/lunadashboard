import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { getServerLocale, createT } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const locale = await getServerLocale();
  const t = createT(locale);

  // Buscar métricas
  const { count: totalDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true });

  const { count: completedDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: pendingDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: recentDocs } = await supabase
    .from('documents')
    .select('id, title, doc_type, status, risk_score, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const metrics = [
    {
      label: t('dashboard.totalDocs'),
      value: totalDocs || 0,
      icon: FileText,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: t('dashboard.completedAnalyses'),
      value: completedDocs || 0,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: t('dashboard.pending'),
      value: pendingDocs || 0,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: t('dashboard.highRisk'),
      value: recentDocs?.filter(d => (d.risk_score || 0) >= 70).length || 0,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t('dashboard.overviewTitle')}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {t('dashboard.overviewSubtitle')}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">{metric.label}</span>
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">
                {metric.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent Documents */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{t('dashboard.recentDocs')}</h2>
        </div>

        {recentDocs && recentDocs.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {recentDocs.map((doc) => (
              <Link 
                key={doc.id} 
                href={`/dashboard/documents/${doc.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">{doc.title}</p>
                  <p className="text-xs text-slate-500">
                    {doc.doc_type || t('dashboard.document')} • {new Date(doc.created_at).toLocaleDateString(locale)}
                  </p>
                </div>
                <StatusBadge status={doc.status} t={t} />
                {doc.risk_score != null && <RiskBadge score={doc.risk_score} />}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
              <FileText className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('dashboard.noDocsTitle')}</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              {t('dashboard.noDocsSubtitle')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: (k: string) => string }) {
  const styles: Record<string, string> = {
    uploaded: 'bg-slate-500/10 text-slate-400',
    pending: 'bg-amber-500/10 text-amber-400',
    analyzing: 'bg-blue-500/10 text-blue-400',
    completed: 'bg-emerald-500/10 text-emerald-400',
    error: 'bg-red-500/10 text-red-400',
  };

  const labels: Record<string, string> = {
    uploaded: t('dashboard.status.uploaded'),
    pending: t('dashboard.status.pending'),
    analyzing: t('dashboard.status.analyzing'),
    completed: t('dashboard.status.completed'),
    error: t('dashboard.status.error'),
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}

function RiskBadge({ score }: { score: number }) {
  let color = 'bg-emerald-500/10 text-emerald-400';
  if (score >= 70) color = 'bg-red-500/10 text-red-400';
  else if (score >= 40) color = 'bg-amber-500/10 text-amber-400';

  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
      {score}%
    </span>
  );
}
