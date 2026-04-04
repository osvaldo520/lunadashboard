import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import GuideModal from '@/components/GuideModal';

export const metadata: Metadata = {
  title: 'Judite — Análise e Geração de Contratos com IA',
  description: 'Envie seu contrato e receba uma análise completa de riscos em minutos. Crie documentos jurídicos por voz ou texto com a Judite IA. Proteja seu negócio sem depender de horas do time jurídico.',
  openGraph: {
    title: 'Judite — Sua Assistente Jurídica Inteligente',
    description: 'IA que analisa riscos, identifica cláusulas abusivas, gera contratos e conversa com você por voz. Experimente grátis.',
    type: 'website',
  },
};

export default async function LandingPage() {
  // Se o usuário já está logado, redireciona direto para o dashboard
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[#06070a] text-white bg-grid-pattern">
      {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm">
              J
            </div>
            <span className="text-[15px] sm:text-lg font-bold tracking-tight truncate">Judite</span>
          </Link>

          {/* Oculta em tablet pequeno e celular, mostra só em PC (lg) */}
          <div className="hidden lg:flex items-center gap-8 text-sm text-slate-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <GuideModal />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/login" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
              Entrar
            </Link>
            <Link 
              href="/register"
              className="text-[11px] sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25 shrink-0"
            >
              Comece Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-glow pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Judite IA — Sua assistente jurídica pessoal
            </div>

            {/* H1 */}
            <h1 className="animate-fade-in-up-delay-1 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Pare de Perder Horas Revisando Contratos.{' '}
              <span className="text-gradient">A Judite Faz em Minutos.</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Envie seus contratos e receba análises de risco completas. Peça ajustes, 
              correções ou <strong className="text-slate-200">crie documentos do zero</strong> — por texto ou por voz. 
              Como ter uma advogada brilhante no bolso, 24 horas por dia.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Comece Grátis — Sem Cartão
              </Link>
              <a
                href="#como-funciona"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-base transition-all"
              >
                Ver como funciona →
              </a>
            </div>
          </div>

          {/* Hero Visual — Dashboard Preview */}
          <div className="mt-16 md:mt-24 max-w-4xl mx-auto animate-fade-in-up-delay-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 glow-indigo">
              <div className="rounded-xl bg-slate-950/80 p-6 md:p-8">
                {/* Fake Dashboard Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 text-xs text-slate-600">judite.app/pauta</span>
                </div>

                {/* Fake KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Documentos', value: '47', color: 'text-white' },
                    { label: 'Análises Prontas', value: '38', color: 'text-emerald-400' },
                    { label: 'Alto Risco', value: '3', color: 'text-red-400' },
                    { label: 'Score Médio', value: '32%', color: 'text-amber-400' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                      <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                      <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                    </div>
                  ))}
                </div>

                {/* Fake Document Row */}
                <div className="space-y-2">
                  {[
                    { title: 'Contrato de Locação – Apt 302', status: 'Concluído', risk: 28, statusColor: 'text-emerald-400 bg-emerald-500/10' },
                    { title: 'Termo de Prestação de Serviços', status: 'Concluído', risk: 65, statusColor: 'text-emerald-400 bg-emerald-500/10' },
                    { title: 'NDA — Fornecedor Internacional', status: 'Analisando', risk: null, statusColor: 'text-blue-400 bg-blue-500/10' },
                  ].map((doc) => (
                    <div key={doc.title} className="flex items-center justify-between rounded-lg bg-slate-800/30 border border-slate-700/30 px-4 py-3">
                      <span className="text-sm text-slate-300 truncate">{doc.title}</span>
                      <div className="flex items-center gap-3">
                        {doc.risk !== null && (
                          <span className={`text-xs font-medium ${doc.risk > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {doc.risk}%
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${doc.statusColor}`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════ */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-widest mb-6">Construído com tecnologias de ponta</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-slate-600">
            {['Judite IA', 'Next.js', 'Supabase', 'Telegram', '41 APIs Gov', 'Segurança em Camadas'].map((tech) => (
              <span key={tech} className="text-sm font-medium hover:text-slate-400 transition-colors">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}
      <section id="recursos" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tudo que um escritório inteiro<br className="hidden md:block" /> 
              <span className="text-gradient">faria por você.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A Judite não é só uma ferramenta. É sua assistente jurídica que analisa, cria, corrige e conversa com você naturalmente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <FeatureCard
              icon={<BrainIcon />}
              title="Análise de Risco Inteligente"
              description="Envie qualquer contrato — PDF, Word ou tire uma foto direto pelo celular. A Judite identifica cláusulas abusivas, multas ocultas e riscos invisíveis em segundos."
            />
            {/* Feature 2 — Expert Mode */}
            <FeatureCard
              icon={<BoltIcon />}
              title="⚡ Modo Avançado (Expert)"
              description="Ative o motor de IA premium para análises mais profundas — com fundamentação legal detalhada, checklist LGPD/CDC e recomendações de negociação. Seu modo padrão continua funcionando normalmente."
              highlighted
            />
            {/* Feature 3 */}
            <FeatureCard
              icon={<CameraIcon />}
              title="Leitura de Documentos por Foto"
              description="Tire uma foto do contrato na mesa e envie pelo Telegram. A Judite extrai o texto automaticamente e analisa na hora — sem scanner, sem digitalização manual."
            />
            {/* Feature 4 */}
            <FeatureCard
              icon={<PencilIcon />}
              title="Geração de Documentos"
              description="Peça à Judite para criar contratos, termos, procurações ou qualquer documento jurídico do zero. Ela redige com linguagem técnica precisa."
            />
            {/* Feature 5 */}
            <FeatureCard
              icon={<MicIcon />}
              title="Converse por Voz ou Texto"
              description="Mande um áudio no Telegram e a Judite responde por voz. Peça análises, ajustes e ela te envia o PDF formatado direto no chat — sem abrir nenhum site."
            />
            {/* Feature 6 */}
            <FeatureCard
              icon={<ShieldIcon />}
              title="Segurança Corporativa"
              description="Seus documentos ficam criptografados com Row Level Security. Nenhum outro usuário, nem a equipe Judite, acessa seus dados."
            />
          </div>

          {/* Feature Destaque — Investigadora Governamental */}
          <div className="mt-6 group rounded-2xl border border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-500/60 hover:bg-indigo-500/10 ring-1 ring-indigo-500/10 p-6 md:p-8 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-500/30 transition-colors">
                  <GovIcon />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">🏛️ Investigadora Governamental</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Acesso direto ao STF, Câmara dos Deputados, Diário Oficial, Banco Central, DataJud e mais 36 APIs públicas brasileiras. 
                  Pesquise processos judiciais, compare indicadores econômicos, investigue editais de licitação e monitore publicações oficiais — tudo por conversa natural, sem sair do chat.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400 whitespace-nowrap">
                  Disponível no plano Pro
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COMO FUNCIONA
      ═══════════════════════════════════════ */}
      <section id="como-funciona" className="py-24 md:py-32 bg-slate-900/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Três passos. Sem complicação.
            </h2>
            <p className="text-slate-400">Do upload à decisão em menos de 5 minutos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <StepCard
              number="01"
              title="Envie o Documento"
              description="Faça upload pelo painel web ou mande direto no Telegram. PDF, Word ou foto escaneada — a Judite aceita tudo."
            />
            <StepCard
              number="02"
              title="Judite Analisa ou Cria"
              description="Clique em 'Analisar' para um parecer completo, ou peça por chat: 'Judite, crie um contrato de aluguel para mim'."
            />
            <StepCard
              number="03"
              title="Receba e Aja"
              description="Análise com score de risco, PDF formatado e recomendações claras. Peça ajustes por voz até ficar perfeito."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRÉVIA DE ANÁLISE
      ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Veja como uma análise da Judite<br className="hidden md:block" />
              <span className="text-gradient">se parece na prática.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Upload, clique em analisar e receba um parecer completo com score de risco, cláusulas identificadas, checklist de compliance e recomendações claras.
            </p>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Cláusulas Críticas */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚠️</span>
                <h3 className="text-base font-semibold text-white">Cláusulas Críticas Identificadas</h3>
              </div>
              <div className="space-y-2">
                {[
                  { clause: 'Limitação de Responsabilidade', risk: 'Abusiva', color: 'text-red-400 bg-red-500/10' },
                  { clause: 'Alteração Unilateral sem Prazo', risk: 'Importante', color: 'text-amber-400 bg-amber-500/10' },
                  { clause: 'Encerramento Arbitrário', risk: 'Importante', color: 'text-amber-400 bg-amber-500/10' },
                  { clause: 'Cessão de Direitos Autorais', risk: 'Abusiva', color: 'text-red-400 bg-red-500/10' },
                  { clause: 'Multa Rescisória 50%', risk: 'Abusiva', color: 'text-red-400 bg-red-500/10' },
                ].map((item) => (
                  <div key={item.clause} className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2">
                    <span className="text-xs text-slate-300 truncate mr-2">{item.clause}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${item.color}`}>{item.risk}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Placar de Risco Geral</span>
                  <span className="text-sm font-bold text-red-400">ALTÍSSIMO — 92/100</span>
                </div>
              </div>
            </div>

            {/* Card 2: Checklist Compliance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🛡️</span>
                <h3 className="text-base font-semibold text-white">Checklist de Compliance</h3>
              </div>
              <div className="space-y-2">
                {[
                  { req: 'LGPD — Base Legal Explícita', status: '❌', statusText: 'Falhou', color: 'text-red-400' },
                  { req: 'LGPD — Direitos do Titular', status: '❌', statusText: 'Falhou', color: 'text-red-400' },
                  { req: 'CDC — Equilíbrio de Direitos', status: '❌', statusText: 'Falhou', color: 'text-red-400' },
                  { req: 'CDC — Clareza de Termos', status: '⚠️', statusText: 'Parcial', color: 'text-amber-400' },
                  { req: 'Código Civil — Boa-fé', status: '✅', statusText: 'OK', color: 'text-emerald-400' },
                ].map((item) => (
                  <div key={item.req} className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2">
                    <span className="text-xs text-slate-300 truncate mr-2">{item.req}</span>
                    <span className={`text-xs font-medium ${item.color}`}>{item.status} {item.statusText}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fundamentação</span>
                  <span className="text-xs text-indigo-400">Lei 8.078/90 · Lei 13.709/18 · CC/2002</span>
                </div>
              </div>
            </div>

            {/* Card 3: Recomendações */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/20 transition-all md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📋</span>
                <h3 className="text-base font-semibold text-white">Recomendações Finais</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-400">NÃO ASSINE neste momento</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span>Documento não preenchido (placeholders em aberto)</li>
                    <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span>Viola dispositivos obrigatórios do CDC</li>
                    <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span>Desatende exigências mínimas da LGPD</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-400">Próximos Passos</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">1.</span>Solicite versão completa com todas as seções preenchidas</li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">2.</span>Renegocie cláusulas 5, 6 e 7</li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">3.</span>Valide com advogado inscrito na OAB/UF</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-[11px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
              ⚖️ Os resultados podem variar conforme o tipo de documento, complexidade e modo de análise selecionado. 
              Esta análise é de caráter informativo e deve ser revisada por advogado(a) inscrito(a) na Ordem dos Advogados do Brasil (OAB) 
              antes de qualquer decisão jurídica.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING
      ═══════════════════════════════════════ */}
      <section id="precos" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Escolha o plano certo para você.
            </h2>
            <p className="text-slate-400">Comece grátis. Atualize quando precisar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <PricingCard
              name="Grátis"
              price="R$ 0"
              period=""
              description="Para conhecer a Judite."
              features={[
                '50 mensagens (total)',
                '5 análises de documento',
                '2 gerações de PDF',
                'Até 5 documentos',
                'Upload de PDF e Word',
                'Score de risco',
                'Interação por voz',
              ]}
              cta="Começar Grátis"
              ctaHref="/register"
              highlighted={false}
            />
            {/* Pro */}
            <PricingCard
              name="Pro"
              price="R$ 197"
              period="/mês"
              description="Para profissionais e escritórios."
              features={[
                '100 mensagens por dia',
                '20 análises por dia',
                '10 gerações de PDF/dia',
                'Até 500 documentos',
                'Leitura por foto (10/dia)',
                '⚡ Modo Avançado (Expert)',
                '🏛️ Dados oficiais do governo',
                'Interação por voz',
                'Exportação avançada',
                'Suporte prioritário',
              ]}
              cta="Assinar Pro"
              ctaHref="/register?plan=pro"
              highlighted={true}
              disabled={false}
            />
            {/* Enterprise */}
            <PricingCard
              name="Enterprise"
              price="Sob consulta"
              period=""
              description="Para empresas e times jurídicos."
              features={[
                'Tudo do Pro incluso',
                'Volume ilimitado',
                'Multi-usuários',
                'SLA garantido',
                'Personalização da Judite',
                'Onboarding dedicado',
              ]}
              cta="Falar com Equipe"
              ctaHref="#"
              highlighted={false}
              disabled={true}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Pronto para ter uma IA jurídica<br className="hidden md:block" /> trabalhando para você?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Crie sua conta em 30 segundos. Sem cartão. Sem compromisso.
          </p>
          <Link
            href="/register"
            className="inline-flex px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Comece Grátis Agora
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="py-16 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
                  J
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Judite IA</span>
              </div>
              <p className="text-sm text-slate-400">
                Agilizando análises jurídicas com o poder da Inteligência Artificial.
              </p>
              <p className="text-xs text-slate-500 pt-2">
                © {new Date().getFullYear()} Judite IA.<br />Todos os direitos reservados.
              </p>
              <p className="text-xs font-medium text-slate-600 pt-2 flex items-center gap-1">
                Feito com <span className="text-indigo-400">💜</span> por Osvaldo Junior
              </p>
            </div>

            {/* Legal Links Column */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Termos de Uso</Link></li>
                <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Sobre Nós</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contato</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li>
                  <a href="mailto:contato@usejudite.com.br" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    contato@usejudite.com.br
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5511955506969" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp: (11) 95550-6969
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/osvaldodavidjr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    @osvaldodavidjr
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
              ⚖️ A Judite é uma ferramenta de apoio à elaboração e análise jurídica baseada em Inteligência Artificial, projetada para otimizar o fluxo de trabalho. 
              Ela <strong className="font-semibold text-slate-400">não substitui a atuação de um advogado(a)</strong> regularmente inscrito(a) na OAB, nem constitui prestação de serviço de consultoria ou assessoria jurídica. 
              Todos os relatórios, peças e documentos gerados na plataforma devem ser obrigatoriamente lidos, validados e sob responsabilidade integral do profissional do Direito antes de qualquer peticionamento ou uso final.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPONENTES INLINE
═══════════════════════════════════════ */

function FeatureCard({ icon, title, description, highlighted }: { icon: React.ReactNode; title: string; description: string; highlighted?: boolean }) {
  return (
    <div className={`group rounded-2xl border p-6 transition-all duration-300 ${
      highlighted 
        ? 'border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-500/60 hover:bg-indigo-500/10 ring-1 ring-indigo-500/10' 
        : 'border-slate-800 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-slate-900/60'
    }`}>
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-colors ${
        highlighted
          ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 group-hover:bg-indigo-500/30'
          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20'
      }`}>
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      {highlighted && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-400">
          Disponível no plano Pro
        </div>
      )}
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-bold text-sm mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, period, description, features, cta, ctaHref, highlighted, disabled }: {
  name: string; price: string; period: string; description: string;
  features: string[]; cta: string; ctaHref: string; highlighted: boolean; disabled?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border p-6 flex flex-col ${
      highlighted 
        ? 'border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10' 
        : 'border-slate-800 bg-slate-900/30'
    }`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-xs font-semibold text-white">
          Mais Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
        <p className="text-xs text-slate-500 mb-4">{description}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{price}</span>
          {period && <span className="text-sm text-slate-500">{period}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {disabled ? (
        <span
          className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all cursor-default ${
            highlighted
              ? 'bg-indigo-600/60 text-white/80'
              : 'border border-slate-700/60 text-slate-400'
          }`}
        >
          {cta}
        </span>
      ) : (
        <Link
          href={ctaHref}
          className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
            highlighted
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
              : 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
          }`}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SVG ICONS (inline, zero dependência)
═══════════════════════════════════════ */

function BrainIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function GovIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  );
}
