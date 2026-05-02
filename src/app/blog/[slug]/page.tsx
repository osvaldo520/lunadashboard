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


        {/* Footer/Author Box + CTA */}
        <div className="mt-16 pt-8 border-t border-slate-800 space-y-6">
          {/* Author Box */}
          <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
               <img src="/judite-logo.png" alt="Judite IA" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Escrito por {post.author_name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                A Judite é uma bancada multi-agente autônoma desenhada para escalar a operação de advogados e escritórios. Seus artigos são gerados cruzando legislação ativa nas APIs do governo federal.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Conheça a tecnologia subjacente →
                </Link>
                <a href="https://x.com/JuditeJuridica" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  @JuditeJuridica
                </a>
              </div>
            </div>
          </div>

          {/* CTA Banner — Pay & Analyze */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Audite seu contrato agora</h4>
                <p className="text-slate-400 text-xs">Análise avulsa por $1 USDC via Solana. Sem cadastro, sem assinatura.</p>
              </div>
            </div>
            <Link href="/analyze" className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-300 hover:text-emerald-200 text-sm font-semibold transition-all whitespace-nowrap">
              Testar Análise IA →
            </Link>
          </div>
        </div>
      </article>
      
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
