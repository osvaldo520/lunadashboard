'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Settings, 
  LogOut,
  Moon,
  ChevronRight,
  Sparkles,
  Loader2
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
    <aside className="flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
          <Moon className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Luna</h2>
          <p className="text-xs text-slate-500">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA for Free Users */}
      {(!userPlan || userPlan === 'free') && (
        <div className="px-4 pb-4">
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Evolua para o Pro
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Análises e gerações ilimitadas com a Luna.
            </p>
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
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

      {/* User section */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${planColors[userPlan] || planColors.free}`}>
            {planLabels[userPlan] || 'Free'}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 
            hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
