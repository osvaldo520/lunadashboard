import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Judite — Inteligência Artificial e Direito',
  description: 'Artigos, análises de jurisprudência e insights sobre como a Inteligência Artificial está transformando a atuação de advogados e escritórios.',
};

export const revalidate = 0; // Desativando cache severo para atualizar em tempo real

export default async function BlogIndexPage() {
  const supabase = await createClient();

  // Fetch published posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      {/* Navbar (Simplificada do Public) */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06070a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/judite-logo.png" alt="Judite Logo" className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-white/5" />
            <span className="text-lg font-bold tracking-tight">Judite <span className="font-light text-slate-400 border-l border-slate-700 ml-2 pl-2">Blog</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors">
              Acessar Painel
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/5 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Central de Inteligência
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Direito na Era da <span className="text-gradient">Inteligência Autônoma.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Insights práticos, análises de jurisprudência em tempo real e tutoriais avançados sobre como o ecossistema Judite blinda sua operação jurídica.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          {error ? (
            <div className="text-center py-12 text-slate-400 border border-red-500/20 bg-red-500/5 rounded-2xl">
              Erro ao carregar o blog. Verifique se a tabela foi configurada.
              <br />
              <span className="text-xs text-red-400 mt-2 block">{error.message} ({error.code})</span>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum artigo publicado</h3>
              <p className="text-slate-400">O motor de IA da Judite está analisando dados para publicar em breve.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all overflow-hidden h-full">
                  {/* Thumbnail area */}
                  <div className="aspect-video bg-slate-800 relative overflow-hidden flex-shrink-0">
                    {post.thumbnail_url ? (
                      <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-slate-900">
                        <BookOpen className="w-8 h-8 text-indigo-500/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5 font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {post.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at || new Date()).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow">
                      {post.meta_description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 mt-auto">
                      Ler artigo completo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER COMPLETO (Espelhado da Landing Page)
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
                Plataforma de Inteligência Jurídica Multi-Agente Autônoma.
              </p>
              <p className="text-xs text-slate-500 pt-2">
                © {new Date().getFullYear()} Judite IA.<br />Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://x.com/JuditeJuridica" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" title="X (Twitter)">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://instagram.com/osvaldodavidjr" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-500 transition-colors" title="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://wa.me/5511955506969" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors" title="WhatsApp">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            {/* Legal Links Column */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Jurídico</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Política de Privacidade</Link></li>
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    contato@usejudite.com.br
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5511955506969" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp: +55 (11) 95550-6969
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-8 border-t border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
              A Judite é uma ferramenta de inteligência artificial auxiliar. Seus resultados são informativos e não substituem a consulta a um advogado inscrito na OAB. Ao utilizar nossos serviços, você concorda com nossos Termos de Uso e Política de Privacidade.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
