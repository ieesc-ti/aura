'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { DealStage, Priority } from '@/lib/types';
import { X, DollarSign, Building, User, Calendar, Tag } from 'lucide-react';

export function NewDealModal() {
  const { isNewDealModalOpen, setIsNewDealModalOpen, addDeal, currentUser } = useCRM();

  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<DealStage>('Prospecção & Lead');
  const [priority, setPriority] = useState<Priority>('Média');
  const [probability, setProbability] = useState('70');
  const [closeDate, setCloseDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tagsInput, setTagsInput] = useState('Música, Distribuição');

  if (!isNewDealModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organization) return;

    addDeal({
      name,
      organization,
      value: parseFloat(value) || 0,
      stage,
      priority,
      probability: parseInt(probability) || 50,
      closeDate: closeDate || '30 dias',
      ownerName: currentUser.name,
      contactName: contactName || 'Não especificado',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsNewDealModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Novo Negócio Comercial</h2>
            <p className="text-xs text-slate-500">Cadastre uma nova oportunidade no pipeline</p>
          </div>
          <button
            onClick={() => setIsNewDealModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Título do Negócio *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Licenciamento Catálogo Sincronização"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organização / Selo *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ex: Som Livre"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor Previsto (R$)</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="50000"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fase Inicial</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="Prospecção & Lead">Prospecção & Lead</option>
                <option value="Qualificação Técnica">Qualificação Técnica</option>
                <option value="Proposta Comercial">Proposta Comercial</option>
                <option value="Negociação & Fechamento">Negociação & Fechamento</option>
                <option value="Contrato Assinado">Contrato Assinado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Probabilidade (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Contato</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nome da pessoa"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@empresa.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewDealModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Criar Negócio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
