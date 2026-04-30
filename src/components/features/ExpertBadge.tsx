'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Zap } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

export function ExpertBadge() {
  const supabase = createClient();
  const { t } = useLocale();
  const [isExpert, setIsExpert] = useState(false);
  const [planType, setPlanType] = useState('free');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('expert_mode, plan_type')
        .eq('id', user.id)
        .single();
      if (data) {
        setIsExpert(data.expert_mode || false);
        setPlanType(data.plan_type || 'free');
      }
    };
    fetchProfile();

    // Listen for realtime changes to expert_mode
    const channel = supabase.channel('expert-badge')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles' 
      }, (payload) => {
        if (payload.new.expert_mode !== undefined) {
          setIsExpert(payload.new.expert_mode);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleToggle = async () => {
    if (planType === 'free') {
      setShowToast(t('dashboard.expertBadge.toastProOnly'));
      setTimeout(() => setShowToast(null), 3000);
      return;
    }

    if (!isExpert) {
      setShowConfirm(true);
      return;
    }

    // Desativar
    setToggling(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ expert_mode: false }).eq('id', user.id);
    setIsExpert(false);
    setToggling(false);
    setShowToast(t('dashboard.expertBadge.toastRestored'));
    setTimeout(() => setShowToast(null), 3000);
  };

  const confirmActivate = async () => {
    setShowConfirm(false);
    setToggling(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ expert_mode: true }).eq('id', user.id);
    setIsExpert(true);
    setToggling(false);
    setShowToast(t('dashboard.expertBadge.toastActivated'));
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <>
      {/* Badge Button */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={isExpert ? t('dashboard.expertBadge.titleActive') : t('dashboard.expertBadge.titleInactive')}
        className={`relative p-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 
          ${isExpert 
            ? 'bg-amber-500/20 border-amber-500/40 shadow-lg shadow-amber-500/20 hover:bg-amber-500/30' 
            : 'bg-slate-800/80 border-slate-700 hover:border-amber-500/30 hover:bg-slate-800'
          } ${toggling ? 'opacity-50' : ''}`}
      >
        <Zap className={`h-4 w-4 transition-colors duration-300 ${isExpert ? 'text-amber-400' : 'text-slate-400'}`} />
        {isExpert && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div 
            className="w-full max-w-sm rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl shadow-amber-500/10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('dashboard.expertBadge.modalTitle')}</h3>
                <p className="text-xs text-slate-400">{t('dashboard.expertBadge.modalSubtitle')}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-300">
                {t('dashboard.expertBadge.modalDesc1')}<strong className="text-amber-400">{t('dashboard.expertBadge.modalDescHighlight')}</strong>.
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 text-sm">⚠️</span>
                <p className="text-xs text-amber-300/90">
                  {t('dashboard.expertBadge.modalWarning')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-all"
              >
                {t('dashboard.expertBadge.btnCancel')}
              </button>
              <button
                onClick={confirmActivate}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98]"
              >
                {t('dashboard.expertBadge.btnActivate')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl text-sm font-medium text-white">
            {showToast}
          </div>
        </div>
      )}
    </>
  );
}
