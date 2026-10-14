'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { AccessProfile, UserRole, TabKey } from '@/lib/types';
import { TAB_LABELS } from '@/lib/user-presets';
import {
  Shield,
  Plus,
  Check,
  ShieldCheck,
  Lock,
  Edit2,
  Trash2,
  Sliders,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const ALL_TABS: TabKey[] = [
  'dashboard',
  'client-dashboard',
  'music-registration',
  'pipeline',
  'contacts',
  'expenses',
  'subscriptions',
  'users',
  'profiles',
  'deal-details',
  'reports',
  'settings',
];

export function ProfileManagementView() {
  const { accessProfiles, saveAccessProfile, deleteAccessProfile } = useCRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState<UserRole>('producer');
  const [allowedTabs, setAllowedTabs] = useState<TabKey[]>([
    'client-dashboard',
    'music-registration',
  ]);
  const [canEditDeals, setCanEditDeals] = useState(false);
  const [canDeleteDeals, setCanDeleteDeals] = useState(false);
  const [canExportReports, setCanExportReports] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canIssueIsrc, setCanIssueIsrc] = useState(true);
  const [canApproveRegistrations, setCanApproveRegistrations] = useState(true);
  const [canManageSettings, setCanManageSettings] = useState(false);

  const openCreateModal = () => {
    setEditingProfileId(null);
    setName('');
    setDescription('');
    setRole('producer');
    setAllowedTabs(['client-dashboard', 'music-registration']);
    setCanEditDeals(false);
    setCanDeleteDeals(false);
    setCanExportReports(false);
    setCanManageUsers(false);
    setCanIssueIsrc(true);
    setCanApproveRegistrations(true);
    setCanManageSettings(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prof: AccessProfile) => {
    setEditingProfileId(prof.id);
    setName(prof.name);
    setDescription(prof.description);
    setRole(prof.role);
    setAllowedTabs(prof.permissions.allowedTabs);
    setCanEditDeals(prof.permissions.canEditDeals);
    setCanDeleteDeals(prof.permissions.canDeleteDeals);
    setCanExportReports(prof.permissions.canExportReports);
    setCanManageUsers(prof.permissions.canManageUsers);
    setCanIssueIsrc(prof.permissions.canIssueIsrc);
    setCanApproveRegistrations(prof.permissions.canApproveRegistrations);
    setCanManageSettings(prof.permissions.canManageSettings);
    setIsModalOpen(true);
  };

  const toggleTab = (tab: TabKey) => {
    if (allowedTabs.includes(tab)) {
      if (allowedTabs.length <= 1) return;
      setAllowedTabs(allowedTabs.filter((t) => t !== tab));
    } else {
      setAllowedTabs([...allowedTabs, tab]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    saveAccessProfile({
      ...(editingProfileId ? { id: editingProfileId } : {}),
      name,
      description,
      role,
      permissions: {
        allowedTabs,
        canEditDeals,
        canDeleteDeals,
        canExportReports,
        canManageUsers,
        canIssueIsrc,
        canApproveRegistrations,
        canManageSettings,
      },
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Perfis de Acesso & Governança (RBAC)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {accessProfiles.length} perfis configurados
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configuração de políticas de segurança, abas autorizadas e privilégios operacionais
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Perfil de Acesso</span>
        </button>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accessProfiles.map((prof) => (
          <div
            key={prof.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{prof.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold uppercase">{prof.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(prof)}
                    className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition cursor-pointer"
                    title="Editar Permissões"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {accessProfiles.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Excluir o perfil ${prof.name}?`)) {
                          deleteAccessProfile(prof.id);
                        }
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition cursor-pointer"
                      title="Excluir Perfil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4">{prof.description}</p>

              {/* Allowed Tabs tags */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Abas Autorizadas ({prof.permissions?.allowedTabs?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(prof.permissions?.allowedTabs || []).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {TAB_LABELS[t] || t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Granular permissions indicators */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className={prof.permissions.canEditDeals ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    ●
                  </span>
                  <span>Editar Contratos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={prof.permissions.canIssueIsrc ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    ●
                  </span>
                  <span>Emitir ISRC / ECAD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={prof.permissions.canManageUsers ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    ●
                  </span>
                  <span>Gerenciar Usuários</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={prof.permissions.canManageSettings ? 'text-emerald-600 font-bold' : 'text-slate-300'}>
                    ●
                  </span>
                  <span>Configurações & Banco</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create/Edit Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  {editingProfileId ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Perfil *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Supervisor de Licenciamento"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Finalidade e responsabilidades deste perfil"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Papel Base</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente Comercial</option>
                  <option value="producer">Produtor Musical</option>
                  <option value="artist">Artista</option>
                </select>
              </div>

              {/* Tabs Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Abas Permitidas na Navegação
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {ALL_TABS.map((tab) => {
                    const isChecked = allowedTabs.includes(tab);
                    return (
                      <label
                        key={tab}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer transition ${
                          isChecked ? 'bg-indigo-50 font-bold text-indigo-900 border border-indigo-200' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTab(tab)}
                          className="rounded text-indigo-600"
                        />
                        <span>{TAB_LABELS[tab] || tab}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox Privileges */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={canEditDeals}
                    onChange={(e) => setCanEditDeals(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Permitir criar e editar negócios / contratos</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={canIssueIsrc}
                    onChange={(e) => setCanIssueIsrc(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Permitir emitir código ISRC e homologar no ECAD</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={canManageUsers}
                    onChange={(e) => setCanManageUsers(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Permitir gerenciar usuários e permissões</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={canManageSettings}
                    onChange={(e) => setCanManageSettings(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Permitir configurar banco Supabase e integrações</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Salvar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
