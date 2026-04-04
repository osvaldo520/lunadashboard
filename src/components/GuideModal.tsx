'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function GuideModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
            <h2 className="text-base font-bold text-white">Guia de Uso</h2>
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
          <Section icon="📱" title="Como Começar">
            <div className="grid grid-cols-2 gap-2.5">
              <Card title="Via Painel Web" items={[
                'Acesse usejudite.com.br',
                'Clique em Comece Grátis',
                'Vincule o Telegram em 1 clique',
              ]} />
              <Card title="Via Telegram" items={[
                'Acesse @JuditeAI_bot',
                '/vincular + PIN do painel',
                'Confirmação automática',
              ]} />
            </div>
          </Section>

          {/* Conversa */}
          <Section icon="💬" title="O que você pode perguntar">
            <div className="space-y-1.5">
              <Example q="Qual o prazo para contestação no JEC?" tag="Dúvida" />
              <Example q="Essa multa rescisória de 50% é legal?" tag="Revisão" />
              <Example q="Conte 15 dias úteis a partir de hoje" tag="Cálculo" />
              <Example q="Crie um contrato de aluguel residencial" tag="Geração" />
              <Example q="Gera um PDF dessa análise" tag="Documento" />
            </div>
            <p className="mt-2.5 text-[11px] text-indigo-400">
              🎤 Envie áudios pelo Telegram — a Judite entende e pode responder por voz!
            </p>
          </Section>

          {/* Documentos */}
          <Section icon="📄" title="Análise de Documentos">
            <p className="text-[11px] text-slate-400 mb-2.5">
              Envie PDF, Word ou foto. Receba score de risco, cláusulas críticas e checklist LGPD/CDC.
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {['⚠️ Cláusulas', '🛡️ Compliance', '📊 Score', '📋 Ações'].map(i => (
                <div key={i} className="rounded-lg bg-slate-800/50 border border-slate-700/50 py-1.5 text-center text-[10px] text-slate-300">
                  {i}
                </div>
              ))}
            </div>
          </Section>

          {/* Gov */}
          <Section icon="🏛️" title="Dados Governamentais">
            <p className="text-[11px] text-slate-400 mb-2.5">
              41 APIs públicas — STF, DataJud, Câmara, BACEN, DOU e mais. Dados reais e gratuitos.
            </p>
            <div className="space-y-1.5">
              <Example q="Qual a taxa Selic hoje?" tag="BACEN" />
              <Example q="Processos de dano moral no TJSP" tag="DataJud" />
              <Example q="Compare gastos do deputado X com Y" tag="Câmara" />
              <Example q="Consulte o CNPJ 12.345.678/0001-90" tag="BrasilAPI" />
            </div>
          </Section>

          {/* Expert + Planos compacto */}
          <Section icon="📊" title="Planos">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-1 text-slate-400 font-medium">Recurso</th>
                    <th className="text-center py-1 text-slate-400 font-medium">Grátis</th>
                    <th className="text-center py-1 text-indigo-400 font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    ['Mensagens', '50 total', '100/dia'],
                    ['Análises', '5 total', '20/dia'],
                    ['PDF/DOCX', '2 total', '10/dia'],
                    ['OCR (foto)', '❌', '10/dia'],
                    ['Modo Expert', '❌', '✅'],
                    ['Dados Gov', '✅', '✅'],
                    ['Voz', '✅', '✅'],
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
            <p>💡 <strong className="text-slate-400">Seja específico</strong> — &quot;analise as cláusulas abusivas&quot; funciona melhor que &quot;me ajude&quot;</p>
            <p>📄 <strong className="text-slate-400">Peça PDF</strong> — Após qualquer pesquisa, diga &quot;gera um PDF disso&quot;</p>
            <p>🔄 <strong className="text-slate-400">Combine fontes</strong> — A Judite cruza dados oficiais + internet automaticamente</p>
          </div>
        </div>

        {/* Footer CTA - Fixed */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0a0b10] shrink-0">
          <a 
            href="/register" 
            className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Comece Grátis — Sem Cartão
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
        Guia de Uso
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
