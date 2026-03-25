'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface RealtimeDocumentRefresherProps {
  documentId: string;
}

export function RealtimeDocumentRefresher({ documentId }: RealtimeDocumentRefresherProps) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Escuta alterações na tabela documents onde o evento é neste documentId específico
    const documentChannel = supabase
      .channel(`document-updates-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`,
        },
        () => {
          // Quando o documento for atualizado, faz um refresh da rota (RSC re-render invisível)
          router.refresh();
        }
      )
      .subscribe();

    // Escuta também a tabela analysis_logs para esse documento, caso a Judite adicione um log novo
    const logsChannel = supabase
      .channel(`logs-updates-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analysis_logs',
          filter: `document_id=eq.${documentId}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(documentChannel);
      supabase.removeChannel(logsChannel);
    };
  }, [documentId, router, supabase]);

  // Este componente é invisível na interface, apenas cuida da lógica de Realtime
  return null;
}
