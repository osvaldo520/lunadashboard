'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep {
  id: string;
  label: string;
  href: string;
  done: boolean;
}

export function OnboardingChecklist() {
  const supabase = createClient();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    const check = async () => {
      // Já dispensou?
      if (localStorage.getItem('judite_onboarding_done')) {
        setDismissed(true);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Checar Telegram vinculado
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', user.id)
        .single();

      const hasTelegram = !!profile?.telegram_id;

      // Checar se tem pelo menos 1 documento
      const { count } = await supabase
        .from('documents')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const hasDocument = (count || 0) > 0;

      const newSteps: OnboardingStep[] = [
        { id: 'telegram', label: 'Vincule seu Telegram', href: '/dashboard/settings#telegram-link', done: hasTelegram },
        { id: 'document', label: 'Envie seu primeiro documento', href: '/dashboard/upload', done: hasDocument },
      ];

      setSteps(newSteps);
      
      // Se tudo feito, mostrar toast e auto-dispensar
      if (newSteps.every(s => s.done)) {
        setAllDone(true);
        setTimeout(() => {
          localStorage.setItem('judite_onboarding_done', 'true');
          setDismissed(true);
        }, 3000);
      }

      setLoading(false);
    };

    check();

    // Re-check quando volta de outra aba/página
    const handleFocus = () => check();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (loading || dismissed) return null;

  const completedCount = steps.filter(s => s.done).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 animate-in slide-in-from-bottom-4 duration-500">
      <div className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-500 ${
        allDone 
          ? 'border-emerald-500/30 bg-emerald-900/90 shadow-emerald-500/10' 
          : 'border-slate-700/50 bg-slate-900/95 shadow-indigo-500/5'
      }`}>
        {allDone ? (
          /* Estado de sucesso */
          <div className="text-center py-2">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-emerald-300">Tudo pronto!</p>
            <p className="text-xs text-emerald-400/70 mt-1">A Judite está 100% configurada.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Primeiros Passos</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{completedCount}/{steps.length} concluídos</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.setItem('judite_onboarding_done', 'true');
                  setDismissed(true);
                }}
                className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
                title="Dispensar"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              {steps.map((step) => (
                <Link
                  key={step.id}
                  href={step.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all group ${
                    step.done 
                      ? 'text-slate-500 line-through cursor-default' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {step.done 
                    ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> 
                    : <Circle className="h-4 w-4 text-slate-600 shrink-0" />
                  }
                  <span className="flex-1">{step.label}</span>
                  {!step.done && (
                    <ArrowRight className="h-3 w-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
