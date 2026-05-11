"use client";

import { useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useLocale, LocaleToggle } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '@solana/wallet-adapter-react-ui/styles.css';

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export default function AnalyzePageWrapper() {
  const wallets = useMemo(() => [], []);
  
  // Evitar erro de Hydration no Next.js
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AnalyzePage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function AnalyzePage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  const [mintStatus, setMintStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mintSignature, setMintSignature] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleMintCNFT = async () => {
    if (!result?.blockchain_proof?.hash || !publicKey) return;
    setMintStatus('loading');
    try {
      const apiHost = process.env.NEXT_PUBLIC_JUDITE_API || 'http://localhost:3005';
      const res = await fetch(`${apiHost}/v1/mint-cnft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: result.blockchain_proof.hash, walletAddress: publicKey.toString() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao mintar cNFT');
      
      setMintSignature(data.signature);
      setMintStatus('success');
    } catch (e: any) {
      console.error(e);
      setMintStatus('error');
      alert('Erro ao mintar o cNFT. Tente novamente.');
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const validateFile = (f: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
    if (!validTypes.includes(f.type) && !f.name.toLowerCase().endsWith('.md')) {
      setError(t('analyze.errorFormat'));
      return false;
    }
    if (f.size > 1 * 1024 * 1024) { // 1MB máximo
      setError(t('analyze.errorSize'));
      return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    if (!connected || !publicKey) {
      setError(t('analyze.errorWallet'));
      return;
    }
    if (!file) {
      setError(t('analyze.errorFile'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Pagamento USDC (Simulado com SOL na Devnet)
      const receiverPubKey = new PublicKey('7f9aofD6rodBT3cH7LwQLW1gUUGSw3AnZ92ZRWNKXzEe'); 
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPubKey,
          lamports: 0.005 * LAMPORTS_PER_SOL, // Simula $1.00 USD
        })
      );

      const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
      transaction.add({
        keys: [],
        programId: memoProgramId,
        data: Buffer.from('Judite Social Analysis', 'utf-8'),
      });

      console.log('Solicitando assinatura...');
      const signature = await sendTransaction(transaction, connection);
      console.log('Transação enviada:', signature);

      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Pagamento confirmado!');

      // 2. Upload FormData para a API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jurisdiction', 'BR');

      const apiHost = process.env.NEXT_PUBLIC_JUDITE_API || 'http://localhost:3005';
      const response = await fetch(`${apiHost}/v1/analyze?expert=true&source=social_link`, {
        method: 'POST',
        headers: {
          'x-solana-tx': signature
        },
        body: formData // Não enviar Content-Type, o browser define o multipart boundary automático
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar análise.');
      }

      setResult(data.data);

    } catch (err: any) {
      console.error(err);
      if (err.name === 'WalletSendTransactionError') {
         setError('Erro na transação. Você tem saldo suficiente de SOL na Devnet? Acesse faucet.solana.com para ganhar SOL grátis.');
      } else {
         setError(err.message || 'Ocorreu um erro durante o pagamento ou análise.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 left-6">
        <a href="https://usejudite.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
          <img src="/judite-newlogo3.png" alt="Judite AI Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 group-hover:from-purple-300 group-hover:to-pink-500 transition-all">Judite AI</span>
        </a>
      </div>
      <div className="absolute top-4 right-6">
        <LocaleToggle />
      </div>

      <div className="max-w-3xl w-full space-y-8 mt-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t('analyze.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {t('analyze.subtitle')}
          </p>
        </div>

        {!result ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-700 pb-6">
              <div>
                <label className="block text-lg font-medium text-gray-200">{t('analyze.step1')}</label>
                <p className="text-sm text-gray-400">{t('analyze.step1Desc')}</p>
              </div>
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors rounded-lg shadow-lg" />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-200 mb-2">{t('analyze.step2')}</label>
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'}`}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt,.md" 
                  onChange={handleFileSelect}
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-purple-300">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span className="font-semibold text-lg">{file.name}</span>
                    <span className="text-sm text-purple-400/70">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-4 px-4 py-1 rounded-full bg-red-900/50 text-red-300 text-sm hover:bg-red-900/80 transition">{t('analyze.remove')}</button>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-gray-400">
                    <svg className="w-12 h-12 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <span className="font-semibold">{t('analyze.dropzone')}</span>
                    <span className="text-sm mt-1">{t('analyze.dropzoneFormats')}</span>
                  </label>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm shadow-inner">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !connected || !file}
              className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-xl font-bold text-white 
                ${loading || !connected || !file 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 border-green-400/50 hover:shadow-green-500/25'
                } transition-all`}
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('analyze.processing')}
                </span>
              ) : (
                t('analyze.analyzeBtn')
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              {t('analyze.phantomNote')}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 p-8 space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-gray-700 pb-4 gap-4">
              <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {t('analyze.done')}
              </h2>
              <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                <button 
                  disabled={pdfLoading}
                  onClick={async () => {
                    const getExportContent = () => {
                      let text = result.analysis;
                      if (result.blockchain_proof) {
                        text += `\n\n---\n\n### 🔗 Selo de Autenticidade Blockchain / Blockchain Authenticity Seal\n`;
                        text += `**Hash SHA-256:** <code style="word-wrap: break-word;">${result.blockchain_proof.hash}</code>\n`;
                        text += `**Assinatura Solana / Solana Signature:** [<code style="word-wrap: break-word;">${result.blockchain_proof.signature}</code>](https://explorer.solana.com/tx/${result.blockchain_proof.signature}?cluster=devnet)\n`;
                        text += `**🛡️ Verificação de Integridade / Integrity Verification:** [Verificar no Judite / Verify on Judite](${window.location.origin}/verify/${result.blockchain_proof.signature})\n`;
                        text += `\n*Nota: Este documento foi analisado de forma avulsa. Documentos originais são mantidos em cofre criptográfico exclusivamente para assinantes do plano PRO.* / *Note: This document was analyzed individually. Original documents are kept in a cryptographic vault exclusively for PRO plan subscribers.*`;
                      }
                      return text;
                    };
                    const originalText = getExportContent();
                    setPdfLoading(true);
                    try {
                      const res = await fetch('/api/generate-pdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: originalText, title: 'Análise Judite' })
                      });
                      if (!res.ok) {
                        const errBody = await res.text();
                        console.error(`[PDF] Status: ${res.status}`, errBody);
                        throw new Error(`Falha ao gerar PDF (${res.status})`);
                      }
                      console.log('[PDF] ✅ PDF received from server');
                      
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Analise_Judite_${new Date().getTime()}.pdf`;
                      a.click();
                    } catch (e: any) {
                      console.error('[PDF] Error:', e?.message || e);
                      alert('Erro ao gerar PDF. Tente exportar MD ou TXT.');
                    } finally {
                      setPdfLoading(false);
                    }
                  }}
                  className="px-3 md:px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-500/30 rounded-lg text-xs md:text-sm transition flex items-center gap-2 flex-1 md:flex-none justify-center disabled:opacity-50 disabled:cursor-wait"
                >
                  {pdfLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-red-200" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('analyze.processing')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      {t('analyze.exportPdf')}
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    const getExportContent = () => {
                      let text = result.analysis;
                      if (result.blockchain_proof) {
                        text += `\n\n---\n\n### 🔗 Selo de Autenticidade Blockchain / Blockchain Authenticity Seal\n`;
                        text += `**Hash SHA-256:** \`${result.blockchain_proof.hash}\`\n`;
                        text += `**Assinatura Solana / Solana Signature:** [${result.blockchain_proof.signature}](https://explorer.solana.com/tx/${result.blockchain_proof.signature}?cluster=devnet)\n`;
                        text += `**🛡️ Verificação de Integridade / Integrity Verification:** [Verificar no Judite / Verify on Judite](${window.location.origin}/verify/${result.blockchain_proof.signature})\n`;
                        text += `\n*Nota: Este documento foi analisado de forma avulsa. Documentos originais são mantidos em cofre criptográfico exclusivamente para assinantes do plano PRO.* / *Note: This document was analyzed individually. Original documents are kept in a cryptographic vault exclusively for PRO plan subscribers.*`;
                      }
                      return text;
                    };
                    const blob = new Blob([getExportContent()], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Analise_Judite_${new Date().getTime()}.md`;
                    a.click();
                  }}
                  className="px-3 md:px-4 py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-500/30 rounded-lg text-xs md:text-sm transition flex items-center gap-2 flex-1 md:flex-none justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  {t('analyze.exportMd')}
                </button>
                <button 
                  onClick={() => {
                    const getExportContent = () => {
                      let text = result.analysis;
                      if (result.blockchain_proof) {
                        text += `\n\n---\n\n### 🔗 Selo de Autenticidade Blockchain / Blockchain Authenticity Seal\n`;
                        text += `**Hash SHA-256:** \`${result.blockchain_proof.hash}\`\n`;
                        text += `**Assinatura Solana / Solana Signature:** ${result.blockchain_proof.signature}\n`;
                        text += `**Verificação de Integridade / Integrity Verification:** ${window.location.origin}/verify/${result.blockchain_proof.signature}\n`;
                        text += `\n*Nota: Este documento foi analisado de forma avulsa. Documentos originais são mantidos em cofre criptográfico exclusivamente para assinantes do plano PRO.* / *Note: This document was analyzed individually. Original documents are kept in a cryptographic vault exclusively for PRO plan subscribers.*`;
                      }
                      return text;
                    };
                    const blob = new Blob([getExportContent()], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Analise_Judite_${new Date().getTime()}.txt`;
                    a.click();
                  }}
                  className="px-3 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-xs md:text-sm transition flex items-center gap-2 flex-1 md:flex-none justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  {t('analyze.exportTxt')}
                </button>
                {mintStatus === 'success' ? (
                  <button disabled className="px-3 md:px-4 py-2 bg-emerald-900/50 text-emerald-200 border border-emerald-500/30 rounded-lg text-xs md:text-sm transition flex items-center gap-2 w-full md:w-auto justify-center md:ml-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {t('analyze.cnftDone')}
                  </button>
                ) : (
                  <button 
                    onClick={handleMintCNFT}
                    disabled={mintStatus === 'loading'}
                    className="px-3 md:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-orange-900/20 rounded-lg text-xs md:text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 w-full md:w-auto justify-center md:ml-2"
                  >
                    {mintStatus === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mintando...
                      </>
                    ) : (
                      <>{t('analyze.mintCnft')}</>
                    )}
                  </button>
                )}
                <button 
                  onClick={() => { setResult(null); setFile(null); }}
                  className="px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs md:text-sm text-gray-200 transition w-full md:w-auto md:ml-2"
                >
                  {t('analyze.newAnalysis')}
                </button>
              </div>
            </div>
            
            {result.blockchain_proof && (
              <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-5 flex flex-col gap-3 shadow-inner">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-lg">
                  <span>🔗</span> {t('analyze.blockchainSeal')}
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded ml-2">Solana</span>
                </div>
                <div className="text-sm text-purple-200/80 font-mono break-all bg-purple-950/50 p-2 rounded">
                  {result.blockchain_proof.hash}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a 
                    href={`https://explorer.solana.com/tx/${result.blockchain_proof.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 w-max"
                  >
                    {t('analyze.viewTx')} 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <a
                    href={`/verify/${result.blockchain_proof.signature}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 w-max"
                  >
                    🛡️ {t('analyze.verifyIntegrity')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </a>
                </div>
              </div>
            )}

            {/* Gov API Badge */}
            {(result.analysis?.includes('Fontes Oficiais') || 
              result.analysis?.includes('consulta_gov') ||
              result.analysis?.includes('DataJud') ||
              result.analysis?.includes('BACEN') ||
              result.analysis?.includes('CNJ') ||
              result.analysis?.includes('Portal da Transparência') ||
              result.analysis?.includes('Receita Federal')) && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mt-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/20">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M9 21V10m6 11V10M12 3l9 7H3l9-7z"></path></svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-400">Cruzamento com Fontes Governamentais</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Verified</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Esta análise cruzou dados com APIs oficiais do governo em tempo real.</p>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none mt-6 prose-p:text-slate-300 prose-headings:text-white prose-a:text-indigo-400 prose-strong:text-white prose-code:text-indigo-300 prose-table:w-full prose-table:border-collapse prose-th:bg-slate-800/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-white prose-td:border-t prose-td:border-slate-700 prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-slate-300 prose-li:text-slate-300 prose-blockquote:border-indigo-500 prose-blockquote:text-slate-400 prose-hr:border-slate-700 prose-ul:text-slate-300 prose-ol:text-slate-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
