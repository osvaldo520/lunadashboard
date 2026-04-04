'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Settings, 
  LogOut,
  Moon,
  ChevronRight,
  Sparkles,
  Loader2,
  Menu,
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  userName: string;
  userEmail: string;
  userPlan: string;
}

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/dashboard/documents', label: 'Documentos', icon: FileText },
  { href: '/dashboard/upload', label: 'Upload', icon: Upload },
  { href: '/guide', label: 'Guia de Uso', icon: BookOpen },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

const planLabels: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const planColors: Record<string, string> = {
  free: 'bg-slate-700 text-slate-300',
  pro: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30',
  enterprise: 'bg-amber-600/20 text-amber-400 border border-amber-500/30',
};

export function Sidebar({ userName, userEmail, userPlan }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fecha o menu Mobile sempre que navegar para outra rota
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        method: 'POST',
      });
      
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Falha ao abrir o checkout", error);
      setIsUpgrading(false);
    }
  };

  return (
    <>
      {/* Botão Mobile Hamburger (Flutuante na Esquerda Superior) */}
      {!isOpen && (
        <div className="lg:hidden fixed top-6 left-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2.5 rounded-xl bg-slate-800/80 backdrop-blur border border-slate-700 text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Fundo escuro Mobile (Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Container Principal da Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-800 bg-slate-900/95 lg:bg-slate-900/50 backdrop-blur-md transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl shadow-indigo-500/10' : '-translate-x-full lg:shadow-none'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800 h-[88px] shrink-0">
          <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
            <span className="text-xl">⚖️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">Judite</h2>
            <p className="text-xs text-slate-500 truncate">Pauta</p>
          </div>
          {/* Botão Fechar Interno (Mobile) */}
          <button 
             onClick={() => setIsOpen(false)} 
             className="lg:hidden p-2 -mr-2 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
             <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? '' : 'group-hover:text-indigo-400 transition-colors'}`} />
                  {item.label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto animate-in slide-in-from-left-2 opacity-100" />}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade CTA for Free Users */}
          {(!userPlan || userPlan === 'free') && (
            <div className="px-4 pb-4 mt-2">
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2 relative z-10">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Evolua para o Pro
                </h3>
                <p className="text-xs text-slate-400 mb-3 relative z-10">
                  Análises e gerações ilimitadas com a Judite.
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 relative z-10 active:scale-[0.98]"
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    'Assinar agora'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User section (Bottom Pinned) */}
        <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-900/80">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="flex justify-center items-center w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold border border-white/5 shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate pr-1">{userName}</p>
              <p className="text-xs text-slate-500 truncate pr-1">{userEmail}</p>
            </div>
            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${planColors[userPlan] || planColors.free}`}>
              {planLabels[userPlan] || 'Free'}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-400 
              border border-transparent hover:border-red-500/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 active:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Sair e Deslogar
          </button>
        </div>
      </aside>
    </>
  );
}

