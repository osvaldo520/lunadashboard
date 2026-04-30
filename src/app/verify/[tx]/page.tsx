'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, FileText, AlertTriangle, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale, LocaleToggle } from '@/lib/i18n';

export default function VerifyPage() {
  const params = useParams();
  const tx = params.tx as string;
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { t } = useLocale();

  // Verificação automática
  const [autoVerifyResult, setAutoVerifyResult] = useState<'match' | 'mismatch' | 'no_content' | null>(null);
  const [autoVerifying, setAutoVerifying] = useState(false);
  const [autoComputedHash, setAutoComputedHash] = useState('');

  // Verificação manual
  const [verifyText, setVerifyText] = useState('');
  const [manualResult, setManualResult] = useState<'match' | 'mismatch' | null>(null);
  const [manualVerifying, setManualVerifying] = useState(false);
  const [manualHash, setManualHash] = useState('');

  useEffect(() => {
    loadDocument();
  }, [tx]);

  const loadDocument = async () => {
    try {
      // Usa API route com service role (bypassa RLS para verificação pública)
      const res = await fetch(`/api/verify?tx=${encodeURIComponent(tx)}`);
      
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setDoc(data);

      // Disparar verificação automática se tiver conteúdo
      if (data.analysis_summary && data.blockchain_hash) {
        autoVerify(data.analysis_summary, data.blockchain_hash);
      } else {
        setAutoVerifyResult('no_content');
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  /**
   * Verificação AUTOMÁTICA: Lê o conteúdo do banco e compara com o hash on-chain.
   * Prova que o conteúdo armazenado não foi alterado.
   */
  const autoVerify = async (content: string, expectedHash: string) => {
    setAutoVerifying(true);
    try {
      const hash = await computeSHA256(content);
      setAutoComputedHash(hash);
      setAutoVerifyResult(hash === expectedHash ? 'match' : 'mismatch');
    } catch {
      setAutoVerifyResult('mismatch');
    }
    setAutoVerifying(false);
  };

  /**
   * Verificação MANUAL: Usuário cola o texto original (Markdown) para checar.
   */
  const manualVerify = async () => {
    if (!verifyText.trim() || !doc?.blockchain_hash) return;
    setManualVerifying(true);
    setManualResult(null);
    try {
      const hash = await computeSHA256(verifyText);
      setManualHash(hash);
      setManualResult(hash === doc.blockchain_hash ? 'match' : 'mismatch');
    } catch {
      setManualResult('mismatch');
    }
    setManualVerifying(false);
  };

  /**
   * Calcula SHA-256 via Web Crypto API.
   */
  const computeSHA256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
          <h1 className="text-2xl font-bold text-white">{t('verify.notFoundTitle')}</h1>
          <p className="text-slate-400">
            {t('verify.notFoundDesc')}
          </p>
          <p className="text-sm text-slate-500 font-mono break-all bg-slate-900/50 p-3 rounded-lg">
            TX: {tx}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {t('verify.backHome')}
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
      <div className="absolute top-4 right-6"><LocaleToggle /></div>
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 mb-2">
            <ShieldCheck className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('verify.title')}</h1>
          <p className="text-slate-400 text-sm">
            {t('verify.subtitle')}
          </p>
        </div>

        {/* Auto-Verification Result */}
        {autoVerifyResult === 'match' && (
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 animate-in fade-in duration-500">
            <CheckCircle className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-400">{t('verify.verified')}</p>
              <p className="text-xs text-emerald-400/70">{t('verify.verifiedDesc')}</p>
            </div>
          </div>
        )}
        {autoVerifyResult === 'mismatch' && (
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-red-500/5 border border-red-500/20 animate-in fade-in duration-500">
            <XCircle className="w-7 h-7 text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-400">{t('verify.mismatch')}</p>
              <p className="text-xs text-red-400/70">{t('verify.mismatchDesc')}</p>
            </div>
          </div>
        )}
        {autoVerifying && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin shrink-0" />
            <p className="text-sm text-violet-400">{t('verify.autoVerifying')}</p>
          </div>
        )}

        {/* Document Info Card */}
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/50 p-6 space-y-5">
          {/* Document Info */}
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('verify.documentLabel')}</span>
              <p className="text-white font-medium mt-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                {doc.title}
              </p>
            </div>

            {doc.risk_score != null && (
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{t('verify.riskScore')}</span>
                <p className={`text-lg font-bold mt-1 ${
                  doc.risk_score >= 70 ? 'text-red-400' : 
                  doc.risk_score >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {doc.risk_score}%
                </p>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('verify.analysisDate')}</span>
              <p className="text-slate-300 text-sm mt-1">
                {new Date(doc.updated_at || doc.created_at).toLocaleString(t('dashboard.pagination.itemsPerPage') === 'Items per page:' ? 'en-US' : 'pt-BR', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('verify.networkLabel')}</span>
              <p className="text-violet-400 text-sm font-medium mt-1">{networkLabel}</p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('verify.hashLabel')}</span>
              <p className="text-slate-300 text-xs font-mono break-all mt-1 bg-slate-800/50 p-2 rounded">
                {doc.blockchain_hash}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('verify.txLabel')}</span>
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
            {t('verify.viewExplorer')}
          </a>

          {/* Download Original Document */}
          {doc.analysis_summary && (
            <button
              onClick={() => {
                const blob = new Blob([doc.analysis_summary], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${doc.title || 'analise'}_original.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              {t('verify.downloadOriginal')}
            </button>
          )}
        </div>

        {/* External Verification Guide */}
        <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('verify.howToVerify')}</p>
          <ol className="text-xs text-slate-500 space-y-2 list-decimal list-inside">
            <li>{t('verify.step1')}</li>
            <li>{t('verify.step2_1')}
              <code className="block mt-1 mb-1 px-2 py-1 bg-slate-800/80 rounded text-[11px] text-emerald-400/70 font-mono">
                certutil -hashfile analise_original.md SHA256
              </code>
              <span className="text-slate-600">{t('verify.step2_2')}</span>
            </li>
            <li>{t('verify.step3')}</li>
            <li>{t('verify.step4')}</li>
          </ol>
          <p className="text-[11px] text-slate-600 mt-2">
            {t('verify.stepFooter')}
          </p>
        </div>
        <details className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden group">
          <summary className="flex items-center gap-3 p-5 cursor-pointer select-none hover:bg-slate-800/30 transition-colors">
            <RefreshCw className="w-5 h-5 text-slate-400 group-open:text-amber-400 transition-colors" />
            <div>
              <p className="text-sm font-medium text-white">{t('verify.manualTitle')}</p>
              <p className="text-xs text-slate-500">{t('verify.manualDesc')}</p>
            </div>
          </summary>
          
          <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50 pt-4">
            <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <p className="text-[11px] text-amber-400/80">
                {t('verify.importantInfo')}
              </p>
            </div>
            
            <textarea
              value={verifyText}
              onChange={(e) => {
                setVerifyText(e.target.value);
                setManualResult(null);
              }}
              placeholder={t('verify.manualPlaceholder')}
              className="w-full h-32 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-amber-500/50 outline-none resize-none font-mono"
            />

            <button
              onClick={manualVerify}
              disabled={!verifyText.trim() || manualVerifying}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {manualVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {manualVerifying ? t('verify.calculating') : t('verify.manualBtn')}
            </button>

            {/* Manual Result */}
            {manualResult === 'match' && (
              <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-sm font-bold text-emerald-400">{t('verify.hashMatch')}</p>
                </div>
                <p className="text-xs font-mono text-emerald-300/80 break-all">{manualHash}</p>
              </div>
            )}
            {manualResult === 'mismatch' && (
              <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm font-bold text-red-400">{t('verify.hashMismatch')}</p>
                </div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  <p className="text-[10px] text-slate-500">On-Chain: <span className="text-emerald-300/70 font-mono">{doc.blockchain_hash}</span></p>
                  <p className="text-[10px] text-slate-500">Calculado: <span className="text-red-300/70 font-mono">{manualHash}</span></p>
                </div>
              </div>
            )}
          </div>
        </details>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500">
            {t('verify.footerPowered')} <span className="text-slate-400 font-medium">{t('verify.footerBrand')}</span>
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {t('verify.footerCta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
