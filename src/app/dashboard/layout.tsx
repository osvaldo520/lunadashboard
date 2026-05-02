import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Sidebar } from '@/components/features/Sidebar';
import { ExpertBadge } from '@/components/features/ExpertBadge';
import { WelcomeModal } from '@/components/features/WelcomeModal';
import { OnboardingChecklist } from '@/components/features/OnboardingChecklist';
import { PaymentToast } from '@/components/features/PaymentToast';
import { getServerLocale, createT } from '@/lib/i18n/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const locale = await getServerLocale();
  const t = createT(locale);

  // Buscar profile do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Verificação de Onboarding
  const needsMessenger = !profile?.telegram_id && !profile?.whatsapp_id;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Onboarding */}
      <WelcomeModal />
      <OnboardingChecklist />

      {/* Toast de pagamento Stripe */}
      <Suspense fallback={null}>
        <PaymentToast />
      </Suspense>

      {/* Sidebar */}
      <Sidebar 
        userName={profile?.full_name || user.email || t('dashboard.user')} 
        userEmail={user.email || ''}
        userPlan={profile?.plan_type || 'free'}
        userCreditsPlan={profile?.credits_plan || 0}
        userCreditsBonus={profile?.credits_bonus || 0}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full flex flex-col">
        {/* Expert Badge — Mobile (top-right, espelha o hamburger top-left) */}
        <div className="lg:hidden fixed top-6 right-6 z-40">
          <ExpertBadge />
        </div>
        {/* Expert Badge — Desktop (top-right do main) */}
        <div className="hidden lg:block fixed top-6 right-10 z-40">
          <ExpertBadge />
        </div>
        {/* Banner CTA para Conectar Mensageiro */}
        {needsMessenger && (
          <div className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 shadow-lg shadow-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-500 shrink-0 z-40 mt-16 lg:mt-0">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xl pb-0.5">
                📱
              </div>
              <p className="text-sm font-medium">
                {t('dashboard.messenger')}
              </p>
            </div>
            <a 
              href="/dashboard/settings#telegram-link" 
              className="whitespace-nowrap px-4 py-1.5 bg-white text-indigo-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              {t('dashboard.connectNow')}
            </a>
          </div>
        )}

        {/* Banner: Crypto Pass prestes a expirar */}
        {profile?.crypto_pass_expires_at && !profile?.stripe_customer_id && profile?.plan_type === 'pro' && (() => {
          const daysLeft = Math.ceil((new Date(profile.crypto_pass_expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
          return daysLeft > 0 && daysLeft <= 3;
        })() && (
          <div className="w-full bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-3 shadow-lg shadow-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-500 shrink-0 z-40">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xl">
                ⏳
              </div>
              <p className="text-sm font-medium">
                {t('dashboard.cryptoExpiring') || `Seu Crypto Pass expira em ${Math.ceil((new Date(profile.crypto_pass_expires_at!).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} dia(s).`}
              </p>
            </div>
            <a 
              href="/crypto-pass" 
              className="whitespace-nowrap px-4 py-1.5 bg-white text-amber-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              Renovar agora →
            </a>
          </div>
        )}

        {/* Espaçamento extra no mobile (pt-24) se não tiver banner, senão pt-6 */}
        <div className={`p-6 lg:p-10 flex-1 ${!needsMessenger ? 'pt-24 lg:pt-10' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
