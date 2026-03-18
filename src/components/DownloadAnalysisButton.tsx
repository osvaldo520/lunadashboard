'use client';

import { Download } from 'lucide-react';

interface DownloadAnalysisButtonProps {
  content: string;
  documentTitle: string;
}

export function DownloadAnalysisButton({ content, documentTitle }: DownloadAnalysisButtonProps) {
  const handleDownload = () => {
    // Cria um Blob com o conteúdo da análise em Markdown
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    
    // Formata o nome do arquivo para algo seguro (ex: analise-contrato-de-trabalho.md)
    const safeTitle = documentTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    const filename = `analise-${safeTitle || 'documento'}.md`;

    // Cria e dispara o click num link virtual
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Limpeza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/20 hover:border-indigo-500/40"
      title="Baixar a análise em formato Markdown"
    >
      <Download className="h-4 w-4" />
      <span className="text-sm font-medium">Baixar Análise</span>
    </button>
  );
}
