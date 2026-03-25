'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function requestAnalysis(documentId: string) {
  try {
    const supabase = await createClient();

    // Verify if user is authenticated and owns the document (implicitly done via RLS, but safe to check auth)
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return { success: false, error: 'Não autorizado.' };
    }

    // Set document status to pending to trigger the Judite bot via Realtime
    const { error } = await supabase
      .from('documents')
      .update({ 
        status: 'pending',
        analysis_summary: null, // Clear previous analysis if any
        risk_score: null
      })
      .eq('id', documentId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Falha ao solicitar análise.' };
    }

    console.log(`[Dashboard] Document ${documentId} successfully marked as pending.`);

    // Revalidate the document page to show the pending status
    revalidatePath(`/dashboard/documents/${documentId}`);
    revalidatePath('/dashboard/documents');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Action error:', error);
    return { success: false, error: 'Erro inesperado na solicitação.' };
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const supabase = await createClient();

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return { success: false, error: 'Não autorizado.' };
    }

    // 1. Get the document to find its file_path for Storage cleanup
    const { data: doc } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('user_id', session.user.id)
      .single();

    // 2. Delete from Storage if file exists
    if (doc?.file_path) {
      await supabase.storage.from('contracts').remove([doc.file_path]);
    }

    // 3. Delete analysis logs first (FK constraint)
    await supabase
      .from('analysis_logs')
      .delete()
      .eq('document_id', documentId);

    // 4. Delete from documents table
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: 'Falha ao excluir documento.' };
    }

    console.log(`[Dashboard] Document ${documentId} deleted successfully.`);

    // 5. Revalidate ALL pages that show documents
    revalidatePath('/dashboard/documents');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Delete action error:', error);
    return { success: false, error: 'Erro inesperado na exclusão.' };
  }
}
