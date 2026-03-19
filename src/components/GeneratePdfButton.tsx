'use client';

import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface GeneratePdfButtonProps {
  content: string;
  documentTitle: string;
}

export function GeneratePdfButton({ content, documentTitle }: GeneratePdfButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = async () => {
    setLoading(true);

    try {
      // Formata nome do arquivo
      const safeTitle = documentTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const filename = `analise-${safeTitle || 'documento'}.pdf`;

      // ═══════════════════════════════════════════
      // ESTRATÉGIA HÍBRIDA: Processamento 100% no client-side
      // Usa a API Route local /api/generate-pdf para converter
      // markdown → PDF sem sobrecarregar a VPS nem a Edge Function.
      // ═══════════════════════════════════════════
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: documentTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      }

      const blob = await response.blob();

      // Dispara download no browser
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('[GeneratePdf] Error:', err);
      alert(`Erro ao gerar PDF: ${err.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePdf}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border text-sm font-medium ${
        loading
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700/50'
          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40'
      }`}
      title="Gerar PDF formatado da análise"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {loading ? 'Gerando PDF...' : 'Gerar PDF'}
    </button>
  );
}
