import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade | Judite IA',
  description: 'Política de Privacidade e uso de dados da Judite IA.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header Simples */}
      <header className="border-b border-white/5 bg-slate-900/50 pt-8 pb-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20">
              J
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Judite IA</span>
          </Link>
          <span className="text-slate-600 select-none">/</span>
          <span className="text-slate-400 font-medium">Privacidade</span>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Política de Privacidade</h1>
          <p className="text-sm text-slate-500">Última atualização: Março de 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Introdução</h2>
          <p>
            A Judite IA tem o compromisso de proteger a privacidade e a segurança dos dados de 
            seus usuários, especialmente considerando a natureza sensível e confidencial das informações 
            jurídicas. Esta política explica como coletamos, usamos, armazenamos e protegemos seus dados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. Dados Coletados</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-300">Dados de Cadastro:</strong> Nome, e-mail, telefone e nome da empresa/escritório (opcional).</li>
            <li><strong className="text-slate-300">Dados de Acesso:</strong> IDs de integração via mensageiros (como Telegram) para vinculação da conta.</li>
            <li><strong className="text-slate-300">Documentos e Arquivos:</strong> PDFs e imagens enviados para extração e análise.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Processamento de Documentos e IA</h2>
          <p>
            Os arquivos (como contratos e imagens) enviados para a Judite IA são processados utilizando provedores de infraestrutura de inteligência artificial (LLMaaS) atuando estritamente como processadores de dados (Data Processors), única e exclusivamente para realizar as análises solicitadas pelo usuário.
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm mt-2">
            <p className="font-semibold text-indigo-400 mb-1">Privacidade dos modelos de linguagem:</p>
            Os dados extraídos dos seus documentos corporativos e jurídicos <strong>não são utilizados</strong> para treinar ou melhorar os modelos fundamentais públicos de IA. O processamento ocorre via APIs corporativas com acordos estritos de processamento de dados (DPA).
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Segurança e Retenção</h2>
          <p>
            Seus dados cadastrais são armazenados em infraestrutura segura gerida pela Supabase. 
            Em relação aos documentos processados:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Os arquivos temporários, como fotos enviadas via chat, não são armazenados permanentemente em nossos servidores de banco de dados; seu conteúdo fica temporariamente em memória para análise e é posteriormente descartado.</li>
            <li>PDFs gerados ou analisados no Dashboard são vinculados à sua conta com rígidas regras de segurança (Row Level Security - RLS), acessíveis apenas por você.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">5. Pagamentos</h2>
          <p>
            Não armazenamos dados completos de cartão de crédito. Nossos pagamentos são processados
            pela <strong className="text-slate-300">Stripe</strong>, provedora líder global em infraestrutura de pagamentos, 
            garantindo total conformidade com os padrões de segurança PCI.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">6. Contato</h2>
          <p>
            Em caso de dúvidas sobre essa política de privacidade ou sobre os dados armazenados em sua conta, você pode contatar nosso encarregado de dados através do e-mail:
          </p>
          <a href="mailto:contato@usejudite.com.br" className="text-indigo-400 hover:text-indigo-300 font-medium">contato@usejudite.com.br</a>
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
