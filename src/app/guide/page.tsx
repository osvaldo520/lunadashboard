import type { Metadata } from 'next';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';
import { getServerLocale, createT } from '@/lib/i18n/server';
import { LocaleToggle } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Guia de Uso — Judite IA',
  description: 'Aprenda a usar todas as funcionalidades da Judite: análise de contratos, geração de documentos, consulta a dados do governo, modo expert e muito mais.',
};

export default async function GuidePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = await getServerLocale();
  const t = createT(locale);

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      {/* Navbar dinâmica */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm">
              J
            </div>
            <span className="text-lg font-bold tracking-tight">Judite</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('dashboard.backToPanel') || 'Voltar para o Painel'}
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all"
                >
                  {t('nav.tryFree')}
                </Link>
              </>
            )}
            <LocaleToggle />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            {t('guide.title')} — <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Judite IA</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t('guide.subtitle')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {/* Começar */}
          <GuideSection icon="📱" title={t('guide.startTitle')}>
            <div className="grid md:grid-cols-2 gap-4">
              <GuideCard title={t('guide.startWebTitle')} items={[
                t('guide.startWeb1'),
                t('guide.startWeb2'),
                t('guide.startWeb3'),
              ]} />
              <GuideCard title={t('guide.startMsgTitle')} items={[
                t('guide.startMsg1'),
                t('guide.startMsg2'),
                t('guide.startMsg3'),
              ]} />
            </div>
          </GuideSection>

          {/* Dashboard vs Telegram */}
          <GuideSection icon="🔄" title={t('guide.pocketTitle')}>
            <p className="text-sm text-slate-400 mb-5">
              {t('guide.pocketDesc')}
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <h3 className="text-sm font-bold text-white">{t('guide.waTitle')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.waDesc') }} />
                <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>{t('guide.wa1')}</li>
                  <li>{t('guide.wa2')}</li>
                  <li>{t('guide.wa3')}</li>
                </ul>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                  <h3 className="text-sm font-bold text-white">{t('guide.tgTitle')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.tgDesc') }} />
                <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>{t('guide.tg1')}</li>
                  <li>{t('guide.tg2')}</li>
                  <li>{t('guide.tg3')}</li>
                </ul>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  <h3 className="text-sm font-bold text-white">{t('guide.webTitle')}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.webDesc') }} />
                <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>{t('guide.web1')}</li>
                  <li>{t('guide.web2')}</li>
                  <li>{t('guide.web3')}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.syncAlert') }} />
            </div>
          </GuideSection>

          {/* Conversa */}
          <GuideSection icon="💬" title={t('guide.chatTitle')}>
            <p className="text-sm text-slate-400 mb-4">
              {t('guide.chatDesc')}
            </p>
            <div className="space-y-2">
              <ExampleQuery query={t('guide.chatQ1')} tag={t('guide.chatT1')} />
              <ExampleQuery query={t('guide.chatQ2')} tag={t('guide.chatT2')} />
              <ExampleQuery query={t('guide.chatQ3')} tag={t('guide.chatT3')} />
              <ExampleQuery query={t('guide.chatQ4')} tag={t('guide.chatT4')} />
              <ExampleQuery query={t('guide.chatQ5')} tag={t('guide.chatT5')} />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <p className="text-sm text-indigo-300">
                {t('guide.voiceAlert')}
              </p>
            </div>
          </GuideSection>

          {/* Documentos */}
          <GuideSection icon="📄" title={t('guide.docTitle')}>
            <p className="text-sm text-slate-400 mb-4">
              {t('guide.docDesc')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: t('guide.doc1'), icon: '⚠️' },
                { label: t('guide.doc2'), icon: '🛡️' },
                { label: t('guide.doc3'), icon: '📊' },
                { label: t('guide.doc4'), icon: '📋' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 text-center">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {t('guide.docFormat')}
            </p>
          </GuideSection>

          {/* Gov */}
          <GuideSection icon="🏛️" title={t('guide.govTitle')}>
            <p className="text-sm text-slate-400 mb-4">
              {t('guide.govDesc')}
            </p>
            <div className="space-y-2">
              <ExampleQuery query={t('guide.govQ1')} tag={t('guide.govT1')} />
              <ExampleQuery query={t('guide.govQ2')} tag={t('guide.govT2')} />
              <ExampleQuery query={t('guide.govQ3')} tag={t('guide.govT3')} />
              <ExampleQuery query={t('guide.govQ4')} tag={t('guide.govT4')} />
              <ExampleQuery query={t('guide.govQ5')} tag={t('guide.govT5')} />
              <ExampleQuery query={t('guide.govQ6')} tag={t('guide.govT6')} />
              <ExampleQuery query={t('guide.govQ7')} tag={t('guide.govT7')} />
              <ExampleQuery query={t('guide.govQ8')} tag={t('guide.govT8')} />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-emerald-300" dangerouslySetInnerHTML={{ __html: t('guide.govAlert') }} />
            </div>
          </GuideSection>

          {/* Expert */}
          <GuideSection icon="⚡" title={t('guide.expertTitle')}>
            <p className="text-sm text-slate-400 mb-4">
              {t('guide.expertDesc')}
            </p>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-sm text-amber-300">
                {t('guide.expertAlert')}
              </p>
            </div>
          </GuideSection>

          {/* Comandos */}
          <GuideSection icon="🔧" title={t('guide.cmdTitle')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { cmd: '/start', desc: t('guide.cmd1Desc') },
                { cmd: '/help', desc: t('guide.cmd2Desc') },
                { cmd: '/clear', desc: t('guide.cmd3Desc') },
                { cmd: '/vincular', desc: t('guide.cmd4Desc') },
              ].map((item) => (
                <div key={item.cmd} className="flex items-center gap-3 rounded-lg bg-slate-800/30 border border-slate-700/30 px-3 py-2">
                  <code className="text-xs text-indigo-400 font-mono">{item.cmd}</code>
                  <span className="text-xs text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </GuideSection>

          {/* Planos */}
          <GuideSection icon="📊" title={t('guide.planTitle')}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 text-slate-400 font-medium">{t('guide.planCol1')}</th>
                    <th className="text-center py-2 text-slate-400 font-medium">{t('guide.planCol2')}</th>
                    <th className="text-center py-2 text-indigo-400 font-medium">{t('guide.planCol3')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    [t('guide.res1'), '300 (trial)', '10.000/mês'],
                    [t('guide.res2'), t('guide.res2Free'), t('guide.res2Pro')],
                    [t('guide.res3'), t('guide.res3Free'), t('guide.res3Pro')],
                    [t('guide.res4'), t('guide.res4Free'), t('guide.res4Pro')],
                    [t('guide.res5'), t('guide.res5Free'), t('guide.res5Pro')],
                    [t('guide.res6'), '❌', '✅'],
                    [t('guide.res7'), '❌', '✅'],
                    [t('guide.res8'), '❌', '✅'],
                    [t('guide.res9'), '10 MB', '200 MB'],
                  ].map(([resource, free, pro]) => (
                    <tr key={resource} className="border-b border-slate-800/50">
                      <td className="py-2">{resource}</td>
                      <td className="py-2 text-center">{free}</td>
                      <td className="py-2 text-center">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GuideSection>

          {/* Dicas */}
          <GuideSection icon="💡" title={t('guide.tipsTitle')}>
            <div className="space-y-3">
              {[
                { tip: t('guide.tip1T'), desc: t('guide.tip1D') },
                { tip: t('guide.tip2T'), desc: t('guide.tip2D') },
                { tip: t('guide.tip3T'), desc: t('guide.tip3D') },
                { tip: t('guide.tip4T'), desc: t('guide.tip4D') },
                { tip: t('guide.tip5T'), desc: t('guide.tip5D') },
              ].map((item) => (
                <div key={item.tip} className="flex gap-3 rounded-lg bg-slate-800/30 border border-slate-700/30 px-4 py-3">
                  <span className="text-indigo-400 font-semibold text-sm whitespace-nowrap">💡 {item.tip}:</span>
                  <span className="text-xs text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </GuideSection>
        </div>

        {/* Disclaimer */}
        <div className="mt-20 pt-8 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.disclaimer') }} />
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════ COMPONENTES ═══════════════════════ */

function GuideSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function GuideCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
            <span className="text-indigo-400 font-bold mt-0.5">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ExampleQuery({ query, tag }: { query: string; tag: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-800/30 border border-slate-700/30 px-3 py-2">
      <span className="text-xs text-slate-300 italic">&quot;{query}&quot;</span>
      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 whitespace-nowrap ml-2">
        {tag}
      </span>
    </div>
  );
}
