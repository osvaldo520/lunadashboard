'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gem, Wallet, ExternalLink, Check, Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MintCNFTButtonProps {
  blockchainHash: string;
  planType: string;
}

type MintState = 'idle' | 'connecting' | 'minting' | 'success' | 'error';

export function MintCNFTButton({ blockchainHash, planType }: MintCNFTButtonProps) {
  const [state, setState] = useState<MintState>('idle');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [mintSignature, setMintSignature] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPro = planType === 'pro';

  // Load saved wallet address from profile
  useEffect(() => {
    const loadWallet = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_address')
          .eq('id', user.id)
          .single();
        if (profile?.wallet_address) {
          setWalletAddress(profile.wallet_address);
        }
      }
    };
    loadWallet();
  }, []);

  const saveWalletToProfile = useCallback(async (address: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', user.id);
    }
  }, []);

  const connectPhantom = useCallback(async (): Promise<string | null> => {
    const phantom = (window as any).solana;
    if (!phantom?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      setError('Instale a Phantom Wallet para continuar.');
      return null;
    }

    setState('connecting');
    try {
      const resp = await phantom.connect();
      const address = resp.publicKey.toString();
      setWalletAddress(address);
      await saveWalletToProfile(address);
      return address;
    } catch (e: any) {
      console.error('Phantom connect error:', e);
      setError('Conexão com Phantom cancelada.');
      setState('idle');
      return null;
    }
  }, [saveWalletToProfile]);

  const handleMint = useCallback(async (address?: string) => {
    const wallet = address || walletAddress;
    if (!wallet) return;

    setState('minting');
    setError(null);
    try {
      const apiHost = process.env.NEXT_PUBLIC_JUDITE_API || 'http://localhost:3005';
      const res = await fetch(`${apiHost}/v1/mint-cnft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: blockchainHash, walletAddress: wallet })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao mintar cNFT');

      setMintSignature(data.signature);
      setState('success');
      setShowModal(false);
    } catch (e: any) {
      console.error('Mint error:', e);
      setError(e.message || 'Erro ao mintar. Tente novamente.');
      setState('error');
    }
  }, [walletAddress, blockchainHash]);

  const handleClick = useCallback(async () => {
    if (!isPro) return; // Free users can't use
    setError(null);

    if (walletAddress) {
      // Has wallet — mint directly
      await handleMint();
    } else {
      // No wallet — show connect modal
      setShowModal(true);
    }
  }, [isPro, walletAddress, handleMint]);

  const handleConnectAndMint = useCallback(async () => {
    const address = await connectPhantom();
    if (address) {
      await handleMint(address);
    }
  }, [connectPhantom, handleMint]);

  // ═══════════════════════════════════════════
  // SUCCESS STATE
  // ═══════════════════════════════════════════
  if (state === 'success' && mintSignature) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
          <Check className="w-3.5 h-3.5" />
          cNFT Mintado
        </span>
        <a
          href={`https://explorer.solana.com/tx/${mintSignature}?cluster=devnet`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Ver TX
        </a>
      </div>
    );
  }

  return (
    <>
      {/* MAIN BUTTON */}
      <button
        onClick={handleClick}
        disabled={state === 'minting' || state === 'connecting'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          !isPro
            ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/30'
            : state === 'minting' || state === 'connecting'
              ? 'bg-amber-900/30 text-amber-300 cursor-wait border border-amber-500/30'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400/60 shadow-lg shadow-amber-900/10'
        }`}
        title={!isPro ? 'Disponível no plano Pro' : 'Mintar certificado cNFT na blockchain'}
      >
        {state === 'minting' || state === 'connecting' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : !isPro ? (
          <Lock className="w-4 h-4" />
        ) : (
          <Gem className="w-4 h-4" />
        )}
        {state === 'connecting' ? 'Conectando...' 
          : state === 'minting' ? 'Mintando...' 
          : '💎 Mintar cNFT'}
      </button>

      {/* ERROR MESSAGE */}
      {error && state === 'error' && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
          ⚠️ {error}
          <button onClick={() => { setState('idle'); setError(null); }} className="ml-2 underline hover:text-red-200">
            Tentar novamente
          </button>
        </div>
      )}

      {/* CONNECT WALLET MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Conectar Wallet</h3>
                <p className="text-xs text-slate-400">Necessário para mintar o certificado cNFT</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-5">
              Conecte sua <strong className="text-white">Phantom Wallet</strong> para receber o certificado de autenticidade como cNFT diretamente na sua carteira Solana.
            </p>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleConnectAndMint}
              disabled={state === 'connecting' || state === 'minting'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-purple-900/30"
            >
              {state === 'connecting' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Conectando Phantom...</>
              ) : state === 'minting' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mintando cNFT...</>
              ) : (
                <><Wallet className="w-4 h-4" /> Conectar Phantom &amp; Mintar</>
              )}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
