'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { AppUser, UserRole } from '@/lib/types';
import { ROLE_DEFINITIONS, DEFAULT_ROLE_PERMISSIONS } from '@/lib/user-presets';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User,
  Shield,
} from 'lucide-react';

export function UsersManagementView() {
  const { users, saveUser, deleteUser, accessProfiles, currentUser } = useCRM();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('producer');
  const [profileId, setProfileId] = useState('profile-producer');
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setRole('producer');
    setProfileId('profile-producer');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AppUser) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setProfileId(user.profileId);
    setActive(user.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    saveUser({
      ...(editingUserId ? { id: editingUserId } : {}),
      name,
      email,
      role,
      profileId,
      permissions: DEFAULT_ROLE_PERMISSIONS[role],
      active,
    });

    setIsModalOpen(false);
  };

  const filteredUsers = (users || []).filter((u) => {
    const s = (search || '').toLowerCase().trim();
    const matchesSearch =
      !s ||
      (u.name || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cadastro & Gestão de Usuários
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredUsers.length} usuários
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administração de operadores, produtores, gerentes A&R e contas de artistas parceiros
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total de Contas</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Cadastrados no sistema</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Usuários Ativos</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {users.filter((u) => u.active).length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Com login habilitado</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Administradores</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {users.filter((u) => u.role === 'admin').length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Controle total irrestrito</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Artistas & Selos</span>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {users.filter((u) => u.role === 'artist' || u.role === 'producer').length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Clientes e criadores</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
        >
          <option value="all">Todos os Papéis</option>
          <option value="admin">Administrador</option>
          <option value="manager">Gerente Comercial</option>
          <option value="producer">Produtor Musical</option>
          <option value="artist">Artista</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Membro / Usuário</th>
                <th className="px-5 py-3">Papel & Nível</th>
                <th className="px-5 py-3">Perfil RBAC</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const profile = accessProfiles.find((p) => p.id === u.profileId);
                const roleDef = ROLE_DEFINITIONS[u.role] || { label: u.role, badgeColor: 'bg-slate-100 text-slate-700' };

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleDef.badgeColor}`}>
                        {roleDef.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{profile?.name || 'Padrão'}</p>
                      <p className="text-[10px] text-slate-400">
                        {(u.permissions?.allowedTabs || []).length} abas autorizadas
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {u.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition cursor-pointer"
                          title="Editar Usuário"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {users.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente remover o usuário ${u.name}?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition cursor-pointer"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro / Edição de Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  {editingUserId ? 'Editar Usuário' : 'Novo Usuário do Aura Hub'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Profissional *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@sonora.com.br"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Papel</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setRole(r);
                      setProfileId(`profile-${r}`);
                    }}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente Comercial</option>
                    <option value="producer">Produtor Musical</option>
                    <option value="artist">Artista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfil RBAC</label>
                  <select
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    {accessProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="userActiveCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md border-slate-300"
                />
                <label htmlFor="userActiveCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Usuário Ativo (Pode acessar a plataforma)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingUserId ? 'Salvar Alterações' : 'Concluir Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
