'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  History, 
  ShieldCheck, 
  LogOut,
  Moon,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface AdminSidebarProps {
  userName: string;
  userEmail: string;
}

const adminNavItems = [
  { href: '/admin', label: 'Estatísticas', icon: BarChart3 },
  { href: '/admin/social-approval', label: 'Cofre Social', icon: Sparkles },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/plans', label: 'Planos & Cotas', icon: Sparkles },
  { href: '/admin/usage', label: 'Consumo (Logs)', icon: History },
  { href: '/admin/config', label: 'Config. Globais', icon: ShieldCheck },
];

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile Trigger */}
      {!isOpen && (
        <div className="lg:hidden fixed top-6 left-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2.5 rounded-xl bg-indigo-600 border border-indigo-500 text-white shadow-xl shadow-indigo-500/20"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-indigo-500/10 bg-slate-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:shadow-none'}`}
      >
        {/* Brand/Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-indigo-500/10 h-[88px] shrink-0">
          <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-amber-500/20 border border-amber-500/30">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">Judite Admin</h2>
            <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">Painel Gestor</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
             <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 pb-2 px-4">
            <div className="h-px bg-slate-900 w-full mb-6" />
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Voltar à Pauta
            </Link>
          </div>
        </div>

        {/* User context */}
        <div className="p-4 border-t border-indigo-500/10 bg-slate-900/40">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
              </div>
           </div>
           <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 
              hover:bg-red-500/10 border border-red-500/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
}
