import { createClient } from '@/lib/supabase/server';
import { FileText, ArrowLeft, Calendar, FileQuestion, AlertTriangle, Landmark, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocumentPreviewModal } from '@/components/DocumentPreviewModal';
import { DownloadAnalysisButton } from '@/components/DownloadAnalysisButton';
import { ExportDocumentButton } from '@/components/ExportDocumentButton';
import { RealtimeDocumentRefresher } from '@/components/RealtimeDocumentRefresher';
import { AnalyzeButton } from '@/components/AnalyzeButton';
import { DeleteButton } from '@/components/DeleteButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getServerLocale, createT } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DocumentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const locale = await getServerLocale();
  const t = createT(locale);

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (!doc) {
    notFound();
  }

  const { data: logs } = await supabase
    .from('analysis_logs')
    .select('*')
    .eq('document_id', id)
    .order('created_at', { ascending: false });

  // Gerar URL assinada para o documento original se existir
  let fileUrl = null;
  if (doc.file_path) {
    const { data: urlData } = await supabase.storage
      .from('contracts')
      .createSignedUrl(doc.file_path, 3600);
    fileUrl = urlData?.signedUrl;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <RealtimeDocumentRefresher documentId={doc.id} />
      {/* Header */}
      <div>
        <Link 
          href="/dashboard/documents" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('dashboard.documentDetails.back')}
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              {doc.title}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-400">
              {fileUrl ? (
                <DocumentPreviewModal 
                  fileUrl={fileUrl} 
                  docType={doc.doc_type} 
                  filePath={doc.file_path} 
                  previewLabel={t('dashboard.documentDetails.preview')}
                />
              ) : (
                <span className="flex items-center gap-1.5 capitalize text-slate-400">
                  <FileQuestion className="h-4 w-4" />
                  {doc.doc_type || t('dashboard.documentDetails.defaultType')}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(doc.created_at).toLocaleDateString(t('dashboard.pagination.itemsPerPage') === 'Items per page:' ? 'en-US' : 'pt-BR')}
              </span>
              <StatusBadge status={doc.status} t={t} />
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end justify-start gap-4 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <AnalyzeButton documentId={doc.id} status={doc.status} />
              <DeleteButton documentId={doc.id} documentTitle={doc.title} />
            </div>
            
            {doc.risk_score != null && (
              <div className="text-left md:text-right mt-2 md:mt-0">
                <div className="text-sm font-medium text-slate-400 mb-1">{t('dashboard.documentDetails.riskScore')}</div>
                <RiskBadge score={doc.risk_score} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Analysis Summary) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-indigo-400" />
                {t('dashboard.documentDetails.analysisSummary')}
              </h2>
              {doc.analysis_summary && (
                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                  <ExportDocumentButton 
                    documentId={doc.id}
                    format="pdf"
                    contentType="analysis"
                    label={t('dashboard.documentDetails.generatePdf')}
                  />
                  <ExportDocumentButton 
                    documentId={doc.id}
                    format="docx"
                    contentType="analysis"
                    label={t('dashboard.documentDetails.generateDocx')}
                  />
                  <DownloadAnalysisButton 
                    content={doc.analysis_summary} 
                    documentTitle={doc.title} 
                    label={t('dashboard.documentDetails.downloadAnalysis')}
                  />
                </div>
              )}
            </div>
            
            {doc.analysis_summary ? (
              <>
                {/* Badge Gov — Aparece quando a análise cruzou dados oficiais (Pro) */}
                {(doc.analysis_summary.includes('Fontes Oficiais') || 
                  doc.analysis_summary.includes('consulta_gov') ||
                  doc.analysis_summary.includes('DataJud') ||
                  doc.analysis_summary.includes('BACEN') ||
                  doc.analysis_summary.includes('Portal da Transparência')) && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-6">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
                      <Landmark className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-emerald-400">{t('dashboard.documentDetails.govCross')}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Pro</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.documentDetails.govCrossDesc')}</p>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-500/40 ml-auto flex-shrink-0" />
                  </div>
                )}
                {doc.blockchain_tx && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/20 mb-6">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/10">
                      <LinkIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-violet-400">{t('dashboard.documentDetails.blockchainSeal')}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded">Solana</span>
                      </div>
                      <a 
                        href={`https://solscan.io/tx/${doc.blockchain_tx}${doc.blockchain_network === 'solana-mainnet' ? '' : '?cluster=devnet'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-violet-300 transition-colors mt-0.5 underline inline-block"
                      >
                        {t('dashboard.documentDetails.verifyOnchain')}
                      </a>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-violet-500/40 ml-auto flex-shrink-0" />
                  </div>
                )}
                <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-indigo-400 prose-strong:text-white prose-table:w-full prose-table:border-collapse prose-th:bg-slate-800/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-white prose-td:border-t prose-td:border-slate-800 prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-slate-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {doc.analysis_summary}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">{t('dashboard.documentDetails.noAnalysis')}</p>
                <p className="text-sm text-slate-500 mt-2">{t('dashboard.documentDetails.clickAnalyze')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Details & Logs) */}
        <div className="space-y-6">
          {/* File Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-medium text-white mb-4">{t('dashboard.documentDetails.fileDetails')}</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500">{t('dashboard.documentDetails.docId')}</span>
                <p className="text-sm text-slate-300 font-mono break-all mt-0.5">{doc.id}</p>
              </div>
              {doc.tags && doc.tags.length > 0 && (
                <div>
                  <span className="text-xs text-slate-500">{t('dashboard.documentDetails.tags')}</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {doc.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysis History */}
          {logs && logs.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-sm font-medium text-white mb-4">{t('dashboard.documentDetails.history')}</h3>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-4 border-l-2 border-slate-800">
                    <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 ring-4 ring-slate-900" />
                    <p className="text-xs text-slate-400 mb-1">
                      {new Date(log.created_at).toLocaleString(t('dashboard.pagination.itemsPerPage') === 'Items per page:' ? 'en-US' : 'pt-BR')}
                    </p>
                    <p className="text-sm text-white font-medium">
                      {t('dashboard.documentDetails.analysisDone')}
                    </p>
                  </div>
                ))}
                {doc.blockchain_tx && (
                  <div>
                    <span className="text-xs text-slate-500">{t('dashboard.documentDetails.blockchainSealSolana')}</span>
                    <a 
                      href={`https://solscan.io/tx/${doc.blockchain_tx}${doc.blockchain_network === 'solana-mainnet' ? '' : '?cluster=devnet'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-mono break-all mt-0.5 block"
                    >
                      {doc.blockchain_tx.substring(0, 24)}...
                    </a>
                  </div>
                )}
                {doc.blockchain_hash && (
                  <div>
                    <span className="text-xs text-slate-500">{t('dashboard.documentDetails.hash')}</span>
                    <p className="text-sm text-slate-300 font-mono break-all mt-0.5">{doc.blockchain_hash}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string, t: any }) {
  const styles: Record<string, string> = {
    uploaded: 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',
    pending: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    analyzing: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    error: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
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
  let color = 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20';
  if (score >= 70) color = 'bg-red-500/10 text-red-400 ring-red-500/20';
  else if (score >= 40) color = 'bg-amber-500/10 text-amber-400 ring-amber-500/20';

  return (
    <span className={`text-2xl font-bold px-4 py-2 rounded-xl ring-1 ${color}`}>
      {score}%
    </span>
  );
}
