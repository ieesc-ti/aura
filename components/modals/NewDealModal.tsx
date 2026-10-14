import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { DealStage, Priority } from '@/lib/types';
import { X, DollarSign } from 'lucide-react';

export function NewDealModal() {
  const { isNewDealModalOpen, setIsNewDealModalOpen, addDeal } = useCRM();

  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [value, setValue] = useState('120000');
  const [stage, setStage] = useState<DealStage>('Lead Qualificado');
  const [probability, setProbability] = useState('30');
  const [ownerName, setOwnerName] = useState('Edcarlos Lima');
  const [segment, setSegment] = useState('FINTECH • INBOUND');
  const [priority, setPriority] = useState<Priority>('Alta');
  const [closeDate, setCloseDate] = useState('30 Set, 2024');
  const [notes, setNotes] = useState('');

  if (!isNewDealModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !organization.trim()) return;

    addDeal({
      name,
      organization,
      value: parseFloat(value) || 50000,
      stage,
      probability: parseInt(probability) || 50,
      ownerName,
      ownerInitials: ownerName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      segment,
      priority,
      closeDate,
      urgencyLabel: 'Em 3 dias',
      notes,
    });

    setIsNewDealModalOpen(false);
    setName('');
    setOrganization('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setIsNewDealModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#e5eeff] overflow-hidden z-10 animate-in zoom-in-95 duration-150 text-left">
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b1c30] font-display">
                Criar Nova Cotação
              </h2>
              <p className="text-xs text-[#565e74]">
                Adicione uma nova cotação ao pipeline comercial corporativo
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewDealModalOpen(false)}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-lg hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Nome da Oportunidade / Escopo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Expansão Cloud Core v4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Empresa / Organização Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Petrobras Distribuição S.A."
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Valor Nominal (R$)
              </label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Probabilidade Estimada (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Estágio Inicial
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
              >
                <option value="Lead Qualificado">Lead Qualificado</option>
                <option value="Contato & Diagnóstico">Contato & Diagnóstico</option>
                <option value="Proposta Enviada">Proposta Enviada</option>
                <option value="Negociação & Fechamento">Negociação & Fechamento</option>
                <option value="Fechado / Ganho">Fechado / Ganho</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Responsável
              </label>
              <select
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
              >
                <option value="Edcarlos Lima">Edcarlos Lima</option>
                <option value="Beatriz Lima">Beatriz Lima</option>
                <option value="Camila Luz">Camila Luz</option>
                <option value="Lucas Amaral">Lucas Amaral</option>
                <option value="Bruna Lima">Bruna Lima</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Segmento / Vertical
              </label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
              >
                <option value="FINTECH • INBOUND">FINTECH • INBOUND</option>
                <option value="SAAS • ENTERPRISE">SAAS • ENTERPRISE</option>
                <option value="LOGÍSTICA & SUPPLY">LOGÍSTICA & SUPPLY</option>
                <option value="SAÚDE • HOSPITALAR">SAÚDE • HOSPITALAR</option>
                <option value="TELECOM • CONECTIVIDADE">TELECOM • CONECTIVIDADE</option>
                <option value="VAREJO • B2B">VAREJO • B2B</option>
                <option value="ENERGIA SOLAR">ENERGIA SOLAR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
              >
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Data Estimada de Fechamento
            </label>
            <input
              type="text"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              placeholder="Ex: 30 Set, 2024"
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Notas Iniciais
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contexto da oportunidade, tomador de decisão, etc."
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewDealModalOpen(false)}
              className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg border border-[#c7c4d8] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3525cd] hover:bg-[#2e1fb5] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Criar Cotação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
