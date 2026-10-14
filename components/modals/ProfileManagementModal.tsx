import React, { useState, useEffect } from 'react';
import { AccessProfile, TabKey, UserPermissions, UserRole } from '@/lib/types';
import { useCRM } from '@/lib/crm-context';
import { X, Shield, Check, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { TAB_LABELS } from '@/lib/user-presets';

interface ProfileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit?: AccessProfile | null;
}

const COLOR_PRESETS = [
  { label: 'Índigo Real', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', preview: 'bg-indigo-600' },
  { label: 'Esmeralda', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', preview: 'bg-emerald-600' },
  { label: 'Azul Cobalto', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', preview: 'bg-blue-600' },
  { label: 'Teal & Ciano', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700', preview: 'bg-teal-600' },
  { label: 'Âmbar Dourado', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', preview: 'bg-amber-600' },
  { label: 'Púrpura', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', preview: 'bg-purple-600' },
  { label: 'Rose & Coral', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', preview: 'bg-rose-600' },
];

const LEVEL_PRESETS = [
  { level: 1, name: 'Nível 1 - Acesso Estratégico & Total' },
  { level: 2, name: 'Nível 2 - Gestão Comercial & Relatórios' },
  { level: 3, name: 'Nível 3 - Operacional Comercial & Vendas' },
  { level: 4, name: 'Nível 4 - Somente Leitura & Auditoria' },
  { level: 5, name: 'Nível 5 - Operação Especializada / Suporte' },
];

export function ProfileManagementModal({
  isOpen,
  onClose,
  profileToEdit,
}: ProfileManagementModalProps) {
  const { addProfile, updateProfile } = useCRM();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState(3);
  const [levelName, setLevelName] = useState('Nível 3 - Operacional Comercial & Vendas');
  const [roleKey, setRoleKey] = useState<UserRole>('seller');
  const [selectedColorIndex, setSelectedColorIndex] = useState(2);

  // Permissions
  const [allowedTabs, setAllowedTabs] = useState<TabKey[]>([
    'dashboard',
    'pipeline',
    'contacts',
    'deal-details',
  ]);
  const [canCreateDeals, setCanCreateDeals] = useState(true);
  const [canManageContacts, setCanManageContacts] = useState(true);
  const [canExportData, setCanExportData] = useState(false);
  const [canAccessSettings, setCanAccessSettings] = useState(false);
  const [canDeleteRecords, setCanDeleteRecords] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profileToEdit) {
      setName(profileToEdit.name);
      setDescription(profileToEdit.description);
      setLevel(profileToEdit.level || 3);
      setLevelName(profileToEdit.levelName || `Nível ${profileToEdit.level}`);
      setRoleKey((profileToEdit.roleKey as UserRole) || 'seller');
      setAllowedTabs([...profileToEdit.permissions.allowedTabs]);
      setCanCreateDeals(profileToEdit.permissions.canCreateDeals);
      setCanManageContacts(profileToEdit.permissions.canManageContacts);
      setCanExportData(profileToEdit.permissions.canExportData);
      setCanAccessSettings(profileToEdit.permissions.canAccessSettings);
      setCanDeleteRecords(profileToEdit.permissions.canDeleteRecords);

      const colorIdx = COLOR_PRESETS.findIndex((c) => c.bg === profileToEdit.badgeBg);
      setSelectedColorIndex(colorIdx !== -1 ? colorIdx : 0);
    } else {
      setName('');
      setDescription('');
      setLevel(3);
      setLevelName('Nível 3 - Operacional Comercial & Vendas');
      setRoleKey('seller');
      setAllowedTabs(['dashboard', 'pipeline', 'contacts', 'deal-details']);
      setCanCreateDeals(true);
      setCanManageContacts(true);
      setCanExportData(false);
      setCanAccessSettings(false);
      setCanDeleteRecords(false);
      setSelectedColorIndex(2);
    }
    setErrorMsg('');
  }, [profileToEdit, isOpen]);

  if (!isOpen) return null;

  const handleLevelChange = (lvl: number) => {
    setLevel(lvl);
    const found = LEVEL_PRESETS.find((p) => p.level === lvl);
    if (found) setLevelName(found.name);

    if (!profileToEdit) {
      if (lvl === 1) {
        setRoleKey('admin');
        setAllowedTabs([
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
        ]);
        setCanCreateDeals(true);
        setCanManageContacts(true);
        setCanExportData(true);
        setCanAccessSettings(true);
        setCanDeleteRecords(true);
        setSelectedColorIndex(0);
      } else if (lvl === 2) {
        setRoleKey('manager');
        setAllowedTabs([
          'dashboard',
          'client-dashboard',
          'music-registration',
          'expenses',
          'subscriptions',
          'pipeline',
          'contacts',
          'deal-details',
          'reports',
        ]);
        setCanCreateDeals(true);
        setCanManageContacts(true);
        setCanExportData(true);
        setCanAccessSettings(false);
        setCanDeleteRecords(false);
        setSelectedColorIndex(1);
      } else if (lvl === 3) {
        setRoleKey('seller');
        setAllowedTabs([
          'dashboard',
          'client-dashboard',
          'music-registration',
          'pipeline',
          'contacts',
          'subscriptions',
          'deal-details',
        ]);
        setCanCreateDeals(true);
        setCanManageContacts(true);
        setCanExportData(false);
        setCanAccessSettings(false);
        setCanDeleteRecords(false);
        setSelectedColorIndex(2);
      } else if (lvl === 4) {
        setRoleKey('viewer');
        setAllowedTabs(['dashboard', 'contacts', 'reports']);
        setCanCreateDeals(false);
        setCanManageContacts(false);
        setCanExportData(false);
        setCanAccessSettings(false);
        setCanDeleteRecords(false);
        setSelectedColorIndex(4);
      } else if (lvl === 5) {
        setRoleKey('client');
        setAllowedTabs(['client-dashboard', 'music-registration', 'subscriptions']);
        setCanCreateDeals(false);
        setCanManageContacts(false);
        setCanExportData(true);
        setCanAccessSettings(false);
        setCanDeleteRecords(false);
        setSelectedColorIndex(5);
      }
    }
  };

  const toggleTab = (tab: TabKey) => {
    setAllowedTabs((prev) => {
      const exists = prev.includes(tab);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one tab
        return prev.filter((t) => t !== tab);
      } else {
        return [...prev, tab];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome do perfil de acesso.');
      return;
    }

    const color = COLOR_PRESETS[selectedColorIndex];
    const permissions: UserPermissions = {
      allowedTabs,
      canCreateDeals,
      canManageContacts,
      canExportData,
      canAccessSettings,
      canDeleteRecords,
    };

    if (profileToEdit) {
      updateProfile(profileToEdit.id, {
        name: name.trim(),
        description: description.trim() || 'Perfil de acesso corporativo com privilégios personalizados.',
        level,
        levelName,
        roleKey,
        badgeBg: color.bg,
        badgeText: color.text,
        permissions,
      });
    } else {
      addProfile({
        name: name.trim(),
        description: description.trim() || 'Perfil de acesso corporativo com privilégios personalizados.',
        level,
        levelName,
        roleKey,
        badgeBg: color.bg,
        badgeText: color.text,
        permissions,
      });
    }

    onClose();
  };

  const allTabs: { id: TabKey; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Geral' },
    { id: 'client-dashboard', label: 'Portal do Artista (Créditos & Registros)', badge: 'Serviço' },
    { id: 'music-registration', label: 'Registro de Música (Áudio & Letra / Poesia)', badge: '2 Opções' },
    { id: 'expenses', label: 'Despesas (Anúncios & Serviços Digitais)', badge: 'Novo' },
    { id: 'subscriptions', label: 'Planos & Assinaturas', badge: 'Serviço' },
    { id: 'pipeline', label: 'Pipeline de Vendas & Cotações' },
    { id: 'contacts', label: 'Contatos & Clientes' },
    { id: 'deal-details', label: 'Detalhes do Negócio' },
    { id: 'reports', label: 'Relatórios & Métricas' },
    { id: 'settings', label: 'Configurações & Perfis (RBAC)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e5eeff] max-w-2xl w-full text-left my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e5eeff] flex items-center justify-between bg-gradient-to-r from-[#f8f9ff] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                {profileToEdit ? 'Editar Perfil de Acesso' : 'Cadastro de Perfil de Acesso'}
              </h2>
              <p className="text-xs text-[#565e74]">
                Defina o nível hierárquico, telas permitidas e permissões operacionais do perfil.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#777587] hover:text-[#0b1c30] rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30]">
                Nome do Perfil <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: SDR & Qualificação, Supervisor de Vendas, Auditor Externo..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#c4c7d0] rounded-lg focus:outline-hidden focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30]">Nível Hierárquico</label>
              <select
                value={level}
                onChange={(e) => handleLevelChange(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-[#c4c7d0] rounded-lg focus:outline-hidden focus:border-[#3525cd]"
              >
                {LEVEL_PRESETS.map((p) => (
                  <option key={p.level} value={p.level}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30]">Papel Base do Sistema</label>
              <select
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value as UserRole)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#c4c7d0] rounded-lg focus:outline-hidden focus:border-[#3525cd]"
              >
                <option value="admin">Administrador (Total)</option>
                <option value="manager">Gerente Comercial (Gestão)</option>
                <option value="seller">Vendedor / Executivo (Operacional)</option>
                <option value="viewer">Visualizador (Leitura)</option>
                <option value="client">Usuário de Serviço / Artista (Serviços)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30]">Descrição do Perfil</label>
              <textarea
                rows={2}
                placeholder="Descreva a finalidade, setor ou equipe responsável por este perfil..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#c4c7d0] rounded-lg focus:outline-hidden focus:border-[#3525cd]"
              />
            </div>
          </div>

          {/* Color Tag Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0b1c30] flex items-center justify-between">
              <span>Etiqueta & Cor do Perfil</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${COLOR_PRESETS[selectedColorIndex].bg} ${COLOR_PRESETS[selectedColorIndex].text}`}>
                {name || 'Prévia do Perfil'} • Nível {level}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    selectedColorIndex === idx
                      ? 'border-[#3525cd] bg-[#eff4ff] ring-1 ring-[#3525cd]'
                      : 'border-[#e5eeff] bg-[#f8f9ff] hover:bg-white text-[#565e74]'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${preset.preview}`} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MATRIX 1: Allowed Screens */}
          <div className="space-y-2.5 pt-2 border-t border-[#e5eeff]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#3525cd]" />
                <span>Telas Permitidas na Navegação ({allowedTabs.length}/{allTabs.length})</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAllowedTabs(allTabs.map((t) => t.id))}
                  className="text-[11px] font-semibold text-[#3525cd] hover:underline cursor-pointer"
                >
                  Marcar Todas ({allTabs.length})
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setAllowedTabs(['dashboard'])}
                  className="text-[11px] font-semibold text-[#565e74] hover:underline cursor-pointer"
                >
                  Limpar
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#565e74]">
              Selecione quais telas deste sistema estarão visíveis na barra lateral para os usuários deste perfil:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allTabs.map((tab) => {
                const isSelected = allowedTabs.includes(tab.id);
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => toggleTab(tab.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#3525cd] bg-[#f0f3ff] text-[#0b1c30] shadow-2xs font-semibold'
                        : 'border-[#e5eeff] bg-white text-[#777587] hover:border-[#c4c7d0]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="truncate">{tab.label}</span>
                      {tab.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                          tab.badge === 'Novo'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#3525cd] shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded border border-[#c4c7d0] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MATRIX 2: Functional Capabilities */}
          <div className="space-y-2.5 pt-2 border-t border-[#e5eeff]">
            <label className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Permissões Funcionais & Botões Habilitados</span>
            </label>

            <div className="space-y-2">
              {/* canCreateDeals */}
              <label className="flex items-start gap-2.5 p-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={canCreateDeals}
                  onChange={(e) => setCanCreateDeals(e.target.checked)}
                  className="mt-0.5 rounded text-[#3525cd] focus:ring-[#3525cd]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#0b1c30]">
                    Criar & Negociar Cotações (+ Nova Cotação)
                  </div>
                  <div className="text-[11px] text-[#565e74]">
                    Exibe e ativa o botão "+ Nova Cotação" no cabeçalho superior e no pipeline.
                  </div>
                </div>
              </label>

              {/* canManageContacts */}
              <label className="flex items-start gap-2.5 p-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={canManageContacts}
                  onChange={(e) => setCanManageContacts(e.target.checked)}
                  className="mt-0.5 rounded text-[#3525cd] focus:ring-[#3525cd]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#0b1c30]">
                    Cadastrar & Editar Contatos e Clientes
                  </div>
                  <div className="text-[11px] text-[#565e74]">
                    Permite criar novos contatos (+ Novo Contato), atualizar dados cadastrais e telefones.
                  </div>
                </div>
              </label>

              {/* canExportData */}
              <label className="flex items-start gap-2.5 p-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={canExportData}
                  onChange={(e) => setCanExportData(e.target.checked)}
                  className="mt-0.5 rounded text-[#3525cd] focus:ring-[#3525cd]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#0b1c30]">
                    Exportação de Relatórios e Planilhas (CSV)
                  </div>
                  <div className="text-[11px] text-[#565e74]">
                    Habilita o download de negócios, carteira de clientes e métricas para planilhas.
                  </div>
                </div>
              </label>

              {/* canAccessSettings */}
              <label className="flex items-start gap-2.5 p-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={canAccessSettings}
                  onChange={(e) => setCanAccessSettings(e.target.checked)}
                  className="mt-0.5 rounded text-[#3525cd] focus:ring-[#3525cd]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#0b1c30]">
                    Acesso às Configurações da Instância & Gestão de Usuários
                  </div>
                  <div className="text-[11px] text-[#565e74]">
                    Permite gerenciar a governança, cadastrar usuários e alterar metas corporativas.
                  </div>
                </div>
              </label>

              {/* canDeleteRecords */}
              <label className="flex items-start gap-2.5 p-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={canDeleteRecords}
                  onChange={(e) => setCanDeleteRecords(e.target.checked)}
                  className="mt-0.5 rounded text-[#3525cd] focus:ring-[#3525cd]"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#0b1c30]">
                    Exclusão Permanente de Registros
                  </div>
                  <div className="text-[11px] text-[#565e74]">
                    Habilita o botão de remoção / lixeira em contatos e oportunidades no pipeline.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5eeff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#c4c7d0] text-xs font-semibold text-[#565e74] rounded-lg hover:bg-[#f8f9ff] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#3525cd] hover:bg-[#2e1fb5] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{profileToEdit ? 'Salvar Alterações' : 'Cadastrar Perfil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
