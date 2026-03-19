import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/features/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar profile para verificar se é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Proteção de Rota: Se não for admin, volta para o dashboard comum
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar Administrativa */}
      <AdminSidebar 
        userName={profile?.full_name || 'Admin'} 
        userEmail={user.email || ''}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative w-full border-l border-indigo-500/5">
        <div className="p-6 pt-24 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
