import Link from 'next/link';
import { getServerLocale, createT } from '@/lib/i18n/server';
import { LocaleToggle } from '@/lib/i18n';

export async function generateMetadata() {
  const locale = await getServerLocale();
  const t = createT(locale);
  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
  };
}

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const t = createT(locale);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header Simples */}
      <header className="border-b border-white/5 bg-slate-900/50 pt-8 pb-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
              J
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Judite IA</span>
          </Link>
          <span className="text-slate-600 select-none">/</span>
          <span className="text-slate-400 font-medium">{t('pages.privacyBreadcrumb')}</span>
          <div className="ml-auto">
            <LocaleToggle />
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('privacy.h1')}</h1>
          <p className="text-sm text-slate-500">{t('privacy.lastUpdate')}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('privacy.s1Title')}</h2>
          <p>
            {t('privacy.s1Text')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('privacy.s2Title')}</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-300">{t('privacy.s2Li1Title')}</strong>{t('privacy.s2Li1Text')}</li>
            <li><strong className="text-slate-300">{t('privacy.s2Li2Title')}</strong>{t('privacy.s2Li2Text')}</li>
            <li><strong className="text-slate-300">{t('privacy.s2Li3Title')}</strong>{t('privacy.s2Li3Text')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('privacy.s3Title')}</h2>
          <p>
            {t('privacy.s3Text')}
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm mt-2">
            <p className="font-semibold text-indigo-400 mb-1">{t('privacy.s3BoxTitle')}</p>
            <span dangerouslySetInnerHTML={{ __html: t('privacy.s3BoxText') }} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('privacy.s4Title')}</h2>
          <p>
            {t('privacy.s4Text')}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>{t('privacy.s4Li1')}</li>
            <li>{t('privacy.s4Li2')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('privacy.s5Title')}</h2>
          <p>
            {t('privacy.s5Text1')}<strong className="text-slate-300">{t('privacy.s5Text2')}</strong>{t('privacy.s5Text3')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">{t('privacy.s6Title')}</h2>
          <p>
            {t('privacy.s6Text')}
          </p>
          <a href="mailto:contato@usejudite.com.br" className="text-indigo-400 hover:text-indigo-300 font-medium">contato@usejudite.com.br</a>
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
