import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, Share2, Tag } from 'lucide-react';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

export const revalidate = 3600;

// Dynamic Metadata generation for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('blog_posts').select('title, meta_description, thumbnail_url').eq('slug', slug).single();

  if (!post) {
    return { title: 'Post não encontrado | Judite Blog' };
  }

  return {
    title: `${post.title} | Judite Blog`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description || '',
      type: 'article',
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post || post.status !== 'published') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      {/* Navbar Minimalista */}
      <nav className="border-b border-white/5 bg-[#06070a]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
          <div className="flex items-center gap-2">
             <img src="/judite-logo.png" alt="Judite Logo" className="w-6 h-6 rounded object-contain bg-slate-900 border border-white/5 opacity-50" />
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Post Header */}
        <header className="mb-12">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-300">
                  {post.author_name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-white">{post.author_name}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
            
            <button className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Compartilhar">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Thumbnail Hero (if exists) */}
        {post.thumbnail_url && (
          <div className="w-full aspect-[21/9] md:aspect-[2/1] rounded-2xl overflow-hidden mb-12 border border-slate-800">
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content Render (React Markdown Premium) */}
        <div className="article-content">
          <MarkdownRenderer content={post.content_md.replace(/\\n/g, '\n')} />
        </div>

        {/* Footer/Author Box */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
               <img src="/judite-logo.png" alt="Judite IA" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Escrito por {post.author_name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                A Judite é uma bancada multi-agente autônoma desenhada para escalar a operação de advogados e escritórios. Seus artigos são gerados cruzando legislação ativa nas APIs do governo federal.
              </p>
              <Link href="/" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                Conheça a tecnologia subjacente →
              </Link>
            </div>
          </div>
        </div>
      </article>
      
      {/* Footer Básico */}
      <footer className="py-8 border-t border-white/5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Judite IA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
