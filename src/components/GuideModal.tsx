'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@/lib/i18n';

export default function GuideModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, locale } = useLocale();

  // Ensure portal only renders on client
  useEffect(() => { setMounted(true); }, []);

  // Close on ESC + lock scroll
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open]);

  const modal = open ? (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-slate-700/50 bg-[#0a0b10] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col"
        style={{ maxHeight: 'calc(100dvh - 48px)' }}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0 bg-[#0a0b10]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-xs text-white">
              J
            </div>
            <h2 className="text-base font-bold text-white">{t('nav.guide') || 'Guia de Uso'}</h2>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg border border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-8 overscroll-contain">
          {/* Como Começar */}
          <Section icon="📱" title={t('guide.startTitle')}>
            <div className="grid grid-cols-2 gap-2.5">
              <Card title={t('guide.startWebTitle')} items={[
                t('guide.startWeb1'),
                t('guide.startWeb2'),
                t('guide.startWeb3'),
              ]} />
              <Card title={t('guide.startMsgTitle')} items={[
                t('guide.startMsg1'),
                t('guide.startMsg2'),
                t('guide.startMsg3'),
              ]} />
            </div>
          </Section>

          {/* Dashboard vs Telegram */}
          <Section icon="🔄" title={t('guide.pocketTitle')}>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5">
                <h4 className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.waDesc') }} />
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 space-y-1.5">
                <h4 className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                  Telegram
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.tgDesc') }} />
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 space-y-1.5">
                <h4 className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  ⚖️ {t('guide.webTitle')}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.webDesc') }} />
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500" dangerouslySetInnerHTML={{ __html: t('guide.syncAlert') }} />
          </Section>

          {/* Conversa */}
          <Section icon="💬" title={t('guide.chatTitle')}>
            <div className="space-y-1.5">
              <Example q={t('guide.chatQ1')} tag={t('guide.chatT1')} />
              <Example q={t('guide.chatQ2')} tag={t('guide.chatT2')} />
              <Example q={t('guide.chatQ3')} tag={t('guide.chatT3')} />
              <Example q={t('guide.chatQ4')} tag={t('guide.chatT4')} />
              <Example q={t('guide.chatQ5')} tag={t('guide.chatT5')} />
            </div>
            <p className="mt-2.5 text-[11px] text-indigo-400">
              {t('guide.voiceAlert')}
            </p>
          </Section>

          {/* Documentos */}
          <Section icon="📄" title={t('guide.docTitle')}>
            <p className="text-[11px] text-slate-400 mb-2.5">
              {t('guide.docDesc')}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {['⚠️ ' + t('guide.doc1'), '🛡️ ' + t('guide.doc2'), '📊 ' + t('guide.doc3'), '📋 ' + t('guide.doc4')].map(i => (
                <div key={i} className="rounded-lg bg-slate-800/50 border border-slate-700/50 py-1.5 text-center text-[10px] text-slate-300">
                  {i}
                </div>
              ))}
            </div>
          </Section>

          {/* Gov */}
          <Section icon="🏛️" title={t('guide.govTitle')}>
            <p className="text-[11px] text-slate-400 mb-2.5">
              {t('guide.govDesc')}
            </p>
            <div className="space-y-1.5">
              <Example q={t('guide.govQ1')} tag="BACEN" />
              <Example q={t('guide.govQ2')} tag="DataJud" />
              <Example q={t('guide.govQ3')} tag="Câmara" />
              <Example q={t('guide.govQ5')} tag="BrasilAPI" />
              <Example q={t('guide.govQ6')} tag="Jurisprud." />
              <Example q={t('guide.govQ7')} tag="Legislação" />
              <Example q={t('guide.govQ8')} tag="Processo" />
            </div>
          </Section>

          {/* Expert */}
          <Section icon="⚡" title={t('guide.expertTitle')}>
            <p className="text-[11px] text-slate-400">
              {t('guide.expertDesc')}
            </p>
          </Section>

          {/* Expert + Planos compacto */}
          <Section icon="📊" title={t('guide.planTitle')}>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-1 text-slate-400 font-medium">{t('guide.planCol1')}</th>
                    <th className="text-center py-1 text-slate-400 font-medium">{t('guide.planCol2')}</th>
                    <th className="text-center py-1 text-indigo-400 font-medium">{t('guide.planCol3')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    [t('guide.res1'), '300 trial', '10.000/mês'],
                    [t('guide.res2'), '~100 msgs', '~3.000 msgs'],
                    [t('guide.res3'), '✅', '✅'],
                    [t('guide.res4'), '✅', '✅'],
                    [t('guide.res5'), '❌', '✅'],
                    [t('guide.res6'), '❌', '✅'],
                    [t('guide.res7'), '❌', '✅'],
                    [t('guide.res8'), '❌', '✅'],
                    [t('guide.res9'), '10 MB', '200 MB'],
                  ].map(([r, f, p]) => (
                    <tr key={r} className="border-b border-slate-800/50">
                      <td className="py-1">{r}</td>
                      <td className="py-1 text-center">{f}</td>
                      <td className="py-1 text-center">{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Dicas */}
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <p>💡 <strong className="text-slate-400">{t('guide.tip1T')}</strong> — {t('guide.tip1D')}</p>
            <p>📄 <strong className="text-slate-400">{t('guide.tip2T')}</strong> — {t('guide.tip2D')}</p>
            <p>🔄 <strong className="text-slate-400">{t('guide.tip4T')}</strong> — {t('guide.tip4D')}</p>
          </div>
        </div>

        {/* Footer CTA - Fixed */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0a0b10] shrink-0">
          <a 
            href="/register" 
            className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            {t('hero.ctaPrimary') || 'Comece Grátis — Sem Cartão'}
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="hover:text-white transition-colors text-sm text-slate-400"
      >
        {t('nav.guide') || 'Guia de Uso'}
      </button>

      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-2.5">
      <h4 className="text-[11px] font-semibold text-white mb-1.5">{title}</h4>
      <ol className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1 text-[10px] text-slate-400">
            <span className="text-indigo-400 font-bold">{i + 1}.</span>{item}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Example({ q, tag }: { q: string; tag: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-800/30 border border-slate-700/30 px-2.5 py-1.5">
      <span className="text-[11px] text-slate-300 italic">&quot;{q}&quot;</span>
      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 whitespace-nowrap ml-2">
        {tag}
      </span>
    </div>
  );
}
