'use client';

import { useState, useEffect } from 'react';

export function WelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Só mostra se nunca viu o modal
    const seen = localStorage.getItem('judite_welcome_seen');
    if (!seen) {
      // Pequeno delay para não atropelar o carregamento da página
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('judite_welcome_seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl shadow-indigo-500/10 animate-in zoom-in-95 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com gradiente */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-8 pb-10">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">⚖️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Bem-vindo à Judite</h2>
              <p className="text-sm text-indigo-200">Sua inteligência jurídica em dois cliques.</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 -mt-4 relative">
          {/* Card Dashboard */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 mb-3">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📂</span>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Painel</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Analise contratos, salve pareceres e acompanhe riscos. Tudo organizado na sua biblioteca.
                </p>
              </div>
            </div>
          </div>

          {/* Card Telegram */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📱</span>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Telegram</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tire dúvidas por áudio, envie documentos e consulte de qualquer lugar. 
                  Ela também acessa seus arquivos salvos no Painel.
                </p>
              </div>
            </div>
          </div>

          {/* Nota unificadora */}
          <p className="text-center text-xs text-slate-500 mb-5 italic">
            São a mesma Judite. Use o Painel para organizar, e o Telegram para agir rápido.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <a
              href="/dashboard/settings#telegram-link"
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold text-center transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
              Conectar meu Telegram →
            </a>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-400 hover:text-white hover:border-slate-600 transition-all"
            >
              Explorar o Painel primeiro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
