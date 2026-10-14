import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, UserPlus } from 'lucide-react';

export function NewContactModal() {
  const { isNewContactModalOpen, setIsNewContactModalOpen, addContact } = useCRM();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [companyTier, setCompanyTier] = useState<'Enterprise' | 'Mid-Market' | 'Startup'>('Enterprise');
  const [segment, setSegment] = useState('FinTech • Infraestrutura');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [totalContractValue, setTotalContractValue] = useState('150000');
  const [status, setStatus] = useState<'Ativo' | 'Risco' | 'Onboarding'>('Ativo');
  const [nps, setNps] = useState('9');
  const [notes, setNotes] = useState('');

  if (!isNewContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    addContact({
      name,
      role: role || 'Tomador de Decisão',
      company,
      companyTier,
      segment,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
      phone: phone || '+55 11 99999-0000',
      totalContractValue: parseFloat(totalContractValue) || 100000,
      activeDealsCount: 1,
      status,
      nps: parseInt(nps) || 9,
      notes,
    });

    setIsNewContactModalOpen(false);
    setName('');
    setRole('');
    setCompany('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setIsNewContactModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#e5eeff] overflow-hidden z-10 animate-in zoom-in-95 duration-150 text-left">
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b1c30] font-display">
                Novo Contato & Decisor
              </h2>
              <p className="text-xs text-[#565e74]">
                Adicione um executivo ou stakeholder à carteira de clientes
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewContactModalOpen(false)}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-lg hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Albuquerque"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Cargo / Função
              </label>
              <input
                type="text"
                placeholder="Ex: VP de Operações"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
                placeholder="Ex: Banco Paulista S.A."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Porte da Empresa
              </label>
              <select
                value={companyTier}
                onChange={(e) => setCompanyTier(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
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
                placeholder="carlos@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+55 11 98888-7777"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Valor Total ARR (R$)
              </label>
              <input
                type="number"
                value={totalContractValue}
                onChange={(e) => setTotalContractValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              >
                <option value="Ativo">Ativo</option>
                <option value="Risco">Risco</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                NPS (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={nps}
                onChange={(e) => setNps(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Observações & Relacionamento
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Histórico prévio, principais prioridades do decisor..."
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewContactModalOpen(false)}
              className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg border border-[#c7c4d8] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3525cd] hover:bg-[#2e1fb5] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Salvar Contato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
