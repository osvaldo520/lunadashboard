import { createClient } from '@/lib/supabase/server';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import { DocumentsTable } from '@/components/DocumentsTable';
import { Pagination } from '@/components/Pagination';
import { getServerLocale, createT } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DocumentsPage(props: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const t = createT(locale);
  
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const status = typeof searchParams.status === 'string' ? searchParams.status : '';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const ITEMS_PER_PAGE = typeof searchParams.per_page === 'string' ? parseInt(searchParams.per_page, 10) : 10;
  
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let dbQuery = supabase
    .from('documents')
    .select('*', { count: 'exact' });

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }
  
  if (status) {
    dbQuery = dbQuery.eq('status', status);
  }

  const { data: documents, count } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t('dashboard.documentsTitle')}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('dashboard.documentsSubtitle')}
          </p>
        </div>
      </div>

      <SearchFilterBar />

      <DocumentsTable documents={documents || []} />
      
      <Pagination totalPages={totalPages} totalItems={count || 0} />
    </div>
  );
}
