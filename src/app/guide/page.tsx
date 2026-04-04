import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guia de Uso — Judite IA',
  description: 'Aprenda a usar todas as funcionalidades da Judite: análise de contratos, geração de documentos, consulta a dados do governo, modo expert e muito mais.',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      {/* Navbar simples */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm">
              J
            </div>
            <span className="text-lg font-bold tracking-tight">Judite</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all"
            >
              Comece Grátis
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Guia de Uso — <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Judite IA</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Tudo que você precisa saber para aproveitar ao máximo sua assistente jurídica inteligente.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {/* Começar */}
          <GuideSection icon="📱" title="Como Começar">
            <div className="grid md:grid-cols-2 gap-4">
              <GuideCard title="Via Painel Web (Recomendado)" items={[
                'Acesse usejudite.com.br',
                'Clique em Comece Grátis e crie sua conta',
                'No painel, clique em Vincular Telegram — abre o bot e conecta em 1 clique',
              ]} />
              <GuideCard title="Via Telegram (Direto)" items={[
                'Se já tem conta, acesse @JuditeAI_bot no Telegram',
                'Use /vincular + o PIN de 6 dígitos do painel',
                'A Judite confirma a vinculação automaticamente',
              ]} />
            </div>
          </GuideSection>

          {/* Conversa */}
          <GuideSection icon="💬" title="Conversando com a Judite">
            <p className="text-sm text-slate-400 mb-4">
              A Judite entende linguagem natural. Escreva como se falasse com uma colega advogada:
            </p>
            <div className="space-y-2">
              <ExampleQuery query="Qual o prazo para contestação no JEC?" tag="Dúvida jurídica" />
              <ExampleQuery query="Me explique o que é dano moral in re ipsa" tag="Conceito" />
              <ExampleQuery query="Essa cláusula de multa rescisória de 50% é legal?" tag="Revisão" />
              <ExampleQuery query="Conte 15 dias úteis a partir de hoje" tag="Cálculo" />
              <ExampleQuery query="Crie um contrato de aluguel residencial" tag="Geração" />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <p className="text-sm text-indigo-300">
                🎤 <strong>Voz:</strong> Envie áudios pelo Telegram! A Judite transcreve, entende e pode responder por voz.
              </p>
            </div>
          </GuideSection>

          {/* Documentos */}
          <GuideSection icon="📄" title="Análise de Documentos">
            <p className="text-sm text-slate-400 mb-4">
              Envie contratos em PDF, Word ou tire uma foto. A Judite identifica riscos automaticamente.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Cláusulas Críticas', icon: '⚠️' },
                { label: 'Compliance', icon: '🛡️' },
                { label: 'Score de Risco', icon: '📊' },
                { label: 'Recomendações', icon: '📋' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 text-center">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Formatos aceitos: PDF, DOCX, TXT, MD. Fotos de documentos disponíveis no plano Pro.
            </p>
          </GuideSection>

          {/* Gov */}
          <GuideSection icon="🏛️" title="Investigadora Governamental">
            <p className="text-sm text-slate-400 mb-4">
              Acesso direto a 41 APIs públicas brasileiras. Dados reais, gratuitos e em tempo real.
            </p>
            <div className="space-y-2">
              <ExampleQuery query="Qual a taxa Selic hoje?" tag="BACEN" />
              <ExampleQuery query="Busque processos de dano moral no TJSP" tag="DataJud" />
              <ExampleQuery query="Compare gastos do deputado X com Y" tag="Câmara" />
              <ExampleQuery query="Publicações sobre LGPD no diário oficial" tag="DOU" />
              <ExampleQuery query="Consulte o CNPJ 12.345.678/0001-90" tag="BrasilAPI" />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-emerald-300">
                ⚡ <strong>Consultas simples</strong> (Selic, CNPJ, CEP) são instantâneas — sem custo extra de IA.
              </p>
            </div>
          </GuideSection>

          {/* Expert */}
          <GuideSection icon="⚡" title="Modo Expert">
            <p className="text-sm text-slate-400 mb-4">
              Ative nas Configurações do painel para análises com o motor de IA premium exclusivo da Judite.
              Inclui fundamentação legal detalhada, checklist LGPD/CDC aprofundado e recomendações de negociação.
            </p>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-sm text-amber-300">
                ⚠️ O Modo Expert consome 5x mais créditos. Disponível no plano Pro.
              </p>
            </div>
          </GuideSection>

          {/* Comandos */}
          <GuideSection icon="🔧" title="Comandos do Telegram">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { cmd: '/start', desc: 'Boas-vindas' },
                { cmd: '/help', desc: 'Ajuda detalhada' },
                { cmd: '/clear', desc: 'Limpa contexto' },
                { cmd: '/vincular', desc: 'Vincula ao painel' },
              ].map((item) => (
                <div key={item.cmd} className="flex items-center gap-3 rounded-lg bg-slate-800/30 border border-slate-700/30 px-3 py-2">
                  <code className="text-xs text-indigo-400 font-mono">{item.cmd}</code>
                  <span className="text-xs text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </GuideSection>

          {/* Planos */}
          <GuideSection icon="📊" title="Limites por Plano">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 text-slate-400 font-medium">Recurso</th>
                    <th className="text-center py-2 text-slate-400 font-medium">Grátis</th>
                    <th className="text-center py-2 text-indigo-400 font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {[
                    { resource: 'Mensagens', free: '50 (total)', pro: '100/dia' },
                    { resource: 'Análises', free: '5 (total)', pro: '20/dia' },
                    { resource: 'Geração PDF/DOCX', free: '2 (total)', pro: '10/dia' },
                    { resource: 'Foto (OCR)', free: '❌', pro: '10/dia' },
                    { resource: 'Documentos', free: '5', pro: '500' },
                    { resource: 'Expert', free: '❌', pro: '✅' },
                    { resource: 'Dados Gov', free: '✅', pro: '✅' },
                    { resource: 'Voz', free: '✅', pro: '✅' },
                  ].map((row) => (
                    <tr key={row.resource} className="border-b border-slate-800/50">
                      <td className="py-2">{row.resource}</td>
                      <td className="py-2 text-center">{row.free}</td>
                      <td className="py-2 text-center">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GuideSection>

          {/* Dicas */}
          <GuideSection icon="💡" title="Dicas de Uso">
            <div className="space-y-3">
              {[
                { tip: 'Seja específico', desc: 'Em vez de "me ajude com contrato", diga "analise as cláusulas abusivas deste contrato de aluguel".' },
                { tip: 'Peça PDF', desc: 'Após qualquer pesquisa, peça "gera um PDF disso" e receba no chat.' },
                { tip: 'Use voz', desc: 'Mande áudio quando estiver ocupado — a Judite entende e responde.' },
                { tip: 'Combine fontes', desc: 'A Judite cruza dados oficiais do governo com a internet automaticamente.' },
                { tip: 'Contexto', desc: 'A Judite lembra da conversa. Diga "ajuste a cláusula 3" sem repetir tudo.' },
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
          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
            ⚖️ A Judite é uma ferramenta de apoio à elaboração e análise jurídica baseada em Inteligência Artificial.
            Ela <strong className="font-semibold text-slate-400">não substitui a atuação de um advogado(a)</strong> regularmente inscrito(a) na OAB.
            Todos os documentos gerados devem ser revisados por profissional do Direito antes de qualquer uso final.
          </p>
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
