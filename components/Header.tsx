'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { ROLE_DEFINITIONS } from '@/lib/user-presets';
import {
  Search,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
  Users,
  Globe,
  UserCheck,
  ChevronRight,
  Shield,
  Layers,
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
    setActiveTab,
    logout,
  } = useCRM();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);

  const handleNavigate = (tab: any) => {
    setActiveTab(tab);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
  };

  const currentRoleInfo = currentUser ? ROLE_DEFINITIONS[currentUser.role] : null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between min-w-[320px] max-w-full gap-2">
      {/* Left: Mobile trigger & Search bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
          aria-label="Abrir menu lateral"
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

      {/* Right: User Profile & Actions Dropdown (Clean, without Supabase, IA Comercial, Novo Negócio) */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* User Profile Trigger */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer group"
            title="Menu do Usuário"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'SO'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition truncate max-w-[140px]">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate capitalize font-medium">
                {currentRoleInfo?.label || currentUser?.role}
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {userDropdownOpen && (
            <>
              <div
                onClick={() => {
                  setUserDropdownOpen(false);
                  setShowSwitchUser(false);
                }}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Header: User Information */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {currentUser?.name?.slice(0, 2).toUpperCase() || 'SO'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser?.email || 'usuario@aurasonora.com'}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${currentRoleInfo?.badgeColor || 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                        {currentRoleInfo?.label || currentUser?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Navigation / Settings Options */}
                <div className="py-1.5 border-b border-slate-100">
                  {/* Configurações */}
                  <button
                    onClick={() => handleNavigate('settings')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition cursor-pointer font-medium"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Configurações</p>
                      <p className="text-[10px] text-slate-400">Preferências, perfil e sistema</p>
                    </div>
                  </button>

                  {/* Usuários & Equipe */}
                  <button
                    onClick={() => handleNavigate('users')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition cursor-pointer font-medium"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Usuários & Perfis</p>
                      <p className="text-[10px] text-slate-400">Gestão de equipe e permissões</p>
                    </div>
                  </button>

                  {/* Gestão da Landing Page */}
                  <button
                    onClick={() => handleNavigate('landing-admin')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition cursor-pointer font-medium"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">Gestão da Landing Page</p>
                      <p className="text-[10px] text-slate-400">Edição de planos, textos e FAQs</p>
                    </div>
                  </button>
                </div>

                {/* Switch User / Simulation Option */}
                <div className="py-1 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSwitchUser(!showSwitchUser)}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-700">Simular Outro Usuário</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showSwitchUser ? 'rotate-90' : ''}`} />
                  </button>

                  {showSwitchUser && (
                    <div className="max-h-48 overflow-y-auto px-2 py-1 bg-slate-50/60 rounded-xl mx-2 my-1 border border-slate-100 divide-y divide-slate-100/60">
                      {users.map((u) => {
                        const isCurrent = u.id === currentUser?.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setUserDropdownOpen(false);
                              setShowSwitchUser(false);
                            }}
                            className={`w-full px-2.5 py-2 text-left flex items-center gap-2 hover:bg-white rounded-lg text-xs transition cursor-pointer ${
                              isCurrent ? 'bg-white font-bold text-indigo-900 shadow-xs' : 'text-slate-700'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium text-xs leading-none">{u.name}</p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {ROLE_DEFINITIONS[u.role]?.label || u.role}
                              </p>
                            </div>
                            {isCurrent && <span className="text-indigo-600 text-xs font-bold shrink-0">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Logout Option */}
                <div className="pt-1 px-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition cursor-pointer font-semibold group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 flex items-center justify-center shrink-0 transition">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-rose-600">Deslogar</p>
                      <p className="text-[10px] text-rose-400">Encerrar sessão e voltar ao início</p>
                    </div>
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
