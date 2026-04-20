import type { Metadata } from 'next';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guia de Uso — Judite IA',
  description: 'Aprenda a usar todas as funcionalidades da Judite: análise de contratos, geração de documentos, consulta a dados do governo, modo expert e muito mais.',
};

export default async function GuidePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
                Voltar para o Painel
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Comece Grátis
                </Link>
              </>
            )}
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
                'No painel, vá em Configurações → Gerar Código de Vínculo e conecte o Telegram ou WhatsApp em 1 clique',
              ]} />
              <GuideCard title="Via Mensageiro (Direto)" items={[
                'Se já tem conta, acesse @JuditeAI_bot no Telegram ou envie mensagem no WhatsApp',
                'Envie vincular_ seguido do PIN de 6 dígitos do painel',
                'A Judite confirma a vinculação automaticamente',
              ]} />
            </div>
          </GuideSection>

          {/* Dashboard vs Telegram */}
          <GuideSection icon="🔄" title="Sua Assistente de Bolso">
            <p className="text-sm text-slate-400 mb-5">
              A Judite funciona em três ambientes complementares. Use cada um para o que ele faz melhor:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <h3 className="text-sm font-bold text-white">WhatsApp</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  O <strong className="text-emerald-300">canal mais prático</strong>. Converse por texto ou voz,
                  envie documentos, receba PDFs e consulte dados oficiais — tudo pelo app que você já usa.
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>✅ Conversa por texto e voz</li>
                  <li>✅ Envio de documentos pelo celular</li>
                  <li>✅ Recebe PDFs diretamente no chat</li>
                </ul>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                  <h3 className="text-sm font-bold text-white">Telegram</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-blue-300">Mais fluido para arquivos grandes.</strong> Converse em texto ou voz,
                  envie documentos direto do celular, tire fotos de contratos e receba PDFs no chat.
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>✅ Suporte a arquivos maiores</li>
                  <li>✅ Comandos especiais (/clear, /help)</li>
                  <li>✅ Consultas governamentais em tempo real</li>
                </ul>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  <h3 className="text-sm font-bold text-white">Painel Web (Pauta)</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seu <strong className="text-indigo-300">escritório digital</strong>. Gerencie documentos organizados,
                  acompanhe créditos, configure o Modo Expert e acesse seu acervo a qualquer momento.
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>✅ Biblioteca de documentos organizada</li>
                  <li>✅ Upload por arrastar e soltar</li>
                  <li>✅ Configurações e gestão de plano</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <p className="text-xs text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-300">Tudo sincronizado:</strong> Documentos salvos pelo WhatsApp ou Telegram
                aparecem no painel. Documentos enviados pelo painel podem ser analisados pela Judite nos mensageiros.
                Sua conta é única — acesse de onde quiser.
              </p>
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
              🎤 Envie áudios pelo WhatsApp ou Telegram — a Judite entende e pode responder por voz! (Plano Pro)
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
              Acesso direto a dezenas de APIs públicas brasileiras. Dados reais, gratuitos e em tempo real.
            </p>
            <div className="space-y-2">
              <ExampleQuery query="Qual a taxa Selic hoje?" tag="BACEN" />
              <ExampleQuery query="Busque processos de dano moral no TJSP" tag="DataJud" />
              <ExampleQuery query="Compare gastos do deputado X com Y" tag="Câmara" />
              <ExampleQuery query="Publicações sobre LGPD no diário oficial" tag="DOU" />
              <ExampleQuery query="Consulte o CNPJ XX.XXX.XXX/0001-XX" tag="BrasilAPI" />
              <ExampleQuery query="Pesquise jurisprudência sobre despejo por falta de pagamento" tag="Jurisprudência" />
              <ExampleQuery query="Houve alterações na Lei do Inquilinato em 2025?" tag="Legislação" />
              <ExampleQuery query="Pesquise sobre o processo XXXXX-XX.2025.8.26.XXXX" tag="Processo" />
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
                ⚠️ O Modo Expert consome mais créditos por interação. Disponível no plano Pro.
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
                    ['Créditos', '300 (trial)', '10.000/mês'],
                    ['Texto', '~100 msgs', '~3.000 msgs'],
                    ['Análise de Docs', '✅ (7 créd.)', '✅ (7 créd.)'],
                    ['Geração PDF/DOCX', '✅ (10 créd.)', '✅ (10 créd.)'],
                    ['OCR (foto)', '❌', '✅'],
                    ['Modo Expert', '❌', '✅'],
                    ['Dados Gov', '❌', '✅'],
                    ['Voz', '❌', '✅'],
                    ['Armazenamento', '10 MB', '200 MB'],
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
