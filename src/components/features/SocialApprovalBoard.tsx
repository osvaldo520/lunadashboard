'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, X, Twitter, MessageSquare, Linkedin, ExternalLink, Send, Loader2, Facebook, Instagram } from 'lucide-react';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface SocialDraft {
  id: string;
  source_platform: string;
  target_platform: string;
  source_context?: string;
  topic_intent: string;
  suggested_reply_md: string;
  status: string;
  published_url?: string;
  media_url?: string;
  created_at: string;
  viral_score?: number | null;
  compliance_score?: number | null;
  audit_justification?: string | null;
}

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="w-4 h-4 text-sky-400" />,
  reddit: <MessageSquare className="w-4 h-4 text-orange-500" />,
  linkedin: <Linkedin className="w-4 h-4 text-blue-500" />,
  facebook: <Facebook className="w-4 h-4 text-blue-400" />,
  instagram: <Instagram className="w-4 h-4 text-pink-500" />,
  organic: <SparklesIcon />
};

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

export function SocialApprovalBoard({ initialDrafts }: { initialDrafts: SocialDraft[] }) {
  const [drafts, setDrafts] = useState<SocialDraft[]>(initialDrafts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleAction = async (id: string, newStatus: 'approved' | 'declined') => {
    setLoadingId(id);
    const { error } = await supabase
      .from('social_drafts')
      .update({ status: newStatus })
      .eq('id', id);

    setLoadingId(null);

    if (!error) {
      if (newStatus === 'declined') {
        setDrafts((prev) => prev.filter(draft => draft.id !== id));
      } else {
        // Mantém na lista com o novo status para exibir botão Publicar
        setDrafts((prev) => prev.map(draft => 
          draft.id === id ? { ...draft, status: newStatus } : draft
        ));
      }
    } else {
      console.error(error);
      alert('Houve um erro ao atualizar o status.');
    }
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    setPublishMessage(null);

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_id: id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPublishMessage(`✅ ${data.message}`);
        setDrafts((prev) => prev.filter(draft => draft.id !== id));
      } else {
        setPublishMessage(`❌ ${data.error || 'Falha ao publicar. Leia o console.'}`);
        // Revert to approved status on failure
        setDrafts((prev) => prev.map(draft =>
          draft.id === id ? { ...draft, status: 'approved' } : draft
        ));
      }
    } catch (error) {
      setPublishMessage(`❌ Erro de conexão: ${error}`);
    } finally {
      setPublishingId(null);
      // Limpar mensagem após 5 segundos
      setTimeout(() => setPublishMessage(null), 5000);
    }
  };

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-indigo-500/20 rounded-2xl bg-indigo-500/5">
        <SparklesIcon />
        <h3 className="mt-4 text-lg font-semibold text-white">Nenhum Rascunho Pendente</h3>
        <p className="mt-2 text-sm text-slate-400">
          A Judite não encontrou pautas quentes novas ou já esvaziou a fila de hoje.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Publish feedback toast */}
      {publishMessage && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white shadow-2xl animate-in fade-in slide-in-from-top-2">
          {publishMessage}
        </div>
      )}

      {drafts.map((draft) => (
        <div key={draft.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-300 bg-slate-800 px-3 py-1 rounded-full">
                {platformIcons[draft.target_platform.toLowerCase()] || <SparklesIcon />}
                {draft.target_platform}
              </span>
              {draft.status === 'approved' && (
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  ✅ Aprovado
                </span>
              )}
              {draft.compliance_score !== null && draft.compliance_score !== undefined && (
                <span 
                  title={draft.audit_justification || "Auditado pelo Tribunal de Ética"}
                  className={`cursor-help text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full ${
                    draft.compliance_score >= 80 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  🛡️ OAB: {draft.compliance_score}
                </span>
              )}
              {draft.viral_score !== null && draft.viral_score !== undefined && (
                <span className={`text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full ${
                  draft.viral_score >= 70 ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 bg-slate-500/10'
                }`}>
                  🔥 Viral: {draft.viral_score}
                </span>
              )}
              <span className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs block">
                {draft.topic_intent}
              </span>
            </div>
            <div className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
              Captado em: {new Date(draft.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Original Context */}
          {draft.source_context && (
             <div className="mb-4 bg-slate-950 p-4 rounded-xl border border-slate-800/50">
               <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Contexto Legal / Notícia Original</div>
                <div className="text-sm text-indigo-400 break-words">
                  {draft.source_context.startsWith('http') ? (
                    <a href={draft.source_context} target="_blank" rel="noreferrer" className="hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                      Acessar Fonte Base <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : draft.source_context}
                </div>
             </div>
          )}

          {/* Media Preview */}
          {draft.media_url && (
            <div className="mb-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img 
                src={draft.media_url} 
                alt="Mídia gerada pela IA" 
                className="w-full max-h-80 object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="px-3 py-1.5 text-xs text-slate-500 bg-slate-950">
                🖼️ Imagem gerada automaticamente pela IA (OpenRouter/GPT-5)
              </div>
            </div>
          )}

          {/* Proposed Content */}
          <div className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-950/50 p-4 rounded-xl prose-invert max-w-none">
             <MarkdownRenderer content={draft.suggested_reply_md.replace(/\\n/g, '\n')} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4">
            {draft.status === 'pending' ? (
              <>
                <button
                  onClick={() => handleAction(draft.id, 'declined')}
                  disabled={loadingId === draft.id}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors disabled:opacity-50"
                  title="Descartar"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleAction(draft.id, 'approved')}
                  disabled={loadingId === draft.id}
                  className="flex items-center gap-2 px-6 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  <span>Aprovar</span>
                </button>
              </>
            ) : draft.status === 'approved' ? (
              <>
                <button
                  onClick={() => handleAction(draft.id, 'declined')}
                  disabled={publishingId === draft.id}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors disabled:opacity-50"
                  title="Revogar Aprovação"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePublish(draft.id)}
                  disabled={publishingId === draft.id}
                  className="flex items-center gap-2 px-6 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50"
                >
                  {publishingId === draft.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Publicar nas Redes</span>
                    </>
                  )}
                </button>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
