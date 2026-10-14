import React, { useState, useEffect } from 'react';
import { Contact } from '@/lib/types';
import { X, Pencil, Trash2, Mail, Phone, Building2, User, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  mode: 'view' | 'edit' | 'delete';
  onSave: (id: string, updates: Partial<Contact>) => void;
  onDelete: (id: string) => void;
  onSwitchToEdit?: () => void;
  onSwitchToDelete?: () => void;
}

export function ContactCrudModal({
  isOpen,
  onClose,
  contact,
  mode,
  onSave,
  onDelete,
  onSwitchToEdit,
  onSwitchToDelete,
}: ContactModalProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({});
  const [confirmDeleteName, setConfirmDeleteName] = useState('');

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        role: contact.role,
        company: contact.company,
        companyTier: contact.companyTier,
        segment: contact.segment,
        email: contact.email,
        phone: contact.phone,
        totalContractValue: contact.totalContractValue,
        activeDealsCount: contact.activeDealsCount,
        status: contact.status,
        nps: contact.nps,
        notes: contact.notes || '',
      });
      setConfirmDeleteName('');
    }
  }, [contact, mode]);

  if (!isOpen || !contact) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.company?.trim()) return;

    const initials = (formData.name || 'C')
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    onSave(contact.id, {
      ...formData,
      initials: initials || contact.initials,
      totalContractValue: Number(formData.totalContractValue) || 0,
      activeDealsCount: Number(formData.activeDealsCount) || 1,
      nps: Number(formData.nps) || 0,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(contact.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#e5eeff] overflow-hidden z-10 animate-in zoom-in-95 duration-150 text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                mode === 'delete'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-[#3525cd] text-white'
              }`}
            >
              {mode === 'delete' ? (
                <Trash2 className="w-4 h-4" />
              ) : mode === 'edit' ? (
                <Pencil className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b1c30] font-display">
                {mode === 'view' && 'Detalhes do Contato'}
                {mode === 'edit' && 'Editar Contato'}
                {mode === 'delete' && 'Excluir Contato'}
              </h2>
              <p className="text-xs text-[#565e74]">
                {mode === 'view' && `${contact.name} • ${contact.company}`}
                {mode === 'edit' && 'Atualize os dados e contratos do contato'}
                {mode === 'delete' && 'Confirmação de exclusão permanente'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode */}
        {mode === 'view' && (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Top Identity Card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              {contact.avatarUrl ? (
                <img
                  src={contact.avatarUrl}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#c7c4d8]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    contact.avatarBg || 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {contact.initials}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0b1c30]">{contact.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      contact.status === 'Ativo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : contact.status === 'Onboarding'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
                <div className="text-xs text-[#565e74] mt-0.5">
                  {contact.role} em <strong>{contact.company}</strong> ({contact.companyTier})
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-[#e5eeff] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#777587] uppercase flex items-center gap-1">
                  <Mail className="w-3 h-3" /> E-mail
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-medium text-[#3525cd] hover:underline break-all block"
                >
                  {contact.email}
                </a>
              </div>

              <div className="p-3 bg-white border border-[#e5eeff] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#777587] uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Telefone
                </span>
                <div className="font-medium text-[#0b1c30]">{contact.phone}</div>
              </div>

              <div className="p-3 bg-white border border-[#e5eeff] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#777587] uppercase flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Segmento
                </span>
                <div className="font-medium text-[#0b1c30]">{contact.segment}</div>
              </div>

              <div className="p-3 bg-white border border-[#e5eeff] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#777587] uppercase">
                  NPS & Satisfação
                </span>
                <div className="font-bold text-[#0b1c30] flex items-center gap-1">
                  <span>{contact.nps}/10</span>
                  <span className="text-[10px] text-[#565e74] font-normal">
                    {contact.nps >= 9 ? 'Promotor' : contact.nps >= 7 ? 'Neutro' : 'Detrator'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Value & Active Deals */}
            <div className="p-3.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#777587] uppercase">
                  VALOR CONTRATUAL TOTAL (ARR)
                </span>
                <div className="text-base font-extrabold text-[#0b1c30] tabular-nums mt-0.5">
                  R$ {contact.totalContractValue.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#777587] uppercase">
                  CONTRATOS ATIVOS
                </span>
                <div className="text-sm font-bold text-[#0b1c30] mt-0.5">
                  {contact.activeDealsCount} {contact.activeDealsCount === 1 ? 'contrato' : 'contratos'}
                </div>
              </div>
            </div>

            {/* Notes */}
            {contact.notes && (
              <div className="p-3 bg-white border border-[#e5eeff] rounded-lg text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#777587] uppercase">
                  OBSERVAÇÕES
                </span>
                <p className="text-[#565e74] leading-relaxed">{contact.notes}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between">
              <button
                type="button"
                onClick={onSwitchToDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 bg-white hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg border border-[#c7c4d8] transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={onSwitchToEdit}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3525cd] hover:bg-[#2e1fb5] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar Contato</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {mode === 'edit' && (
          <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Porte da Empresa
                </label>
                <select
                  value={formData.companyTier || 'Enterprise'}
                  onChange={(e) =>
                    setFormData({ ...formData, companyTier: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Segmento
                </label>
                <input
                  type="text"
                  value={formData.segment || ''}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  placeholder="Ex: FinTech • Infraestrutura"
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'Ativo'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Risco">Risco</option>
                  <option value="Onboarding">Onboarding</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Valor ARR (R$)
                </label>
                <input
                  type="number"
                  value={formData.totalContractValue ?? 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalContractValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Contratos Ativos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.activeDealsCount ?? 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activeDealsCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  NPS (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.nps ?? 9}
                  onChange={(e) =>
                    setFormData({ ...formData, nps: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Observações
              </label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg border border-[#c7c4d8] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#3525cd] hover:bg-[#2e1fb5] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}

        {/* Delete Mode */}
        {mode === 'delete' && (
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Atenção: Ação Irreversível</p>
                <p className="text-rose-700">
                  Você está prestes a remover o contato <strong>{contact.name}</strong> da empresa{' '}
                  <strong>{contact.company}</strong>. Todos os dados associados a este contato na carteira serão excluídos.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs space-y-1.5">
              <div className="flex justify-between text-[#565e74]">
                <span>Valor Contratual:</span>
                <span className="font-bold text-[#0b1c30]">
                  R$ {contact.totalContractValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between text-[#565e74]">
                <span>E-mail:</span>
                <span className="font-medium text-[#0b1c30]">{contact.email}</span>
              </div>
              <div className="flex justify-between text-[#565e74]">
                <span>Contratos:</span>
                <span className="font-medium text-[#0b1c30]">{contact.activeDealsCount}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg border border-[#c7c4d8] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Contato</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
