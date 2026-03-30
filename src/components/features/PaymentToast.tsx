'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Toast que aparece quando o usuário retorna do Stripe Checkout.
 * Lê ?payment=success ou ?payment=cancelled da URL.
 */
export function PaymentToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'success' | 'cancelled' | null>(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success' || payment === 'cancelled') {
      setType(payment);
      setShow(true);

      // Limpar a URL (remove ?payment=...)
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      router.replace(url.pathname, { scroll: false });

      // Auto-dismiss after 6s
      const timer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!show || !type) return null;

  const config = {
    success: {
      icon: CheckCircle,
      title: '🎉 Upgrade realizado com sucesso!',
      message: 'Bem-vindo ao plano Pro. Todas as funcionalidades premium estão ativas.',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400',
      iconColor: 'text-emerald-400',
    },
    cancelled: {
      icon: XCircle,
      title: 'Pagamento cancelado',
      message: 'Você pode tentar novamente a qualquer momento em Configurações.',
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
      iconColor: 'text-amber-400',
    },
  };

  const c = config[type];
  const Icon = c.icon;

  return (
    <div className={`fixed top-20 right-6 z-50 max-w-sm rounded-2xl border ${c.bg} p-4 shadow-2xl animate-in slide-in-from-right-5 duration-500`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 ${c.iconColor} shrink-0 mt-0.5`} />
        <div>
          <p className={`text-sm font-semibold ${c.text}`}>{c.title}</p>
          <p className="text-xs text-slate-400 mt-1">{c.message}</p>
        </div>
        <button 
          onClick={() => setShow(false)} 
          className="text-slate-600 hover:text-slate-400 text-lg leading-none ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
}
