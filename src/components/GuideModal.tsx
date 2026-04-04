'use client';

import { useState, useEffect } from 'react';

export default function GuideModal() {
  const [open, setOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="hover:text-white transition-colors text-sm text-slate-400"
      >
        Guia de Uso
      </button>

      {open && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Modal */}
          <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-700/50 bg-[#0a0b10] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white">
                  J
                </div>
                <h2 className="text-lg font-bold text-white">Guia de Uso — Judite IA</h2>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-10">
              {/* Como Começar */}
              <Section icon="📱" title="Como Começar">
                <div className="grid md:grid-cols-2 gap-3">
                  <Card title="Via Painel Web (Recomendado)" items={[
                    'Acesse usejudite.com.br',
                    'Clique em Comece Grátis',
                    'Vincule o Telegram em 1 clique',
                  ]} />
                  <Card title="Via Telegram" items={[
                    'Acesse @JuditeAI_bot',
                    'Use /vincular + PIN do painel',
                    'Confirmação automática',
                  ]} />
                </div>
              </Section>

              {/* Conversa */}
              <Section icon="💬" title="Conversando com a Judite">
                <div className="space-y-1.5">
                  <Example q="Qual o prazo para contestação no JEC?" tag="Dúvida" />
                  <Example q="Me explique dano moral in re ipsa" tag="Conceito" />
                  <Example q="Essa multa rescisória de 50% é legal?" tag="Revisão" />
                  <Example q="Conte 15 dias úteis a partir de hoje" tag="Cálculo" />
                  <Example q="Crie um contrato de aluguel residencial" tag="Geração" />
                </div>
                <p className="mt-3 text-xs text-indigo-400">
                  🎤 Envie áudios pelo Telegram — a Judite entende e pode responder por voz!
                </p>
              </Section>

              {/* Documentos */}
              <Section icon="📄" title="Análise de Documentos">
                <p className="text-xs text-slate-400 mb-3">
                  Envie PDF, Word ou foto. A Judite identifica cláusulas críticas, verifica LGPD/CDC e dá um score de risco de 0 a 100.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {['⚠️ Cláusulas', '🛡️ Compliance', '📊 Score', '📋 Ações'].map(i => (
                    <div key={i} className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-2 text-center text-[10px] text-slate-300">
                      {i}
                    </div>
                  ))}
                </div>
              </Section>

              {/* Gov */}
              <Section icon="🏛️" title="Investigadora Governamental">
                <p className="text-xs text-slate-400 mb-3">
                  Acesso direto a 41 APIs públicas brasileiras — dados reais, gratuitos, em tempo real.
                </p>
                <div className="space-y-1.5">
                  <Example q="Qual a taxa Selic hoje?" tag="BACEN" />
                  <Example q="Busque processos de dano moral no TJSP" tag="DataJud" />
                  <Example q="Compare gastos do deputado X com Y" tag="Câmara" />
                  <Example q="Publicações sobre LGPD no diário oficial" tag="DOU" />
                  <Example q="Consulte o CNPJ 12.345.678/0001-90" tag="BrasilAPI" />
                </div>
              </Section>

              {/* Expert */}
              <Section icon="⚡" title="Modo Expert">
                <p className="text-xs text-slate-400">
                  Motor de IA premium exclusivo da Judite. Fundamentação legal detalhada, checklist LGPD/CDC aprofundado e recomendações de negociação. Disponível no plano Pro.
                </p>
              </Section>

              {/* Planos */}
              <Section icon="📊" title="Limites por Plano">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-1.5 text-slate-400">Recurso</th>
                        <th className="text-center py-1.5 text-slate-400">Grátis</th>
                        <th className="text-center py-1.5 text-indigo-400">Pro</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {[
                        ['Mensagens', '50 total', '100/dia'],
                        ['Análises', '5 total', '20/dia'],
                        ['PDF/DOCX', '2 total', '10/dia'],
                        ['OCR (foto)', '❌', '10/dia'],
                        ['Expert', '❌', '✅'],
                        ['Dados Gov', '✅', '✅'],
                        ['Voz', '✅', '✅'],
                      ].map(([r, f, p]) => (
                        <tr key={r} className="border-b border-slate-800/50">
                          <td className="py-1.5">{r}</td>
                          <td className="py-1.5 text-center">{f}</td>
                          <td className="py-1.5 text-center">{p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* Dicas */}
              <Section icon="💡" title="Dicas">
                <div className="space-y-2 text-xs text-slate-400">
                  <p>🎯 <strong className="text-slate-300">Seja específico</strong> — &quot;analise as cláusulas abusivas&quot; ao invés de &quot;me ajude com contrato&quot;</p>
                  <p>📄 <strong className="text-slate-300">Peça PDF</strong> — Após qualquer pesquisa, diga &quot;gera um PDF disso&quot;</p>
                  <p>🔄 <strong className="text-slate-300">Combine fontes</strong> — A Judite cruza dados oficiais + internet automaticamente</p>
                </div>
              </Section>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
              <a 
                href="/register" 
                className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Comece Grátis — Sem Cartão
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
      <h4 className="text-xs font-semibold text-white mb-2">{title}</h4>
      <ol className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
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
