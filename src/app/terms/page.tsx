import Link from 'next/link';
import { getServerLocale, createT } from '@/lib/i18n/server';
import { LocaleToggle } from '@/lib/i18n';

export async function generateMetadata() {
  const locale = await getServerLocale();
  const t = createT(locale);
  return {
    title: t('terms.title'),
    description: t('terms.description'),
  };
}

export default async function TermsPage() {
  const locale = await getServerLocale();
  const t = createT(locale);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="border-b border-white/5 bg-slate-900/50 pt-8 pb-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
              J
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Judite IA</span>
          </Link>
          <span className="text-slate-600 select-none">/</span>
          <span className="text-slate-400 font-medium">{t('pages.termsBreadcrumb')}</span>
          <div className="ml-auto">
            <LocaleToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('terms.h1')}</h1>
          <p className="text-sm text-slate-500">{t('terms.lastUpdate')}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('terms.s1Title')}</h2>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm">
            <p className="font-semibold text-amber-500 mb-2 uppercase tracking-wide">{t('terms.s1BoxTitle')}</p>
            <span dangerouslySetInnerHTML={{ __html: t('terms.s1BoxText1') }} />
            <br/><br/>
            <span dangerouslySetInnerHTML={{ __html: t('terms.s1BoxText2') }} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('terms.s2Title')}</h2>
          <p>{t('terms.s2Text')}</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>{t('terms.s2Li1')}</li>
            <li>{t('terms.s2Li2')}</li>
            <li>{t('terms.s2Li3')}</li>
            <li>{t('terms.s2Li4')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('terms.s3Title')}</h2>
          <p>
            {t('terms.s3Text')}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-300">{t('terms.s3Li1Title')}</strong><span dangerouslySetInnerHTML={{ __html: t('terms.s3Li1Text') }} /></li>
            <li><strong className="text-slate-300">{t('terms.s3Li2Title')}</strong>{t('terms.s3Li2Text')}<Link href="/dashboard/settings" className="text-indigo-400">{t('terms.s3Li2Link')}</Link>{t('terms.s3Li2Text2')}</li>
            <li><strong className="text-slate-300">{t('terms.s3Li3Title')}</strong><span dangerouslySetInnerHTML={{ __html: t('terms.s3Li3Text') }} /></li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('terms.s4Title')}</h2>
          <p>
            {t('terms.s4Text')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('terms.s5Title')}</h2>
          <p>
            {t('terms.s5Text')}
          </p>
        </section>

        <div className="pt-10 border-t border-slate-800">
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {t('pages.backHome')}
          </Link>
        </div>
      </main>
    </div>
  );
}
