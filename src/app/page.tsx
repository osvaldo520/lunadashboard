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
            <img src="/judite-logo.png" alt="Judite Logo" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg object-contain bg-slate-900 border border-white/5" />
            <span className="text-[15px] sm:text-lg font-bold tracking-tight truncate">Judite</span>
          </Link>

          {/* Oculta em tablet pequeno e celular, mostra só em PC (lg) */}
          <div className="hidden lg:flex items-center gap-8 text-sm text-slate-400">
            <a href="#como-a-judite-analisa" className="hover:text-white transition-colors">Veja em Ação</a>
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
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
              Teste Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO — Persona A: Advogado Cansado
      ═══════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Imagem Translucida de Fundo (A Judite) */}
        <div className="absolute top-0 right-0 w-full h-[800px] md:h-[1000px] pointer-events-none overflow-hidden opacity-[0.45] mix-blend-screen" style={{ maskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 70%)' }}>
          <img 
            src="/juditeaifundo.png" 
            alt="Judite AI" 
            className="absolute top-0 right-[-10%] md:right-[0%] w-[120%] md:w-[800px] h-auto object-contain object-top opacity-90 filter drop-shadow-2xl"
          />
        </div>

        {/* Background Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-glow pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              A 1ª Bancada Multi-Agente Jurídica do Brasil
            </div>

            {/* H1 — Dor imediata do advogado */}
            <h1 className="animate-fade-in-up-delay-1 text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Pare de perder horas<br />em contratos.
              <br />
              <span className="text-gradient">Ganhe um escritório inteiro de IA.</span>
            </h1>

            {/* Subtitle — Concreto, menciona WhatsApp + Telegram */}
            <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Envie qualquer contrato — PDF, Word ou foto — pelo <strong className="text-white font-medium">WhatsApp</strong>, <strong className="text-white font-medium">Telegram</strong> ou direto na plataforma. 
              A Judite identifica cláusulas abusivas, verifica compliance LGPD/CDC, cruza dados no <strong className="text-white font-medium">STF e BACEN</strong> e entrega recomendações de negociação em minutos.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Testar Grátis — Sem Cartão
              </Link>
              <a
                href="#como-a-judite-analisa"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-base transition-all"
              >
                Ver análise real →
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
          SOCIAL PROOF BAR — Métricas Reais + Canais
      ═══════════════════════════════════════ */}
      <section className="py-12 border-y border-white/5 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Métricas */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 mb-6">
            {[
              { icon: '🧠', value: '360+', label: 'Capacidades de IA' },
              { icon: '🛡️', value: 'LGPD', label: 'Compliant' },
              { icon: '🔒', value: '100%', label: 'Dados nunca treinam IA' },
              { icon: '🔗', value: 'Solana', label: 'Validação On-Chain' },
              { icon: '📡', value: 'Dezenas', label: 'de APIs + IA Proprietária' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-center">
                <span className="text-lg">{item.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{item.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Canais de acesso */}
          <p className="text-center text-xs text-slate-600 font-medium flex items-center justify-center gap-1.5 flex-wrap">
            Funciona via{' '}
            <span className="inline-flex items-center gap-1 text-emerald-500/80"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</span>{' · '}
            <span className="inline-flex items-center gap-1 text-sky-400/80"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>Telegram</span>{' · '}
            <span className="text-indigo-400/80">Plataforma Web</span> — você escolhe onde prefere operar.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUTPUT DEMO — O que você recebe (a prova concreta)
      ═══════════════════════════════════════ */}
      <section id="como-a-judite-analisa" className="py-24 md:py-32 bg-slate-900/30 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">Resultado real</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              O que você recebe em <span className="text-gradient">minutos.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Envie um contrato e veja a Judite identificar cláusulas abusivas, verificar compliance e entregar recomendações de negociação prontas.
            </p>
          </div>
              
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Cláusulas Críticas */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 hover:border-indigo-500/20 transition-all shadow-xl">
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
                  <div key={item.clause} className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2 border border-slate-700/30">
                    <span className="text-xs text-slate-300 truncate mr-2">{item.clause}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${item.color}`}>{item.risk}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Placar de Risco Geral</span>
                  <span className="text-sm font-bold text-red-400 drop-shadow-sm">ALTÍSSIMO — 92/100</span>
                </div>
              </div>
            </div>

            {/* Card 2: Checklist Compliance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 hover:border-indigo-500/20 transition-all shadow-xl">
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
                  <div key={item.req} className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2 border border-slate-700/30">
                    <span className="text-xs text-slate-300 truncate mr-2">{item.req}</span>
                    <span className={`text-xs font-medium ${item.color}`}>{item.status} {item.statusText}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fundamentação Estratégica</span>
                  <span className="text-xs font-mono text-indigo-400">Lei 8.078/90 · Lei 13.709/18</span>
                </div>
              </div>
            </div>

            {/* Card 3: Recomendações */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 hover:border-indigo-500/20 transition-all md:col-span-2 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📋</span>
                <h3 className="text-base font-semibold text-white">Recomendações Finais e Próximos Passos</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-bold text-red-400">Alerta: NÃO ASSINE neste momento</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span>Documento não preenchido (vários placeholders em aberto)</li>
                    <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span>Viola dispositivos obrigatórios do Código de Defesa do Consumidor</li>
                    <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span>Desatende exigências mínimas da LGPD no Art. 7º</li>
                  </ul>
                </div>
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-emerald-400">Roadmap Sugerido de Negociação</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5 font-bold">1.</span>Solicite versão completa com escopo e valores financeiros pré-preenchidos.</li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5 font-bold">2.</span>Renegocie imediatamente as cláusulas 5, 6 e 7 de Terminação Unilateral.</li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5 font-bold">3.</span>Valide o aditivo com sua equipe e solicite nova auditoria (Score alvo: 20/100).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES / RECURSOS
      ═══════════════════════════════════════ */}
      <section id="recursos" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tudo que um escritório inteiro<br className="hidden md:block" /> 
              <span className="text-gradient">faria por você.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Análise de riscos, geração de documentos, pesquisa em tribunais — tudo integrado pelo WhatsApp, Telegram ou plataforma web. A Judite trabalha em silêncio para que você foque na estratégia.
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
              description="Tire uma foto do contrato na mesa e envie pelo WhatsApp ou Telegram. A Judite extrai o texto automaticamente e analisa na hora — sem scanner, sem digitalização manual."
            />
            {/* Feature 4 */}
            <FeatureCard
              icon={<PencilIcon />}
              title="Geração de Documentos"
              description="Peça à Judite para criar contratos, termos, procurações ou qualquer documento jurídico do zero. Ela redige com linguagem técnica precisa e entrega em PDF ou Word editável."
            />
            {/* Feature 5 — Voz (com áudio demo) */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-indigo-500/30 hover:bg-slate-900/60 p-6 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                <MicIcon />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Converse por Voz ou Texto</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">Mande um áudio no WhatsApp ou Telegram e a Judite responde por voz. Peça análises, ajustes e ela te envia o PDF formatado direto no chat — sem abrir nenhum site.</p>
              {/* Mini Audio Player — Demo da voz da Judite */}
              <div className="space-y-2">
                <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] text-indigo-300 font-semibold tracking-wide uppercase">🎧 Ouça a Judite em ação</p>
                    <span className="text-[9px] px-2 py-0.5 rounded-sm bg-indigo-500/20 text-indigo-400 font-bold uppercase tracking-widest">Exemplo</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Auditoria de riscos contratuais entregue diretamente no WhatsApp.</p>
                  <audio controls preload="none" className="w-full h-8 [&::-webkit-media-controls-panel]:bg-slate-900 [&::-webkit-media-controls-current-time-display]:text-slate-400 [&::-webkit-media-controls-time-remaining-display]:text-slate-400">
                    <source src="/demo-analise.mp3" type="audio/mpeg" />
                  </audio>
                </div>
                
                {/* Áudio secundário pausado (curiosidade)
                <div className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1.5">🏛️ Ouça a Judite pesquisando jurisprudência</p>
                  <audio controls preload="none" className="w-full h-8 [&::-webkit-media-controls-panel]:bg-slate-800 [&::-webkit-media-controls-current-time-display]:text-slate-400 [&::-webkit-media-controls-time-remaining-display]:text-slate-400">
                    <source src="/demo-juris.mp3" type="audio/mpeg" />
                  </audio>
                </div>
                */}
              </div>
            </div>
            {/* Feature 6 */}
            <FeatureCard
              icon={<ShieldIcon />}
              title="Silo Privado & Validação Blockchain"
              description="Arquivos rodam em silos criptografados com RLS governamental. Além de não usar dados para treinar a IA, a Judite cria selos de integridade on-chain de cada análise na rede blockchain Solana."
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
          ECOSSISTEMA MULTI-AGENTE (Persona B: Gestor)
      ═══════════════════════════════════════ */}
      <section id="ecossistema" className="py-24 md:py-32 bg-slate-900/30 border-y border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Por trás dos bastidores.<br className="hidden md:block" />
              <span className="text-gradient">O Ecossistema Multi-Agente em Ação.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A Judite não é um chat genérico. Ela é uma bancada de IAs especializadas que se coordenam para resolver problemas jurídicos complexos.
            </p>
          </div>

          {/* ECOSSISTEMA HOTSPOTS */}
          <div className="mb-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-3 text-shadow-sm">Infraestrutura Autônoma</span>
          </div>
          
          {/* O container Pai dita o tamanho 4:3 */}
          <div className="relative mx-auto w-full max-w-[320px] md:max-w-[520px] aspect-[4/3]">
            {/* Máscara do Vídeo */}
            <div className="absolute inset-0 rounded-[2rem] border border-indigo-500/20 bg-[#06070a]/50 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(99,102,241,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)]" />
              <video 
                src="/juditeescritorio.mp4"
                autoPlay 
                loop 
                muted 
                playsInline
                suppressHydrationWarning 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-90 mix-blend-lighten pointer-events-none"
              />
            </div>

            {/* SVG Lines */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
               <path d="M 50 50 L 20 70 M 50 50 L 80 70 M 50 50 L 30 30 M 50 50 L 70 30" className="stroke-indigo-400 stroke-[0.5px]" fill="none" style={{ strokeDasharray: '2 2' }} />
            </svg>

            <HotspotBubble x="50" y="50" title="Orquestradora Multi-Agente" desc="A Judite atua como Mestre de Obras. Ela não opera de forma isolada, distribuindo autonomamente a carga de processamento para os outros agentes e recrutando o modelo LLM mais qualificado sob demanda para cada tarefa." isCenter={true} align="center" />
            <HotspotBubble x="20" y="70" title="Sonda Governamental" desc="A IA cruza infrações com dezenas de APIs públicas simultâneas — varrendo STF, Banco Central e Diário Oficial em tempo real." align="left" />
            <HotspotBubble x="80" y="70" title="Arsenal Operacional" desc="Armada com centenas de ferramentas, ela navega na internet, empacota PDFs jurídicos e despacha documentos formatados direto no portal." align="right" />
            <HotspotBubble x="30" y="30" title="Silo Isolado RLS" desc="O banco de dados tranca cada arquivo de forma assimétrica. A Judite tem acesso cego: nenhum contrato corporativo é utilizado para treinar os LLMs." align="left" />
            <HotspotBubble x="70" y="30" title="Bancada de Compliance" desc="Uma comissão autônoma de agentes especializados audita cada documento antes da entrega. Aderência ética à OAB, conformidade LGPD/CDC e checklist de cláusulas problemáticas." align="right" />
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
            <p className="text-slate-400">Ative seu ambiente de avaliação. Assine quando estiver pronto.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Avaliação */}
            <PricingCard
              name="Avaliação"
              price="R$ 0"
              period=""
              description="Para testar o ecossistema."
              features={[
                '300 créditos de avaliação',
                'Analise 2 documentos',
                'Gere 1 arquivo PDF/DOCX',
                'Limitação: arquivos padrão',
                'Score de risco básico',
                'Interação por texto',
              ]}
              cta="Criar Conta de Avaliação"
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
                'Franquia 10.000 Créditos/mês',
                '~ 3.000 mensagens texto/mês',
                '⚡ Modo Avançado (Expert)',
                '🎙️ Interação por voz rica',
                '📸 Leitura por foto (OCR)',
                'Análises ilimitadas na franquia',
                'Exportação avançada (PDF & Word)',
                '🏛️ Consulta oficial do governo',
                'Suporte prioritário',
              ]}
              cta="Assinar Pro"
              ctaHref="/register?plan=pro"
              highlighted={true}
              disabled={false}
            />
          </div>

          {/* Banner Enterprise Horizontal */}
          <div className="mt-12 p-6 rounded-xl border border-white/5 bg-slate-900/30 flex flex-col md:flex-row items-center justify-between max-w-2xl mx-auto text-left gap-6">
            <div>
              <h4 className="text-white tracking-tight font-semibold text-sm mb-1">Opera em grande escala?</h4>
              <p className="text-slate-400 text-xs">Fale com a nossa equipe para desenhar um plano corporativo adequado ao volume e às necessidades estruturais do seu escritório.</p>
            </div>
            <a href="https://tally.so/r/obdLPb" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-5 py-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all">
              Consultar Assinatura Corporativa
            </a>
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
            Pronto para blindar sua operação<br className="hidden md:block" /> com inteligência autônoma?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Crie sua conta em 30 segundos. Envie seu primeiro contrato pelo WhatsApp, Telegram ou direto na plataforma.
          </p>
          <Link
            href="/register"
            className="inline-flex px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Testar Grátis — Sem Cartão
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
                <img src="/judite-logo.png" alt="Judite Logo" className="w-8 h-8 rounded-md object-contain bg-slate-900 border border-white/10 opacity-90" />
                <span className="text-lg font-bold text-white tracking-tight">Judite IA</span>
              </div>
              <p className="text-sm text-slate-400">
                A primeira bancada multi-agente autônoma para auditoria legal no Brasil.
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

          {/* Disclaimer Único Consolidado */}
          <div className="pt-8 border-t border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
              ⚖️ A Judite é uma ferramenta de apoio à elaboração e análise jurídica baseada em Inteligência Artificial, projetada para otimizar o fluxo de trabalho. 
              Ela <strong className="font-semibold text-slate-400">não substitui a atuação de um advogado(a)</strong> regularmente inscrito(a) na OAB, nem constitui prestação de serviço de consultoria ou assessoria jurídica. 
              Todos os relatórios, peças e documentos gerados na plataforma devem ser obrigatoriamente lidos, validados e sob responsabilidade integral do profissional do Direito antes de qualquer peticionamento ou uso final.
              Os resultados podem variar conforme o tipo de documento, complexidade da solicitação e modo de análise (Fast ou Expert).
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

function HotspotBubble({ x, y, title, desc, isCenter, align = "center" }: { x: string; y: string; title: string; desc: string; isCenter?: boolean; align?: "left" | "center" | "right" }) {
  const tooltipTransform = 
    align === 'left' ? 'translate(20px, -50%)' : 
    align === 'right' ? 'translate(calc(-100% - 20px), -50%)' : 
    'translate(-50%, calc(-100% - 20px))';
  
  const tooltipTop = 'top-1/2';
  const tooltipLeft = 'left-1/2';

  return (
    <div className="absolute group z-20 hover:z-50 focus-within:z-50" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
      <div tabIndex={0} className="relative flex items-center justify-center w-12 h-12 cursor-pointer focus:outline-none">
        <span className={`absolute inline-flex h-full w-full rounded-full ${isCenter ? 'bg-fuchsia-500' : 'bg-cyan-400'} opacity-50 group-hover:opacity-80 group-focus-within:opacity-80 animate-ping duration-[1500ms]`}></span>
        <span className={`relative inline-flex rounded-full bg-white transition-all duration-300 ${isCenter ? 'h-5 w-5 shadow-[0_0_20px_rgba(217,70,239,0.8)] ring-4 ring-fuchsia-500/50' : 'h-3.5 w-3.5 shadow-[0_0_15px_rgba(34,211,238,0.8)] ring-4 ring-cyan-500/50'} group-hover:scale-150 group-focus-within:scale-150`}></span>
      </div>
      
      <div 
        className={`absolute ${tooltipLeft} ${tooltipTop} opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-300 ease-out w-[240px] md:w-[320px] rounded-2xl bg-slate-900/95 border ${isCenter ? 'border-fuchsia-500/60' : 'border-cyan-500/60'} p-4 md:p-5 shadow-2xl shadow-black/80 backdrop-blur-xl z-30`} 
        style={{ transform: tooltipTransform }}
      >
        <h4 className={`text-sm font-bold mb-2 pb-2 border-b ${isCenter ? 'text-white border-fuchsia-500/30' : 'text-white border-cyan-500/30'}`}>{title}</h4>
        <p className="text-xs md:text-[13px] text-slate-300 leading-relaxed z-40">{desc}</p>
        
        {align === 'center' && (
          <div className={`hidden md:block absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r border-b bg-slate-900/95 ${isCenter ? 'border-fuchsia-500/60' : 'border-cyan-500/60'}`}></div>
        )}
      </div>
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
