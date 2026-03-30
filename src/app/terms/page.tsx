import Link from 'next/link';

export const metadata = {
  title: 'Termos de Uso | Judite IA',
  description: 'Termos de Uso e isenção de responsabilidade da Judite IA.',
};

export default function TermsPage() {
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
          <span className="text-slate-400 font-medium">Termos de Uso</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Termos de Uso</h1>
          <p className="text-sm text-slate-500">Última atualização: Março de 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Isenção de Responsabilidade (Disclaimer)</h2>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm">
            <p className="font-semibold text-amber-500 mb-2 uppercase tracking-wide">Atenção Importante</p>
            A Judite IA é uma <strong>ferramenta de apoio</strong> tecnológico desenvolvida para auxiliar o fluxo 
            de trabalho jurídico através de Modelos de Linguagem de Larga Escala (LLM). 
            <br/><br/>
            <strong>A Judite IA NÃO SUBSTITUI UM ADVOGADO(A).</strong> A ferramenta não presta consultoria, 
            nem possui a capacidade ou registro profissional para garantir precisão técnico-jurídica infalível. 
            Todos os documentos, petições e análises geradas podem conter alucinações matemáticas ou textuais 
            (invenções geradas pela IA). 
            <strong> É dever exclusivo do operador do direito </strong> revisar, validar e assinar o 
            conteúdo produzido. A Judite IA não se responsabiliza por perdas processuais.
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. Uso Permitido</h2>
          <p>Você concorda em utilizar a Judite IA apenas para propósitos lícitos e éticos. É proibido:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Tentar burlar o sistema de créditos do chatbot (Telegram) ou os limites de OCR.</li>
            <li>Injetar malwares disfarçados de PDFs para comprometer a plataforma.</li>
            <li>Realizar scraping, engenharia reversa ou abuso dos webhooks do sistema.</li>
            <li>Revender ativamente o serviço da Judite escondendo sua autoria, sem parcerias oficiais (white-label).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Política de Assinatura, Limites e Cancelamentos</h2>
          <p>
            A Judite IA opera num modelo SaaS através de créditos e limites diários de requisições.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-300">Renovação de Limites:</strong> As requisições e ações do Plano Pro (PDFs, OCR, mensagens) são renovadas <strong>diariamente</strong>, de forma automática. Limites não utilizados não são acumulativos.</li>
            <li><strong className="text-slate-300">Cancelamento:</strong> O usuário pode solicitar o cancelamento diretamente no <Link href="/dashboard/settings" className="text-indigo-400">Dashboard</Link> a qualquer momento. Em cancelamentos, o acesso proporcional contínuo até o término do ciclo tarifado atual será mantido. Após sua expiração, a conta voltará aos limites do plano Grátis.</li>
            <li><strong className="text-slate-300">Reembolsos:</strong> Sendo um software processado em nuvem com alto consumo de GPU, **não realizamos reembolsos de períodos já iniciados**, salvo falhas críticas comprovadas do serviço.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Suspensão de Conta</h2>
          <p>
            A Judite IA pode suspender, remover limites provisoriamente ou banir contas (inclusive Pro) permanentemente e sem aviso prévio,
            caso seja detectado o vazamento intencional de chaves, abusos automatizados que sobrecarreguem nossa GPU, 
            ou ofensa/violação grave envolvendo a ferramenta.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">5. Jurisdição</h2>
          <p>
            Estes Termos serão regidos pelas leis da República Federativa do Brasil, 
            ficando eleito o foro da Comarca na cidade de domicílio da empresa para dirimir eventuais conflitos.
          </p>
        </section>

        <div className="pt-10 border-t border-slate-800">
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para a página inicial
          </Link>
        </div>
      </main>
    </div>
  );
}
