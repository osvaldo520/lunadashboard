'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteDocument } from '@/app/actions/documents';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';

interface DeleteButtonProps {
  documentId: string;
  documentTitle: string;
}

export function DeleteButton({ documentId, documentTitle }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useLocale();

  const handleDelete = () => {
    const confirmed = window.confirm(
      t('dashboard.documentDetails.deleteConfirm').replace('{{title}}', documentTitle)
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteDocument(documentId);
      if (result?.success) {
        router.push('/dashboard/documents');
        router.refresh();
      } else {
        alert(result?.error || t('dashboard.documentDetails.errorDelete'));
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title={t('dashboard.documentDetails.deleteTooltip')}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
        isPending
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50'
      }`}
    >
      <Trash2 className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? t('dashboard.documentDetails.btnDeleting') : t('dashboard.documentDetails.btnDelete')}
    </button>
  );
}
