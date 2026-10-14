'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { TabKey } from '@/lib/types';
import {
  LayoutDashboard,
  Kanban,
  Users,
  CircleDollarSign,
  BarChart3,
  Settings,
  Globe,
  Receipt,
  CreditCard,
  Music2,
  Disc3,
  ShieldCheck,
  Shield,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { activeTab, setActiveTab, deals, currentUser, goToLandingPage } = useCRM();
  const isClientUser = currentUser?.role === 'artist';

  const navItems: { key: TabKey; label: string; icon: any; badge?: string | number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'client-dashboard', label: 'Portal do Artista', icon: Disc3 },
    { key: 'music-registration', label: 'Registro de Música', icon: Music2 },
    { key: 'pipeline', label: 'Pipeline de Vendas', icon: Kanban, badge: deals.length },
    { key: 'contacts', label: 'Contatos & Clientes', icon: Users },
    { key: 'expenses', label: 'Despesas', icon: Receipt },
    { key: 'subscriptions', label: 'Planos & Assinaturas', icon: CreditCard },
    { key: 'users', label: 'Usuários & Equipe', icon: ShieldCheck },
    { key: 'profiles', label: 'Perfis de Acesso', icon: Shield },
    { key: 'landing-admin', label: 'Gestão da Landing Page', icon: Globe },
    { key: 'reports', label: 'Relatórios & Métricas', icon: BarChart3 },
    { key: 'settings', label: 'Configurações', icon: Settings },
  ];

  const allowedItems = navItems.filter((item) =>
    currentUser?.permissions?.allowedTabs?.includes(item.key) ||
    ((currentUser?.role === 'admin' || currentUser?.role === 'manager') && item.key === 'landing-admin')
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Frame */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-200 z-50 flex flex-col border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">Aura</span>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block -mt-1">
                Music CRM
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isClientUser ? 'Menu Artista' : 'Navegação'}
          </div>

          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              goToLandingPage();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700/60 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Página Pública Aura</span>
          </button>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                {currentUser.role.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
