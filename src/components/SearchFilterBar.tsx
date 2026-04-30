'use client';

import { Search, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { useLocale } from '@/lib/i18n';

export function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useLocale();

  // Estados locais para digitação mais fluida (debounce visual)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Função para criar a nova URL mantendo os parâmetros existentes
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Sempre reseta para a página 1 ao buscar ou filtrar
      params.delete('page');
      return params.toString();
    },
    [searchParams]
  );

  // Debounced search (acionado onBlur ou onKeyDown Enter)
  const handleSearchCommit = (value: string) => {
    startTransition(() => {
      router.push(`?${createQueryString('q', value)}`);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(`?${createQueryString('status', e.target.value)}`);
    });
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isPending ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchCommit(searchTerm);
            }
          }}
          onBlur={() => handleSearchCommit(searchTerm)}
          placeholder={t('dashboard.searchPlaceholder')}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
        />
      </div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Filter className="h-4 w-4 text-slate-500" />
        </div>
        <select
          value={searchParams.get('status') || ''}
          onChange={handleStatusChange}
          className="appearance-none rounded-xl border border-slate-700/50 bg-slate-800/50 pl-10 pr-8 py-2.5 text-sm text-slate-100 hover:text-white hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
        >
          <option value="">{t('dashboard.status.all') || 'Todos os status'}</option>
          <option value="uploaded">{t('dashboard.status.uploaded')}</option>
          <option value="pending">{t('dashboard.status.pending')}</option>
          <option value="analyzing">{t('dashboard.status.analyzing')}</option>
          <option value="completed">{t('dashboard.status.completed')}</option>
          <option value="error">{t('dashboard.status.error')}</option>
        </select>
        {/* Seta customizada do select */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
