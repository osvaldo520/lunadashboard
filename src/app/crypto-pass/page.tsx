"use client";

import { useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { useLocale, LocaleToggle } from '@/lib/i18n';
import '@solana/wallet-adapter-react-ui/styles.css';

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const PAYMENT_WALLET = process.env.NEXT_PUBLIC_SOLANA_PAYMENT_WALLET || 'FQvfMvCbzYXNqBioVbktjomzKLYR1euZewkTa6GgMzGC';
const IS_MAINNET = !RPC_URL.includes('devnet');

// Devnet: simula $29.90 USDC com SOL (0.15 SOL ≈ $29.90)
// Mainnet: trocar por SPL USDC transfer real
const CRYPTO_PASS_LAMPORTS = 0.15 * LAMPORTS_PER_SOL;

export default function CryptoPassWrapper() {
  const wallets = useMemo(() => [], []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CryptoPassPage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function CryptoPassPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLocale();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Flow state
  const [step, setStep] = useState<'form' | 'paying' | 'creating' | 'success' | 'error'>('form');
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // Detect if user already has account (check on email blur)
  const [existingUser, setExistingUser] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  // Auto-detect logged-in session
  useEffect(() => {
    const detectSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setExistingUser(true);
        setLoggedInUserId(user.id);
        // Pre-fill name from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profile?.full_name) setFullName(profile.full_name);
      }
    };
    detectSession();
  }, []);

  const checkExistingEmail = async () => {
    if (loggedInUserId) return; // Already logged in, skip check
    if (!email || !email.includes('@')) return;
    setCheckingEmail(true);
    try {
      // Try to sign in — if it works, user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: '___check___' });
      // If error is "Invalid login credentials", user exists but wrong password
      // If error is "Email not confirmed" or similar, user exists
      // If no error at all, impossible with wrong password
      setExistingUser(signInError?.message === 'Invalid login credentials');
    } catch {
      setExistingUser(false);
    }
    setCheckingEmail(false);
  };

  const handleSubscribe = async () => {
    // Validation
    if (!connected || !publicKey) {
      setError(t('cryptoPass.errorWallet'));
      return;
    }
    // Skip form validation if already logged in
    if (!loggedInUserId) {
      if (!fullName.trim()) {
        setError(t('cryptoPass.errorName'));
        return;
      }
      if (!email || !email.includes('@')) {
        setError(t('cryptoPass.errorEmail'));
        return;
      }
      if (!existingUser) {
        if (password.length < 8) {
          setError(t('cryptoPass.errorPasswordMin'));
          return;
        }
        if (password !== confirmPassword) {
          setError(t('cryptoPass.errorPasswordMatch'));
          return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\];:,.?~-]).{8,}$/;
        if (!passwordRegex.test(password)) {
          setError(t('cryptoPass.errorPasswordStrength'));
          return;
        }
      }
    }

    setError(null);
    setStep('paying');

    try {
      // ═══════════════════════════════════════
      // STEP 1: SOLANA PAYMENT
      // ═══════════════════════════════════════
      const receiverPubKey = new PublicKey(PAYMENT_WALLET);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPubKey,
          lamports: CRYPTO_PASS_LAMPORTS,
        })
      );

      // Add memo for traceability
      const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
      transaction.add({
        keys: [],
        programId: memoProgramId,
        data: Buffer.from(`CryptoPass:${email}`, 'utf-8'),
      });

      console.log('[CryptoPass] Requesting wallet signature...');
      const signature = await sendTransaction(transaction, connection);
      console.log('[CryptoPass] Transaction sent:', signature);
      setTxSignature(signature);

      await connection.confirmTransaction(signature, 'confirmed');
      console.log('[CryptoPass] Payment confirmed!');

      // ═══════════════════════════════════════
      // STEP 2: CREATE/UPGRADE ACCOUNT
      // ═══════════════════════════════════════
      setStep('creating');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      if (loggedInUserId) {
        // Already logged in — just upgrade profile directly
        console.log('[CryptoPass] User already logged in, upgrading directly:', loggedInUserId);
        await supabase.from('profiles').update({
          plan_type: 'pro',
          credits_plan: 12000,
          crypto_pass_tx: signature,
          crypto_pass_expires_at: expiresAt.toISOString(),
          wallet_address: publicKey.toString(),
        }).eq('id', loggedInUserId);
      } else if (existingUser) {
        // Existing user — sign in and upgrade via API
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          throw new Error(t('cryptoPass.errorLogin'));
        }

        // Upgrade to Pro via Supabase RPC or direct update
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').update({
            plan_type: 'pro',
            credits_plan: 12000,
            crypto_pass_tx: signature,
            crypto_pass_expires_at: expiresAt.toISOString(),
            wallet_address: publicKey.toString(),
          }).eq('id', user.id);
        }
      } else {
        // New user — create account
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              wallet_address: publicKey.toString(),
            },
          },
        });

        if (signUpError) {
          throw new Error(signUpError.message);
        }

        // Upgrade to Pro immediately
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').update({
            plan_type: 'pro',
            credits_plan: 12000,
            crypto_pass_tx: signature,
            crypto_pass_expires_at: expiresAt.toISOString(),
            wallet_address: publicKey.toString(),
          }).eq('id', user.id);
        }
      }

      setStep('success');

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);

    } catch (err: any) {
      console.error('[CryptoPass] Error:', err);
      if (err.name === 'WalletSendTransactionError') {
        setError(`Transaction failed. Do you have enough SOL?${!IS_MAINNET ? ' Visit faucet.solana.com for free devnet SOL.' : ''}`);
      } else {
        setError(err.message || 'An error occurred during the process.');
      }
      setStep('error');
    }
  };

  // ═══════════════════════════════════════
  // SUCCESS SCREEN
  // ═══════════════════════════════════════
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#06070a] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">{t('cryptoPass.successTitle')}</h1>
          <p className="text-slate-400 mb-6">
            {t('cryptoPass.successDesc')}<br />
            {t('cryptoPass.successRedirect')}
          </p>
          {txSignature && (
            <a
              href={`https://solscan.io/tx/${txSignature}${!IS_MAINNET ? '?cluster=devnet' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              {t('cryptoPass.viewTx')}
            </a>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // MAIN FORM
  // ═══════════════════════════════════════
  const isProcessing = step === 'paying' || step === 'creating';

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex items-center justify-center px-4 py-12 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-emerald-900/10 to-transparent" />
      </div>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Locale Toggle */}
          <div className="absolute top-0 right-0">
            <LocaleToggle />
          </div>
          <Link href="/" className="inline-block mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-emerald-600/30 border border-indigo-500/30 overflow-hidden">
              <img src="/judite-logo.png" alt="Judite" className="w-full h-full object-cover" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t('cryptoPass.title')}
          </h1>
          <p className="text-slate-400 text-sm">
            {t('cryptoPass.subtitle')}
          </p>
        </div>

        {/* Benefits strip */}
        <div className="flex items-center justify-center gap-6 mb-8 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            {t('cryptoPass.onChain')}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            {t('cryptoPass.bonusCredits')}
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl">
          {/* Step 1: Connect Wallet */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
              {t('cryptoPass.stepWallet')}
            </label>
            <div className="flex justify-center">
              <WalletMultiButton style={{
                backgroundColor: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                border: connected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                height: '44px',
              }} />
            </div>
            {connected && publicKey && (
              <p className="text-[10px] text-emerald-400/60 text-center mt-2 font-mono">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </p>
            )}
          </div>

          <div className="border-t border-slate-800 my-6" />

          {/* Step 2: Account Details */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
              {t('cryptoPass.stepAccount')}
            </label>

            {loggedInUserId ? (
              /* Already logged in — show simple confirmation */
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-1">
                <p className="text-sm text-emerald-400 font-medium">✅ {t('cryptoPass.loggedIn')}</p>
                <p className="text-xs text-slate-400">{fullName || email}</p>
                <p className="text-[10px] text-slate-500">{t('cryptoPass.loggedInDesc')}</p>
              </div>
            ) : (
            <div className="space-y-3">
              {/* Full Name */}
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('cryptoPass.fullName')}
                disabled={isProcessing}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200
                  disabled:opacity-50"
              />

              {/* Email */}
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setExistingUser(false); }}
                onBlur={checkExistingEmail}
                placeholder={t('cryptoPass.email')}
                disabled={isProcessing}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200
                  disabled:opacity-50"
              />

              {existingUser && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-400">
                  {t('cryptoPass.accountFound')}
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={existingUser ? t('cryptoPass.existingPassword') : t('cryptoPass.createPassword')}
                  disabled={isProcessing}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 pr-12 text-white placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200
                    disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Confirm Password — only for new users */}
              {!existingUser && (
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('cryptoPass.confirmPassword')}
                  disabled={isProcessing}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200
                    disabled:opacity-50"
                />
              )}

              {/* Password strength — only for new users */}
              {!existingUser && password.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { ok: password.length >= 8, label: t('cryptoPass.chars') },
                    { ok: /[A-Z]/.test(password), label: t('cryptoPass.uppercase') },
                    { ok: /[a-z]/.test(password), label: t('cryptoPass.lowercase') },
                    { ok: /\d/.test(password), label: t('cryptoPass.number') },
                    { ok: /[!@#$%^&*()_+{}[\];:,.?~-]/.test(password), label: t('cryptoPass.symbol') },
                  ].map((rule) => (
                    <span key={rule.label} className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full ${
                      rule.ok ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800/50'
                    }`}>
                      {rule.ok ? '✓' : '○'} {rule.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            )}
          </div>

          <div className="border-t border-slate-800 my-6" />

          {/* Step 3: Pay & Subscribe */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
              {t('cryptoPass.stepPay')}
            </label>

            {/* Price summary */}
            <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">{t('cryptoPass.priceSummary')}</span>
                <span className="text-lg font-bold text-white">$29.90</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t('cryptoPass.priceCredits')}</span>
                <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10">USDC</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 mb-4">
                {error}
                {step === 'error' && (
                  <button onClick={() => { setStep('form'); setError(null); }} className="block mt-2 text-xs underline text-red-300 hover:text-red-200">
                    {t('cryptoPass.tryAgain')}
                  </button>
                )}
              </div>
            )}

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing || !connected}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-semibold text-sm
                bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500
                active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              {step === 'paying' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('cryptoPass.btnPaying')}
                </>
              ) : step === 'creating' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('cryptoPass.btnCreating')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                  </svg>
                  {existingUser ? t('cryptoPass.btnUpgrade') : t('cryptoPass.btnSubscribe')}
                </>
              )}
            </button>

            {!connected && (
              <p className="text-[10px] text-slate-600 text-center mt-2">
                {t('cryptoPass.connectWalletHint')}
              </p>
            )}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            {t('cryptoPass.alreadyPro')}{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              {t('cryptoPass.signIn')}
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/" className="text-slate-600 hover:text-slate-400 transition-colors">
              {t('cryptoPass.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
