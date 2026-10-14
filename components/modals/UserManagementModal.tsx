import React, { useState, useEffect } from 'react';
import { AppUser, UserRole, TabKey, UserPermissions } from '@/lib/types';
import { useCRM } from '@/lib/crm-context';
import { X, Shield, Check, Eye, EyeOff, Users, Layers, KeyRound, Cloud, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { DEFAULT_ROLE_PERMISSIONS, ROLE_DEFINITIONS, TAB_LABELS } from '@/lib/user-presets';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: AppUser | null;
}

export function UserManagementModal({ isOpen, onClose, userToEdit }: UserManagementModalProps) {
  const { addUserWithSync, updateUserWithSync, accessProfiles, isSupabaseConfigured, supabaseSyncStatus } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('profile-seller');
  const [role, setRole] = useState<UserRole>('seller');
  const [roleTitle, setRoleTitle] = useState('Executivo de Vendas');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  
  // Custom permissions
  const [customPermissions, setCustomPermissions] = useState<UserPermissions>({
    ...DEFAULT_ROLE_PERMISSIONS.seller,
  });
  const [customizePermissions, setCustomizePermissions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [supabaseNotice, setSupabaseNotice] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setPassword(userToEdit.password || '123456');
      setRole((userToEdit.role as UserRole) || 'seller');
      setSelectedProfileId(userToEdit.profileId || (userToEdit.role === 'admin' ? 'profile-admin' : userToEdit.role === 'manager' ? 'profile-manager' : userToEdit.role === 'viewer' ? 'profile-viewer' : 'profile-seller'));
      setRoleTitle(userToEdit.roleTitle);
      setStatus(userToEdit.status);
      setCustomPermissions({ ...userToEdit.permissions });
      setCustomizePermissions(true);
    } else {
      setName('');
      setEmail('');
      setPassword('123456');
      const defaultProf = accessProfiles.find((p) => p.id === 'profile-seller') || accessProfiles[0];
      setSelectedProfileId(defaultProf?.id || 'profile-seller');
      setRole((defaultProf?.roleKey as UserRole) || 'seller');
      setRoleTitle(defaultProf?.name?.split(' / ')[0] || 'Executivo de Vendas');
      setStatus('Ativo');
      setCustomPermissions(defaultProf ? { ...defaultProf.permissions } : { ...DEFAULT_ROLE_PERMISSIONS.seller });
      setCustomizePermissions(false);
    }
    setErrorMessage('');
  }, [userToEdit, isOpen, accessProfiles]);

  if (!isOpen) return null;

  const handleProfileSelect = (profId: string) => {
    setSelectedProfileId(profId);
    const prof = accessProfiles.find((p) => p.id === profId);
    if (prof) {
      const rKey = (prof.roleKey as UserRole) || 'seller';
      setRole(rKey);
      setRoleTitle(prof.name.split(' / ')[0]);
      if (!customizePermissions) {
        setCustomPermissions({ ...prof.permissions });
      }
    }
  };

  const toggleTabPermission = (tabKey: TabKey) => {
    setCustomPermissions((prev) => {
      const exists = prev.allowedTabs.includes(tabKey);
      const newTabs = exists
        ? prev.allowedTabs.filter((t) => t !== tabKey)
        : [...prev.allowedTabs, tabKey];
      
      // Ensure at least 1 tab is visible
      if (newTabs.length === 0) return prev;
      return { ...prev, allowedTabs: newTabs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor, informe o nome completo do usuário.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setErrorMessage('');
    setSuccessBanner(null);
    setSupabaseNotice(null);
    setIsSaving(true);

    const permissions = customizePermissions
      ? customPermissions
      : DEFAULT_ROLE_PERMISSIONS[role];

    try {
      if (userToEdit) {
        const res = await updateUserWithSync(userToEdit.id, {
          name,
          email,
          password,
          role,
          profileId: selectedProfileId,
          roleTitle,
          status,
          permissions,
        });

        if (res.supabaseSuccess) {
          setSuccessBanner('Usuário atualizado com sucesso e salvo no Supabase!');
          setTimeout(() => {
            setIsSaving(false);
            onClose();
          }, 800);
        } else if (res.supabaseError) {
          setIsSaving(false);
          setSupabaseNotice(`Usuário salvo localmente. Aviso do Supabase: ${res.supabaseError}`);
          setTimeout(() => {
            onClose();
          }, 2600);
        } else {
          setIsSaving(false);
          onClose();
        }
      } else {
        const res = await addUserWithSync({
          name,
          email,
          password,
          role,
          profileId: selectedProfileId,
          roleTitle,
          status,
          permissions,
        });

        if (res.supabaseSuccess) {
          setSuccessBanner('Usuário criado com sucesso e sincronizado no Supabase!');
          setTimeout(() => {
            setIsSaving(false);
            onClose();
          }, 800);
        } else if (res.supabaseError) {
          setIsSaving(false);
          setSupabaseNotice(`Usuário criado localmente. Aviso do Supabase: ${res.supabaseError}`);
          setTimeout(() => {
            onClose();
          }, 2600);
        } else {
          setIsSaving(false);
          onClose();
        }
      }
    } catch (err: any) {
      setIsSaving(false);
      setErrorMessage(`Erro ao salvar: ${err.message || 'Falha inesperada.'}`);
    }
  };

  const allTabs: TabKey[] = [
    'dashboard',
    'client-dashboard',
    'music-registration',
    'expenses',
    'subscriptions',
    'pipeline',
    'contacts',
    'deal-details',
    'reports',
    'settings',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e5eeff] w-full max-w-2xl max-h-[92vh] flex flex-col text-left overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#3525cd] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0b1c30]">
                  {userToEdit ? 'Editar Usuário & Nível de Acesso' : 'Criar Novo Usuário no Sistema'}
                </h2>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Nuvem</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium">
                    <span>Modo Local</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#565e74]">
                Defina credenciais de login, nível hierárquico e permissões de telas e ações.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {successBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {supabaseNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{supabaseNotice}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">
                E-mail de Login *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos.silva@auracrm.com"
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full px-3 py-2 pr-9 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-2.5 text-[#777587] hover:text-[#0b1c30]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">
                Cargo / Título Exibido
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Ex: Desenvolvedor, Vendedor Sênior"
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          {/* User Role Selection (Perfis de Acesso Cadastrados) */}
          <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#0b1c30]">
                Perfil de Acesso Cadastrado ({accessProfiles.length} disponíveis)
              </label>
              <span className="text-[11px] text-[#565e74]">
                Herda automaticamente nível, telas e diretrizes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accessProfiles.map((prof) => {
                const isSelected = selectedProfileId === prof.id;
                return (
                  <div
                    key={prof.id}
                    onClick={() => handleProfileSelect(prof.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#3525cd] bg-[#eff4ff]/60 shadow-xs'
                        : 'border-[#e5eeff] bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-bold text-xs text-[#0b1c30] truncate">{prof.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${prof.badgeBg} ${prof.badgeText}`}>
                          Nível {prof.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#565e74] leading-relaxed line-clamp-2">
                        {prof.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#e5eeff]/80 flex items-center justify-between text-[10px] text-[#777587]">
                      <span>{prof.permissions.allowedTabs.length} telas liberadas</span>
                      {isSelected && (
                        <span className="text-[#3525cd] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Selecionado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Permissions Toggle */}
          <div className="pt-2 border-t border-[#e5eeff] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0b1c30]">
                  Permissões Granulares (Personalizar Telas & Ações)
                </span>
                <p className="text-[11px] text-[#565e74]">
                  Marque ou desmarque exatamente quais telas e funcionalidades este usuário pode acessar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCustomizePermissions(!customizePermissions);
                  if (!customizePermissions) {
                    setCustomPermissions({ ...DEFAULT_ROLE_PERMISSIONS[role] });
                  }
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  customizePermissions
                    ? 'bg-[#eff4ff] text-[#3525cd] border-[#c7d7fe]'
                    : 'bg-white text-[#565e74] border-[#e5eeff] hover:bg-[#f8f9ff]'
                }`}
              >
                {customizePermissions ? 'Personalizado (Ativo)' : 'Usar Padrão do Nível'}
              </button>
            </div>

            {customizePermissions && (
              <div className="bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-4 space-y-4">
                {/* Allowed Screens */}
                <div>
                  <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide block mb-2">
                    Telas Visíveis na Barra Lateral
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allTabs.map((tabKey) => {
                      const isAllowed = customPermissions.allowedTabs.includes(tabKey);
                      return (
                        <label
                          key={tabKey}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isAllowed
                              ? 'bg-white border-[#3525cd] text-[#0b1c30] font-semibold shadow-2xs'
                              : 'bg-slate-50 border-[#e5eeff] text-[#777587]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => toggleTabPermission(tabKey)}
                            className="w-3.5 h-3.5 text-[#3525cd] rounded cursor-pointer"
                          />
                          <span className="truncate">{TAB_LABELS[tabKey]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Functionalities */}
                <div>
                  <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide block mb-2">
                    Ações & Funcionalidades do Sistema
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e5eeff] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customPermissions.canCreateDeals}
                        onChange={(e) =>
                          setCustomPermissions((prev) => ({
                            ...prev,
                            canCreateDeals: e.target.checked,
                          }))
                        }
                        className="w-3.5 h-3.5 text-[#3525cd] rounded cursor-pointer"
                      />
                      <span>Criar Nova Cotação / Negócio (+ Botão no Header)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e5eeff] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customPermissions.canManageContacts}
                        onChange={(e) =>
                          setCustomPermissions((prev) => ({
                            ...prev,
                            canManageContacts: e.target.checked,
                          }))
                        }
                        className="w-3.5 h-3.5 text-[#3525cd] rounded cursor-pointer"
                      />
                      <span>Criar e Editar Contatos / Clientes</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e5eeff] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customPermissions.canExportData}
                        onChange={(e) =>
                          setCustomPermissions((prev) => ({
                            ...prev,
                            canExportData: e.target.checked,
                          }))
                        }
                        className="w-3.5 h-3.5 text-[#3525cd] rounded cursor-pointer"
                      />
                      <span>Exportar Relatórios e Contatos em CSV</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#e5eeff] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customPermissions.canAccessSettings}
                        onChange={(e) =>
                          setCustomPermissions((prev) => ({
                            ...prev,
                            canAccessSettings: e.target.checked,
                          }))
                        }
                        className="w-3.5 h-3.5 text-[#3525cd] rounded cursor-pointer"
                      />
                      <span>Acessar Painel de Configurações & Usuários</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="pt-2 border-t border-[#e5eeff] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#0b1c30]">Status da Conta</span>
              <p className="text-[11px] text-[#565e74]">
                Usuários inativos não conseguem realizar login no sistema.
              </p>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Ativo' | 'Inativo')}
              className="px-3 py-1.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs font-semibold text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            >
              <option value="Ativo">Ativo (Pode Logar)</option>
              <option value="Inativo">Inativo (Bloqueado)</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e5eeff] hover:bg-[#f8f9ff] text-xs font-semibold text-[#565e74] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-[#3525cd] hover:bg-[#2e1fb5] disabled:opacity-70 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {isSaving
                  ? 'Sincronizando...'
                  : userToEdit
                  ? 'Salvar Alterações'
                  : 'Cadastrar Usuário'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
