import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/features/Sidebar';
import { ExpertBadge } from '@/components/features/ExpertBadge';
import { WelcomeModal } from '@/components/features/WelcomeModal';
import { OnboardingChecklist } from '@/components/features/OnboardingChecklist';

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

  // Buscar profile do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Verificação de Onboarding
  const needsTelegram = !profile?.telegram_id;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Onboarding */}
      <WelcomeModal />
      <OnboardingChecklist />

      {/* Sidebar */}
      <Sidebar 
        userName={profile?.full_name || user.email || 'Usuário'} 
        userEmail={user.email || ''}
        userPlan={profile?.plan_type || 'free'}
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
        {/* Banner CTA para Conectar Telegram */}
        {needsTelegram && (
          <div className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 shadow-lg shadow-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-500 shrink-0 z-40 mt-16 lg:mt-0">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
              </div>
              <p className="text-sm font-medium">
                Sua assistente está te esperando! Para conversar com ela pelo celular, você precisa conectar seu Telegram.
              </p>
            </div>
            <a 
              href="/dashboard/settings#telegram-link" 
              className="whitespace-nowrap px-4 py-1.5 bg-white text-indigo-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              Conectar Agora
            </a>
          </div>
        )}

        {/* Espaçamento extra no mobile (pt-24) se não tiver banner, senão pt-6 */}
        <div className={`p-6 lg:p-10 flex-1 ${!needsTelegram ? 'pt-24 lg:pt-10' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
