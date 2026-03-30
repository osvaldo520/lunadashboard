import Link from 'next/link';

export const metadata = {
  title: 'Sobre a Judite IA',
  description: 'Conheça a história e o propósito por trás da Judite IA.',
};

export default function AboutPage() {
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
          <span className="text-slate-400 font-medium">Sobre Nós</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">Sobre a Judite IA</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Democratizando e acelerando análises complexas no Direito através da Inteligência Artificial.
          </p>
        </section>

        <section className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-semibold text-white mb-4">A Nossa Missão</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                A advocacia moderna exige velocidade, mas o rigor técnico nunca pode ser deixado de lado. 
                Sabemos o quão exaustivo é passar horas lendo contratos extensos, triando jurisprudência 
                ou formulando o mesmo padrão de peças sucessivas vezes.
              </p>
              <p>
                Foi por isso que criamos a <strong>Judite IA</strong>.
              </p>
              <p>
                Nossa missão não é substituir o advogado — afinal, o raciocínio crítico, a estratégia e 
                a empatia humana são insubstituíveis e inerentes à profissão. Construímos a Judite para  
                <strong> ampliar suas capacidades</strong>, servindo como uma assistente virtual dedicada
                que extrai informações, aponta fragilidades em contratos e tira dúvidas instantaneamente 
                pelo WhatsApp e Telegram.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-6">
          <h2 className="text-2xl font-semibold text-white">Por que a Judite?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-indigo-400 font-semibold mb-2">Segurança em Primeiro Lugar</h3>
              <p className="text-sm text-slate-400">
                Seus PDFs e documentos são processados temporariamente com rígido sigilo. 
                Não usamos os dados dos clientes para treinar IAs (opt-out padrão de modelos LLM).
              </p>
            </div>
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-6">
              <h3 className="text-violet-400 font-semibold mb-2">Comunicação Sem Fricção</h3>
              <p className="text-sm text-slate-400">
                A IA não deve exigir que você aprenda a usar dezenas de prompts confusos. 
                Com a Judite, basta enviar um áudio ou foto no celular e ela responde contextualmente.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              <span className="text-2xl">👨🏻‍💻</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Criado por Osvaldo Junior</h3>
              <p className="text-slate-400 mt-1 pb-2">Desenvolvedor & Empreendedor</p>
              <div className="flex items-center gap-4 text-sm mt-1">
                <a href="https://instagram.com/osvaldodavidjr" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400 transition-colors">Instagram</a>
                <a href="mailto:contato@usejudite.com.br" className="text-indigo-400 hover:text-indigo-300 transition-colors">E-mail</a>
              </div>
            </div>
          </div>
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
