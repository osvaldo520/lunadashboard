import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrelinhas — Análise e Geração de Contratos com IA',
  description: 'Envie seu contrato e receba uma análise completa de riscos em minutos. Crie documentos jurídicos por voz ou texto com a Luna IA. Proteja seu negócio sem depender de horas do time jurídico.',
  openGraph: {
    title: 'Entrelinhas — Sua Assistente Jurídica Inteligente',
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
              E
            </div>
            <span className="text-[15px] sm:text-lg font-bold tracking-tight truncate">Entrelinhas</span>
          </Link>

          {/* Oculta em tablet pequeno e celular, mostra só em PC (lg) */}
          <div className="hidden lg:flex items-center gap-8 text-sm text-slate-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
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
              Luna IA — Sua assistente jurídica pessoal
            </div>

            {/* H1 */}
            <h1 className="animate-fade-in-up-delay-1 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Pare de Perder Horas Revisando Contratos.{' '}
              <span className="text-gradient">A Luna Faz em Minutos.</span>
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
                  <span className="ml-3 text-xs text-slate-600">entrelinhas.app/dashboard</span>
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
            {['Luna IA', 'Next.js', 'Supabase', 'Telegram', 'Criptografia E2E'].map((tech) => (
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
              A Luna não é só uma ferramenta. É sua assistente jurídica que analisa, cria, corrige e conversa com você naturalmente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <FeatureCard
              icon={<BrainIcon />}
              title="Análise de Risco Inteligente"
              description="Envie qualquer contrato — PDF, Word ou imagem. A Luna identifica cláusulas abusivas, multas ocultas e riscos invisíveis em segundos."
            />
            {/* Feature 2 */}
            <FeatureCard
              icon={<PencilIcon />}
              title="Geração de Documentos"
              description="Peça à Luna para criar contratos, termos, procurações ou qualquer documento jurídico do zero. Ela redige com linguagem técnica precisa."
            />
            {/* Feature 3 */}
            <FeatureCard
              icon={<MicIcon />}
              title="Converse por Voz ou Texto"
              description="Mande um áudio no Telegram e a Luna responde por voz. Peça análises, ajustes e ela te envia o PDF formatado direto no chat — sem abrir nenhum site."
            />
            {/* Feature 4 */}
            <FeatureCard
              icon={<RepeatIcon />}
              title="Correção e Ajustes"
              description="'Luna, troque a cláusula 5 por algo mais favorável ao locatário.' Ela ajusta, reescreve e te entrega o documento revisado na hora."
            />
            {/* Feature 5 */}
            <FeatureCard
              icon={<ShieldIcon />}
              title="Segurança Corporativa"
              description="Seus documentos ficam criptografados com Row Level Security. Nenhum outro usuário, nem a equipe Entrelinhas, acessa seus dados."
            />
            {/* Feature 6 */}
            <FeatureCard
              icon={<DownloadIcon />}
              title="PDF Profissional em Todo Lugar"
              description="Exporte pelo painel web ou receba direto no Telegram. PDF formatado com identidade visual, pronto para enviar ao cliente ou ao tribunal."
            />
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
              description="Faça upload pelo painel web ou mande direto no Telegram. PDF, Word, imagem — a Luna aceita tudo."
            />
            <StepCard
              number="02"
              title="Luna Analisa ou Cria"
              description="Clique em 'Analisar' para um parecer completo, ou peça por chat: 'Luna, crie um contrato de aluguel para mim'."
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
              description="Para conhecer a Luna."
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
              price="R$ 97"
              period="/mês"
              description="Para profissionais e escritórios."
              features={[
                '100 mensagens por dia',
                '20 análises por dia',
                '10 gerações de PDF/dia',
                'Até 500 documentos',
                'OCR de imagens',
                'Interação por voz',
                'Exportação avançada',
                'Suporte prioritário',
              ]}
              cta="Assinar Pro"
              ctaHref="/register"
              highlighted={true}
            />
            {/* Enterprise */}
            <PricingCard
              name="Enterprise"
              price="Sob consulta"
              period=""
              description="Para empresas e times jurídicos."
              features={[
                'Uso ilimitado',
                'Multi-usuários',
                'API dedicada',
                'SLA garantido',
                'Treinamento da equipe',
                'Personalização da Luna',
              ]}
              cta="Falar com Vendas"
              ctaHref="mailto:contato@entrelinhas.app"
              highlighted={false}
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
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-xs">
                E
              </div>
              <span className="text-sm font-semibold">Entrelinhas</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Contato</a>
            </div>
            <p className="text-xs text-slate-700">
              © {new Date().getFullYear()} Entrelinhas. Todos os direitos reservados.
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/30 p-6 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
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

function PricingCard({ name, price, period, description, features, cta, ctaHref, highlighted }: {
  name: string; price: string; period: string; description: string;
  features: string[]; cta: string; ctaHref: string; highlighted: boolean;
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

      <Link
        href={ctaHref}
        className={`text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
          highlighted
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
            : 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
        }`}
      >
        {cta}
      </Link>
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

function RepeatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 14.652" />
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

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
