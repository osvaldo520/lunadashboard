'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, ExternalLink, FileText, AlertTriangle, CheckCircle, XCircle, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function VerifyPage() {
  const params = useParams();
  const tx = params.tx as string;
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Verificação de integridade
  const [verifyText, setVerifyText] = useState('');
  const [verifyResult, setVerifyResult] = useState<'match' | 'mismatch' | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [computedHash, setComputedHash] = useState('');

  useEffect(() => {
    loadDocument();
  }, [tx]);

  const loadDocument = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('documents')
      .select('id, title, doc_type, risk_score, blockchain_tx, blockchain_hash, blockchain_network, created_at, updated_at, status')
      .eq('blockchain_tx', tx)
      .single();

    if (!data) {
      setNotFound(true);
    } else {
      setDoc(data);
    }
    setLoading(false);
  };

  /**
   * Calcula SHA-256 do texto colado e compara com o hash on-chain.
   * Usa Web Crypto API disponível no browser.
   */
  const verifyIntegrity = async () => {
    if (!verifyText.trim() || !doc?.blockchain_hash) return;

    setVerifying(true);
    setVerifyResult(null);

    try {
      // Calcular SHA-256 via Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(verifyText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setComputedHash(hashHex);

      // Comparar com o hash on-chain
      if (hashHex === doc.blockchain_hash) {
        setVerifyResult('match');
      } else {
        setVerifyResult('mismatch');
      }
    } catch (error) {
      console.error('Erro ao calcular hash:', error);
      setVerifyResult('mismatch');
    }

    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (notFound) {
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
            <span className="text-sm font-semibold text-emerald-400">✓ Análise Registrada On-Chain</span>
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
              <span className="text-xs text-slate-500 uppercase tracking-wider">Hash SHA-256 (On-Chain)</span>
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

        {/* Integrity Verification Tool */}
        <div className="rounded-2xl border border-amber-500/20 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Upload className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Verificar Integridade do Documento</h2>
              <p className="text-xs text-slate-500">Cole o conteúdo da análise para verificar se foi alterado após a notarização.</p>
            </div>
          </div>

          <textarea
            value={verifyText}
            onChange={(e) => {
              setVerifyText(e.target.value);
              setVerifyResult(null);
            }}
            placeholder="Cole aqui o texto completo da análise (Markdown) para verificar..."
            className="w-full h-32 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-amber-500/50 outline-none resize-none font-mono"
          />

          <button
            onClick={verifyIntegrity}
            disabled={!verifyText.trim() || verifying}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {verifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {verifying ? 'Calculando Hash...' : 'Verificar Integridade'}
          </button>

          {/* Result */}
          {verifyResult === 'match' && (
            <div className="flex flex-col gap-3 px-4 py-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">✓ Documento Íntegro</p>
                  <p className="text-xs text-emerald-400/70">O conteúdo é idêntico ao que foi registrado na blockchain. Nenhuma alteração detectada.</p>
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[10px] text-slate-500 uppercase">Hash Calculado</span>
                <p className="text-xs font-mono text-emerald-300/80 break-all">{computedHash}</p>
              </div>
            </div>
          )}

          {verifyResult === 'mismatch' && (
            <div className="flex flex-col gap-3 px-4 py-4 rounded-xl bg-red-500/5 border border-red-500/20 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-400">✕ Documento Alterado</p>
                  <p className="text-xs text-red-400/70">O conteúdo NÃO confere com o hash registrado na blockchain. O documento pode ter sido modificado após a notarização.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-1">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Hash On-Chain (Original)</span>
                  <p className="text-xs font-mono text-emerald-300/80 break-all">{doc.blockchain_hash}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Hash Calculado (Atual)</span>
                  <p className="text-xs font-mono text-red-300/80 break-all">{computedHash}</p>
                </div>
              </div>
            </div>
          )}
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
