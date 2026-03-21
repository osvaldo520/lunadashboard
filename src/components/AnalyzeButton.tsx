'use client';

import { Play, RotateCw } from 'lucide-react';
import { useTransition } from 'react';
import { requestAnalysis } from '@/app/actions/documents';
import { useRouter } from 'next/navigation';

interface AnalyzeButtonProps {
  documentId: string;
  status: string;
}

export function AnalyzeButton({ documentId, status }: AnalyzeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAnalyze = () => {
    if (status === 'analyzing') {
      const confirmReset = window.confirm(
        'Este documento já consta como EM ANÁLISE no servidor.\n\nVocê só deve forçar o reinício se a I.A estiver travada há mais de 5 minutos, pois isso consumirá seus créditos novamente.\n\nDeseja forçar o destravamento e reiniciar?'
      );
      if (!confirmReset) return;
    }

    startTransition(async () => {
      const result = await requestAnalysis(documentId);
      if (result?.success) {
        router.refresh();
      } else {
        alert(result?.error || 'Erro ao iniciar análise');
      }
    });
  };

  const isAnalyzing = status === 'analyzing';
  const isFirstAnalysis = status === 'uploaded' || status === 'pending';
  const isRetry = status === 'error' || status === 'completed' || status === 'analyzing';

  return (
    <button
      onClick={handleAnalyze}
      disabled={isPending}
      title={isAnalyzing ? "Clique para forçar o destravamento caso esteja travado há muito tempo." : ""}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isPending
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          : isAnalyzing
            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30'
            : isRetry 
              ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
      }`}
    >
      {isPending || isAnalyzing ? (
        <RotateCw className="h-4 w-4 animate-spin text-indigo-400" />
      ) : isRetry ? (
        <RotateCw className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      
      {isPending 
        ? 'Aguarde...' 
        : isAnalyzing 
          ? 'Destravar (Force Restart)' 
          : isFirstAnalysis
            ? 'Analisar'
            : isRetry 
              ? 'Analisar Novamente'
              : 'Analisar'}
    </button>
  );
}
