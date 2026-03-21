'use client';

import { FileDown, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ExportDocumentButtonProps {
  documentId: string;
  format: 'pdf' | 'docx';
  contentType: 'original' | 'analysis';
  label?: string;
}

export function ExportDocumentButton({ documentId, format, contentType, label }: ExportDocumentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      // 1. Enfileirar Job no Supabase via Endpoint Seguro
      const response = await fetch('/api/export-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, format, contentType }),
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar no cluster de processamento.');
      }

      const { job_id } = await response.json();

      // 2. Escutar a resposta assíncrona da Luna (VPS) via WebSocket
      const channel = supabase.channel(`job-${job_id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'document_jobs', filter: `id=eq.${job_id}` },
          (payload) => {
            const status = payload.new.status;
            
            if (status === 'completed' && payload.new.file_url) {
              // Finaliza WebSocket
              supabase.removeChannel(channel);
              
              // Dispara Download na MESMA ABA (Navegação Top-Level Burla Anti-Popups 100%)
              window.location.assign(payload.new.file_url);
              
              setLoading(false);
              setSuccess(true);
            } else if (status === 'error') {
              supabase.removeChannel(channel);
              setLoading(false);
              alert(payload.new.error_message || 'Erro crítico na renderização da VPS.');
            }
          }
        )
        .subscribe();

    } catch (err: any) {
      console.error('[ExportDocument] Error:', err);
      alert(`Falha: ${err.message}`);
      setLoading(false);
    }
  };

  const Icon = format === 'pdf' ? FileDown : FileText;

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border text-sm font-medium ${
        loading
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700/50'
          : success
          ? 'bg-green-500/10 text-green-400 border-green-500/20'
          : format === 'pdf'
            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40'
            : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border-blue-500/20 hover:border-blue-500/40'
      }`}
      title={`Exportar documento em ${format.toUpperCase()}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : success ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {loading ? 'Preparando...' : success ? 'Baixado!' : label || `Gerar ${format.toUpperCase()}`}
    </button>
  );
}
