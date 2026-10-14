'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { SupabaseSettingsTab } from './SupabaseSettingsTab';
import { AppUser, AccessProfile, UserRole, TabKey, UserPermissions } from '@/lib/types';
import { ROLE_DEFINITIONS, TAB_LABELS, DEFAULT_ROLE_PERMISSIONS } from '@/lib/user-presets';
import {
  Settings,
  User,
  Users,
  Shield,
  Database,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Key,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

export function SettingsView() {
  const {
    currentUser,
    users,
    accessProfiles,
    saveUser,
    deleteUser,
    saveAccessProfile,
    deleteAccessProfile,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'profile' | 'users-profiles' | 'supabase'>('profile');
  const [subTab, setSubTab] = useState<'users' | 'profiles'>('users');

  // Search & filter
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modals state for Users CRUD
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<AppUser> | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Modals state for Profiles CRUD
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<AccessProfile> | null>(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<{ type: 'user' | 'profile'; id: string; name: string } | null>(null);

  // ---------------- USER CRUD HANDLERS ----------------
  const handleOpenNewUser = () => {
    setShowPassword(false);
    const defaultProfile = accessProfiles[0];
    setEditingUser({
      name: '',
      email: '',
      password: '',
      role: 'producer',
      profileId: defaultProfile?.id || 'profile-producer',
      permissions: defaultProfile?.permissions || DEFAULT_ROLE_PERMISSIONS.producer,
      active: true,
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: AppUser) => {
    setShowPassword(false);
    setEditingUser({ ...u });
    setIsUserModalOpen(true);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.name || !editingUser?.email) return;

    // Attach permissions matching the selected profile if not custom
    const matchedProfile = accessProfiles.find((p) => p.id === editingUser.profileId);
    const finalUser: Partial<AppUser> = {
      ...editingUser,
      permissions: matchedProfile?.permissions || editingUser.permissions || DEFAULT_ROLE_PERMISSIONS[editingUser.role as UserRole || 'producer'],
    };

    saveUser(finalUser);
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleUserStatus = (u: AppUser) => {
    saveUser({
      ...u,
      active: !u.active,
    });
  };

  // ---------------- PROFILE CRUD HANDLERS ----------------
  const handleOpenNewProfile = () => {
    setEditingProfile({
      name: '',
      description: '',
      role: 'producer',
      permissions: {
        allowedTabs: ['dashboard', 'music-registration'],
        canEditDeals: true,
        canDeleteDeals: false,
        canExportReports: false,
        canManageUsers: false,
        canIssueIsrc: true,
        canApproveRegistrations: false,
        canManageSettings: false,
      },
    });
    setIsProfileModalOpen(true);
  };

  const handleOpenEditProfile = (p: AccessProfile) => {
    setEditingProfile({ ...p });
    setIsProfileModalOpen(true);
  };

  const handleToggleProfileTab = (tab: TabKey) => {
    if (!editingProfile || !editingProfile.permissions) return;
    const currentTabs = editingProfile.permissions.allowedTabs || [];
    const exists = currentTabs.includes(tab);
    const updatedTabs = exists
      ? currentTabs.filter((t) => t !== tab)
      : [...currentTabs, tab];

    setEditingProfile({
      ...editingProfile,
      permissions: {
        ...editingProfile.permissions,
        allowedTabs: updatedTabs,
      },
    });
  };

  const handleToggleProfilePermission = (key: keyof UserPermissions) => {
    if (!editingProfile || !editingProfile.permissions) return;
    setEditingProfile({
      ...editingProfile,
      permissions: {
        ...editingProfile.permissions,
        [key]: !editingProfile.permissions[key],
      },
    });
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile?.name) return;

    saveAccessProfile(editingProfile);
    setIsProfileModalOpen(false);
    setEditingProfile(null);
  };

  // ---------------- DELETE EXECUTION ----------------
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    if (deleteConfirmId.type === 'user') {
      deleteUser(deleteConfirmId.id);
    } else {
      deleteAccessProfile(deleteConfirmId.id);
    }
    setDeleteConfirmId(null);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const ALL_TABS: TabKey[] = [
    'dashboard',
    'client-dashboard',
    'music-registration',
    'pipeline',
    'contacts',
    'expenses',
    'subscriptions',
    'reports',
    'users',
    'profiles',
    'settings',
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Configurações do Sistema
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gerenciamento de perfil, equipe de A&R, permissões de acesso e integrações
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition flex items-center gap-2 cursor-pointer border-b-2 shrink-0 ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Meu Perfil</span>
        </button>

        <button
          onClick={() => setActiveTab('users-profiles')}
          className={`pb-3 transition flex items-center gap-2 cursor-pointer border-b-2 shrink-0 ${
            activeTab === 'users-profiles'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuários & Perfis ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`pb-3 transition flex items-center gap-2 cursor-pointer border-b-2 shrink-0 ${
            activeTab === 'supabase'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Banco Supabase</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        {/* TAB 1: MEU PERFIL */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-base font-bold text-slate-900">Dados do Usuário Ativo</h2>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'AU'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-base">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">{currentUser?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                    {ROLE_DEFINITIONS[currentUser?.role]?.label || currentUser?.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {currentUser?.active ? 'Conta Ativa' : 'Conta Inativa'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Abas Permitidas no seu Perfil:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser?.permissions?.allowedTabs || []).map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
                  >
                    {TAB_LABELS[t] || t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USUÁRIOS & PERFIS (FULL CRUD IMPLEMENTED) */}
        {activeTab === 'users-profiles' && (
          <div className="space-y-6">
            {/* Sub-tabs header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSubTab('users')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    subTab === 'users'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Usuários ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('profiles')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    subTab === 'profiles'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Perfis de Acesso ({accessProfiles.length})
                </button>
              </div>

              {/* Action Buttons */}
              <div>
                {subTab === 'users' ? (
                  <button
                    onClick={handleOpenNewUser}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Novo Usuário</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenNewProfile}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Novo Perfil</span>
                  </button>
                )}
              </div>
            </div>

            {/* SUB-VIEW 1: USERS LIST & CRUD */}
            {subTab === 'users' && (
              <div className="space-y-4">
                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou e-mail..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-hidden"
                    >
                      <option value="all">Todos os Papéis</option>
                      <option value="admin">Administrador</option>
                      <option value="manager">Gerente Comercial</option>
                      <option value="producer">Produtor Musical</option>
                      <option value="artist">Artista / Compositor</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Usuário</th>
                        <th className="px-4 py-3">Papel & Perfil</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => {
                        const profileObj = accessProfiles.find((p) => p.id === u.profileId);
                        const isCurrent = u.id === currentUser?.id;
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                                  {u.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{u.name}</span>
                                    {isCurrent && (
                                      <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded font-semibold">
                                        Você
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[11px] text-slate-400">{u.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${ROLE_DEFINITIONS[u.role]?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                                  {ROLE_DEFINITIONS[u.role]?.label || u.role}
                                </span>
                                {profileObj && (
                                  <span className="text-[10px] text-slate-500">
                                    Perfil: <strong className="text-slate-700">{profileObj.name}</strong>
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                                  u.active
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                <span>{u.active ? 'Ativo' : 'Inativo'}</span>
                              </button>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  title="Editar Usuário"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId({ type: 'user', id: u.id, name: u.name })}
                                  disabled={isCurrent}
                                  title={isCurrent ? 'Você não pode excluir sua própria conta' : 'Excluir Usuário'}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: ACCESS PROFILES LIST & CRUD */}
            {subTab === 'profiles' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accessProfiles.map((prof) => (
                    <div
                      key={prof.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-indigo-300 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-sm text-slate-900">{prof.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${ROLE_DEFINITIONS[prof.role]?.badgeColor || 'bg-slate-100'}`}>
                            {ROLE_DEFINITIONS[prof.role]?.label || prof.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{prof.description}</p>

                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Abas Permitidas ({prof.permissions?.allowedTabs?.length || 0}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(prof.permissions?.allowedTabs || []).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 font-medium"
                              >
                                {TAB_LABELS[t] || t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-200/60">
                          {prof.permissions?.canIssueIsrc && (
                            <span className="flex items-center gap-1 text-indigo-700 font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-indigo-600" /> Emissão ISRC
                            </span>
                          )}
                          {prof.permissions?.canManageUsers && (
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Gestão Usuários
                            </span>
                          )}
                          {prof.permissions?.canExportReports && (
                            <span className="flex items-center gap-1 text-purple-700 font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-purple-600" /> Exportação Relatórios
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProfile(prof)}
                          className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl border border-slate-200 hover:border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar Permissões</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId({ type: 'profile', id: prof.id, name: prof.name })}
                          title="Excluir Perfil"
                          className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl border border-slate-200 hover:border-red-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BANCO SUPABASE */}
        {activeTab === 'supabase' && <SupabaseSettingsTab />}
      </div>

      {/* ---------------- MODAL USER FORM (CREATE & EDIT) ---------------- */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingUser.id ? 'Editar Usuário' : 'Novo Usuário do Aura Hub'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingUser.id ? 'Atualize as permissões e dados' : 'Cadastre um novo membro da equipe ou artista'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Santana"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Cadastrado *</label>
                <input
                  type="email"
                  required
                  placeholder="carlos@exemplo.com"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Senha de Acesso *</label>
                  {editingUser.id === currentUser?.id ? (
                    <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                      Sua conta ativa (Visualização liberada)
                    </span>
                  ) : editingUser.id ? (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Oculta por segurança
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={editingUser.id === currentUser?.id && showPassword ? 'text' : 'password'}
                    required
                    placeholder={
                      editingUser.id === currentUser?.id
                        ? 'Digite sua senha'
                        : editingUser.id
                        ? '•••••••• (Digite apenas se desejar redefinir)'
                        : 'Defina a senha de acesso'
                    }
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  {/* Botão de visualização: habilitado para o próprio usuário, desabilitado para outros */}
                  {editingUser.id === currentUser?.id ? (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="Visualização desabilitada para outros usuários por segurança"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 opacity-40 cursor-not-allowed p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {editingUser.id !== currentUser?.id && editingUser.id && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Por segurança, a senha de outros usuários nunca é revelada. Digite uma nova senha caso queira redefini-la.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Papel / Função *</label>
                  <select
                    value={editingUser.role || 'producer'}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setEditingUser({ ...editingUser, role: newRole });
                    }}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente Comercial</option>
                    <option value="producer">Produtor Musical</option>
                    <option value="artist">Artista / Compositor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Acesso *</label>
                  <select
                    value={editingUser.profileId || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, profileId: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {accessProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="userActiveCheck"
                  checked={editingUser.active !== false}
                  onChange={(e) => setEditingUser({ ...editingUser, active: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
                <label htmlFor="userActiveCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Usuário Ativo (Pode fazer login no Aura CRM)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Usuário</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL PROFILE FORM (CREATE & EDIT) ---------------- */}
      {isProfileModalOpen && editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingProfile.id ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}
                  </h2>
                  <p className="text-xs text-slate-500">Defina abas liberadas e permissões granulares</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Perfil *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: A&R Master / Supervisor"
                  value={editingProfile.name || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Descreva as responsabilidades desse perfil"
                  value={editingProfile.description || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Papel Base</label>
                <select
                  value={editingProfile.role || 'producer'}
                  onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente Comercial</option>
                  <option value="producer">Produtor Musical</option>
                  <option value="artist">Artista / Compositor</option>
                </select>
              </div>

              {/* Allowed Tabs Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Abas com Acesso Liberado no Menu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {ALL_TABS.map((tab) => {
                    const isChecked = editingProfile.permissions?.allowedTabs?.includes(tab);
                    return (
                      <label
                        key={tab}
                        className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer p-1.5 hover:bg-white rounded-lg transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleProfileTab(tab)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span>{TAB_LABELS[tab] || tab}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Granular Permissions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Permissões de Ação Granulares
                </label>
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProfile.permissions?.canIssueIsrc)}
                      onChange={() => handleToggleProfilePermission('canIssueIsrc')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Emitir Códigos ISRC com Homologação ECAD</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProfile.permissions?.canManageUsers)}
                      onChange={() => handleToggleProfilePermission('canManageUsers')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Gerenciar Usuários e Permissões</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProfile.permissions?.canExportReports)}
                      onChange={() => handleToggleProfilePermission('canExportReports')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Exportar Relatórios Financeiros e Métricas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProfile.permissions?.canDeleteDeals)}
                      onChange={() => handleToggleProfilePermission('canDeleteDeals')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Excluir Negócios do Pipeline</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- CONFIRM DELETE MODAL ---------------- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Confirmar Exclusão</h3>
            <p className="text-xs text-slate-500 mb-6">
              Tem certeza que deseja excluir{' '}
              <strong className="text-slate-800">{deleteConfirmId.name}</strong>? Esta ação removerá o registro do sistema e do banco de dados Supabase.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
