'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useLocale } from '@/lib/i18n';

interface PaginationProps {
  totalPages: number;
  totalItems: number;
}

export function Pagination({ totalPages, totalItems }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentPerPage = Number(searchParams.get('per_page')) || 10;

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      router.push(`?${params.toString()}`);
    });
  };

  const changePerPage = (perPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('per_page', perPage.toString());
      params.delete('page'); // Always reset to page 1 when changing page size
      router.push(`?${params.toString()}`);
    });
  };

  // We should render the pagination footer even if there's only 1 page, 
  // so the user can still change the "items per page" if they want.
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="relative inline-flex items-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('pages.backHome') === 'Back to Home' ? 'Previous' : 'Anterior'}
        </button>
        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('pages.backHome') === 'Back to Home' ? 'Next' : 'Próxima'}
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-400">
            {t('dashboard.pagination.showing').split('{{page}}')[0]}
            <span className="font-medium text-white">{currentPage}</span>
            {t('dashboard.pagination.showing').split('{{page}}')[1].split('{{total}}')[0]}
            <span className="font-medium text-white">{totalPages || 1}</span>
            {' '}(<span className="font-medium text-white">{totalItems}</span> total)
          </p>
          
          <div className="flex items-center gap-2">
            <label htmlFor="per_page" className="text-sm text-slate-400">
              {t('dashboard.pagination.itemsPerPage')}
            </label>
            <select
              id="per_page"
              value={currentPerPage}
              onChange={(e) => changePerPage(Number(e.target.value))}
              disabled={isPending}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-300 hover:text-white hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
          </div>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-700 hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-700 hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Próxima</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
