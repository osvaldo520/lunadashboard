import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * API Route: /api/export-job
 * 
 * Cria um Job assíncrono na tabela `document_jobs` do Supabase.
 * A Judite (VPS) está escutando esta tabela e fará a renderização pesada em background.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { documentId, format, contentType } = await req.json();

    if (!documentId || !['pdf', 'docx'].includes(format) || !['original', 'analysis'].includes(contentType)) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 });
    }

    // Cria o Job na fila
    const { data: job, error } = await supabase
      .from('document_jobs')
      .insert({
        user_id: user.id,
        document_id: documentId,
        format,
        content_type: contentType
      })
      .select('id')
      .single();

    if (error || !job) {
      console.error('[API /export-job] Supabase Error:', error);
      throw new Error('Falha ao inserir na fila de processamento.');
    }

    return NextResponse.json({ job_id: job.id }, { status: 200 });
    
  } catch (err: any) {
    console.error('[API /export-job] Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Falha ao solicitar exportação.' },
      { status: 500 }
    );
  }
}
