import { createClient } from '@/lib/supabase/server';
import { SocialApprovalBoard } from '@/components/features/SocialApprovalBoard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aprovação Social | Judite Admin',
};

export const dynamic = 'force-dynamic';

export default async function SocialApprovalPage() {
  const supabase = await createClient();

  // Buscar todos os drafts pendentes
  const { data: drafts, error } = await supabase
    .from('social_drafts')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar social drafts:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Cofre de Aprovação (Social Sandbox)
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Revise os rascunhos de publicações criadas pela Inteligência Artificial. Somente após a sua aprovação,
          elas serão despachadas para publicação orgânica.
        </p>
      </div>

      <SocialApprovalBoard initialDrafts={drafts || []} />
    </div>
  );
}
