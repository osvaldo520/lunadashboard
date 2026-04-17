import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div 
      className={`prose prose-invert max-w-none 
      prose-p:text-slate-300 prose-p:leading-relaxed
      prose-headings:text-white prose-headings:font-bold
      prose-h1:text-4xl prose-h1:mb-8
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
      prose-h3:text-xl prose-h3:mt-8
      prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-white prose-strong:font-semibold
      prose-ul:text-slate-300 prose-li:marker:text-indigo-500
      prose-table:w-full prose-table:border-collapse 
      prose-th:bg-slate-800/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-white 
      prose-td:border-t prose-td:border-slate-800 prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-slate-300
      prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-800/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:text-slate-400 prose-blockquote:not-italic
      prose-img:rounded-2xl prose-img:border prose-img:border-slate-800
      ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
