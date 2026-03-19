'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveGlobalConfig(config: Record<string, any>) {
  const supabase = await createClient();

  // Verificar se o usuário é admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Não autenticado.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Acesso negado. Apenas administradores.' };
  }

  // Salvar cada config individualmente com upsert
  const errors: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    const { error } = await supabase
      .from('global_config')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      });

    if (error) {
      errors.push(`${key}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    return { error: errors.join(', ') };
  }

  revalidatePath('/admin/config');
  return { success: true };
}
