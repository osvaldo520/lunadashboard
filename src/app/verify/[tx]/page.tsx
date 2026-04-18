import { createClient } from '@/lib/supabase/server';
import { ShieldCheck, ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ tx: string }>;
}) {
  const { tx } = await params;
  const supabase = await createClient();

  // Buscar documento pelo blockchain_tx (tabela pública para verificação)
  const { data: doc } = await supabase
    .from('documents')
    .select('id, title, doc_type, risk_score, blockchain_tx, blockchain_hash, blockchain_network, created_at, updated_at, status')
    .eq('blockchain_tx', tx)
    .single();

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Transação Não Encontrada</h1>
          <p className="text-slate-400">
            Não foi possível localizar uma análise associada a esta transação blockchain.
          </p>
          <p className="text-sm text-slate-500 font-mono break-all bg-slate-900/50 p-3 rounded-lg">
            TX: {tx}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Ir para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const explorerUrl = doc.blockchain_network === 'solana-mainnet'
    ? `https://solscan.io/tx/${doc.blockchain_tx}`
    : `https://solscan.io/tx/${doc.blockchain_tx}?cluster=devnet`;

  const networkLabel = doc.blockchain_network === 'solana-mainnet' ? 'Solana Mainnet' : 'Solana Devnet';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 mb-2">
            <ShieldCheck className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verificação de Integridade</h1>
          <p className="text-slate-400 text-sm">
            Esta análise jurídica foi registrada na blockchain e pode ser verificada publicamente.
          </p>
        </div>

        {/* Verification Card */}
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/50 p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">✓ Análise Verificada e Autêntica</span>
          </div>

          {/* Document Info */}
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Documento</span>
              <p className="text-white font-medium mt-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                {doc.title}
              </p>
            </div>

            {doc.risk_score != null && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Score de Risco</span>
                <p className={`text-lg font-bold mt-1 ${
                  doc.risk_score >= 70 ? 'text-red-400' : 
                  doc.risk_score >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {doc.risk_score}%
                </p>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Data da Análise</span>
              <p className="text-slate-300 text-sm mt-1">
                {new Date(doc.updated_at || doc.created_at).toLocaleString('pt-BR', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Rede Blockchain</span>
              <p className="text-violet-400 text-sm font-medium mt-1">{networkLabel}</p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Hash SHA-256</span>
              <p className="text-slate-300 text-xs font-mono break-all mt-1 bg-slate-800/50 p-2 rounded">
                {doc.blockchain_hash}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Transação (TX)</span>
              <p className="text-slate-300 text-xs font-mono break-all mt-1 bg-slate-800/50 p-2 rounded">
                {doc.blockchain_tx}
              </p>
            </div>
          </div>

          {/* Solscan Link */}
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:text-violet-300 transition-all text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Verificar no Solscan Explorer
          </a>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500">
            Verificação fornecida por <span className="text-slate-400 font-medium">Judite AI</span> — Análise Jurídica Inteligente
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Conheça a Judite →
          </Link>
        </div>
      </div>
    </div>
  );
}
