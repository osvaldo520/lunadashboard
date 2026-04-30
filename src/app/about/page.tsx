import Link from 'next/link';
import { getServerLocale, createT } from '@/lib/i18n/server';
import { LocaleToggle } from '@/lib/i18n';

export async function generateMetadata() {
  const locale = await getServerLocale();
  const t = createT(locale);
  return {
    title: t('about.title'),
    description: t('about.description'),
  };
}

export default async function AboutPage() {
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
          <span className="text-slate-400 font-medium">{t('pages.aboutBreadcrumb')}</span>
          <div className="ml-auto">
            <LocaleToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('about.h1')}</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </section>

        <section className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('about.missionTitle')}</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>{t('about.missionP1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('about.missionP2') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.missionP3') }} />
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-6">
          <h2 className="text-2xl font-semibold text-white">{t('about.whyTitle')}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-indigo-400 font-semibold mb-2">{t('about.why1Title')}</h3>
              <p className="text-sm text-slate-400">
                {t('about.why1Text')}
              </p>
            </div>
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-6">
              <h3 className="text-violet-400 font-semibold mb-2">{t('about.why2Title')}</h3>
              <p className="text-sm text-slate-400">
                {t('about.why2Text')}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              <span className="text-2xl">👨🏻‍💻</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{t('about.creatorTitle')}</h3>
              <p className="text-slate-400 mt-1 pb-2">{t('about.creatorSubtitle')}</p>
              <div className="flex items-center gap-4 text-sm mt-1">
                <a href="https://instagram.com/osvaldodavidjr" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400 transition-colors">{t('about.instagram')}</a>
                <a href="mailto:contato@usejudite.com.br" className="text-indigo-400 hover:text-indigo-300 transition-colors">{t('about.email')}</a>
              </div>
            </div>
          </div>
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
