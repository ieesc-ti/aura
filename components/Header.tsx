'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { ROLE_DEFINITIONS } from '@/lib/user-presets';
import {
  Search,
  Plus,
  Sparkles,
  Menu,
  ChevronDown,
  Shield,
  LogIn,
  Users,
  LogOut,
  Music2,
  FileCheck2,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const {
    currentUser,
    users,
    switchUser,
    setIsSearchOpen,
    setIsNewDealModalOpen,
    setIsAiDrawerOpen,
    setIsLoginModalOpen,
    setIsUserManagementOpen,
    goToLandingPage,
    setActiveTab,
  } = useCRM();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between min-w-[320px] max-w-full gap-2 overflow-hidden">
      {/* Left: Mobile trigger & Search bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl text-xs sm:text-sm border border-slate-200 transition text-left cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Buscar músicas, contratos, artistas, ISRC...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-white border border-slate-300 px-1.5 py-0.5 rounded-md text-slate-500 font-mono shadow-xs shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, AI Copilot & User Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Supabase Connection Status Pill */}
        <button
          onClick={() => setActiveTab('settings')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
          title="Ver status do Banco Supabase"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Supabase Ativo</span>
        </button>

        {/* Quick Music Register CTA - desktop only */}
        <button
          onClick={() => setActiveTab('music-registration')}
          className="hidden xl:flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Music2 className="w-3.5 h-3.5 text-purple-600" />
          <span>Emitir ISRC</span>
        </button>

        {/* AI Copilot Drawer Trigger - hidden on mobile */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>IA Comercial</span>
        </button>

        {/* New Deal Modal Trigger - hidden on mobile */}
        <button
          onClick={() => setIsNewDealModalOpen(true)}
          className="hidden md:flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Negócio</span>
        </button>

        {/* User Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'SO'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser?.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <>
              <div
                onClick={() => setUserDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Simular Acesso como:
                  </p>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {users.map((u) => {
                    const isCurrent = u.id === currentUser?.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 text-xs transition cursor-pointer ${
                          isCurrent ? 'bg-indigo-50/60 font-bold text-indigo-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {ROLE_DEFINITIONS[u.role]?.label || u.role}
                          </p>
                        </div>
                        {isCurrent && <span className="text-indigo-600 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Quick Actions (hidden on desktop where top buttons exist) */}
                <div className="border-t border-slate-100 pt-1 mt-1 md:hidden">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsNewDealModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Novo Negócio</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsAiDrawerOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-purple-600 hover:bg-purple-50 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>IA Comercial Aura</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('music-registration');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Music2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Emitir ISRC / Registro</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('settings');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Gerenciar Usuários & Perfis</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      goToLandingPage();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair para Portal Público</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
