import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/features/Sidebar';

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <Sidebar 
        userName={profile?.full_name || user.email || 'Usuário'} 
        userEmail={user.email || ''}
        userPlan={profile?.plan || 'free'}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full">
        {/* Espaçamento extra no mobile (pt-24) para o Hamburger Menu flutuante não sobrepor os Títulos */}
        <div className="p-6 pt-24 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
