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
  const isPendingQueue = status === 'pending';
  const isFirstAnalysis = status === 'uploaded';
  const isRetry = status === 'error' || status === 'completed';

  return (
    <button
      onClick={handleAnalyze}
      disabled={isPending || isAnalyzing || isPendingQueue}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isPending || isAnalyzing || isPendingQueue
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          : isRetry 
            ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
      }`}
    >
      {isPending || isAnalyzing || isPendingQueue ? (
        <RotateCw className="h-4 w-4 animate-spin text-indigo-400" />
      ) : isRetry ? (
        <RotateCw className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      
      {isPending || isPendingQueue
        ? 'Aguarde...' 
        : isAnalyzing 
          ? 'Analisando...' 
          : isFirstAnalysis
            ? 'Analisar'
            : isRetry 
              ? 'Analisar Novamente'
              : 'Analisar'}
    </button>
  );
}
