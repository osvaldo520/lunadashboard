'use client';

import { FileQuestion, X, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface DocumentPreviewModalProps {
  fileUrl: string;
  docType: string;
  filePath: string;
  previewLabel?: string;
  defaultType?: string;
  initialContent?: string | null;
}

export function DocumentPreviewModal({ fileUrl, docType, filePath, previewLabel, defaultType, initialContent }: DocumentPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lowerPath = filePath.toLowerCase();
  const isTextFile = lowerPath.endsWith('.txt') || lowerPath.endsWith('.md');
  const isPdf = lowerPath.endsWith('.pdf');
  const isOfficeFile = lowerPath.endsWith('.doc') || 
                       lowerPath.endsWith('.docx') || 
                       lowerPath.endsWith('.xls') || 
                       lowerPath.endsWith('.xlsx') || 
                       lowerPath.endsWith('.ppt') || 
                       lowerPath.endsWith('.pptx');

  // Google Docs Viewer URL for Office files
  const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  const handleOpen = async () => {
    setIsOpen(true);
    if (isTextFile && !textContent) {
      if (initialContent) {
        setTextContent(initialContent);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setTextContent(text);
      } catch (err) {
        console.error('Failed to fetch text content:', err);
        setTextContent('Erro ao carregar o conteúdo do arquivo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 transition-colors border border-slate-700 hover:border-indigo-500/50 group"
      >
        <FileQuestion className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium capitalize border-r border-slate-700/50 pr-2 mr-1">
          {docType || defaultType || 'Documento'}
        </span>
        <span className="text-xs uppercase tracking-wider font-semibold">
          {previewLabel || 'Visualizar'}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10">
                  <FileQuestion className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Pré-visualização do Arquivo
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <a 
                  href={fileUrl} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-colors"
                  title="Abre nativamente (pode fazer download dependendo do navegador)"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Download Original</span>
                </a>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-hidden flex flex-col">
              {isTextFile ? (
                <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="h-2 w-24 bg-slate-800 rounded"></div>
                        <div className="text-xs">Lendo conteúdo...</div>
                      </div>
                    </div>
                  ) : (
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans">
                      {textContent}
                    </pre>
                  )}
                </div>
              ) : isOfficeFile ? (
                <iframe 
                  src={googleDocsUrl} 
                  className="w-full h-full rounded-xl bg-white"
                  title="Pré-visualização Office"
                  loading="lazy"
                />
              ) : isPdf ? (
                <embed
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                  className="w-full h-full rounded-xl bg-slate-800"
                />
              ) : (
                <iframe 
                  src={fileUrl} 
                  className="w-full h-full rounded-xl bg-white"
                  title="Pré-visualização do Documento"
                  loading="lazy"
                />
              )}
            </div>
            
            {/* Footer / Actions */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500/90 text-xs">
                <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {isOfficeFile 
                  ? "Visualizando via Google Docs Viewer. Alguns elementos podem variar."
                  : isTextFile
                  ? "Visualizando conteúdo bruto (.txt/.md)."
                  : "Visualizando documento via navegador."}
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Abrir em Nova Aba
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
