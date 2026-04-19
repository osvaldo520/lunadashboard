import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/verify?tx=XXXXX
 * 
 * Endpoint PÚBLICO para verificação de integridade blockchain.
 * Usa service role key para bypassar RLS — qualquer pessoa com o TX pode verificar.
 * 
 * Retorna apenas campos públicos seguros (sem content, user_id, etc).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tx = searchParams.get('tx');

    if (!tx) {
      return NextResponse.json(
        { error: 'Parâmetro "tx" é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('documents')
      .select('id, title, doc_type, risk_score, analysis_summary, blockchain_tx, blockchain_hash, blockchain_network, created_at, updated_at, status')
      .eq('blockchain_tx', tx)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    // Retornar dados públicos de verificação (sem user_id, content, etc)
    return NextResponse.json({
      id: data.id,
      title: data.title,
      doc_type: data.doc_type,
      risk_score: data.risk_score,
      analysis_summary: data.analysis_summary,
      blockchain_tx: data.blockchain_tx,
      blockchain_hash: data.blockchain_hash,
      blockchain_network: data.blockchain_network,
      created_at: data.created_at,
      updated_at: data.updated_at,
      status: data.status,
    });
  } catch (error) {
    console.error('[Verify API] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao verificar' },
      { status: 500 }
    );
  }
}
