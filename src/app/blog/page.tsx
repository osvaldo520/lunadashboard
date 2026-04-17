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

      {/* Footer Básico */}
      <footer className="py-8 border-t border-white/5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Judite IA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
