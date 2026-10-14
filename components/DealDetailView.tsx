'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { DealStage } from '@/lib/types';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Tag,
  CheckCircle2,
  Trash2,
  Sparkles,
  User,
} from 'lucide-react';

const STAGES: DealStage[] = [
  'Prospecção & Lead',
  'Qualificação Técnica',
  'Proposta Comercial',
  'Negociação & Fechamento',
  'Contrato Assinado',
  'Perdido',
];

export function DealDetailView() {
  const {
    selectedDeal,
    updateDealStage,
    deleteDeal,
    setActiveTab,
    setIsAiDrawerOpen,
  } = useCRM();

  if (!selectedDeal) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500 mb-4">Nenhum negócio selecionado.</p>
        <button
          onClick={() => setActiveTab('pipeline')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Voltar ao Pipeline
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(selectedDeal.stage);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('pipeline')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {selectedDeal.organization}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {selectedDeal.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pitch de Fechamento com IA</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Deseja realmente excluir este negócio?')) {
                deleteDeal(selectedDeal.id);
                setActiveTab('pipeline');
              }
            }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Excluir negócio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Progression Stepper */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Fase Atual do Fechamento
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STAGES.map((stg, idx) => {
            const isCompleted = idx <= currentStageIndex && selectedDeal.stage !== 'Perdido';
            const isCurrent = selectedDeal.stage === stg;

            return (
              <button
                key={stg}
                onClick={() => updateDealStage(selectedDeal.id, stg)}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : isCompleted
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span>Passo {idx + 1}</span>
                  {isCompleted && <span>✓</span>}
                </div>
                <p className="truncate">{stg}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deal Financials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Valores & Probabilidade
          </h2>

          <div>
            <span className="text-xs text-slate-400 block font-semibold">Valor do Negócio</span>
            <span className="text-2xl font-black text-slate-900">
              R$ {selectedDeal.value.toLocaleString('pt-BR')}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-semibold">Chance de Fechamento</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${selectedDeal.probability}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800">{selectedDeal.probability}%</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-semibold">Previsão de Conclusão</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDeal.closeDate}</p>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-semibold">Responsável Comercial</span>
            <p className="text-xs font-bold text-indigo-600 mt-0.5">{selectedDeal.ownerName}</p>
          </div>
        </div>

        {/* Contact Info & Notes */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Contato & Notas da Negociação
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Contato</span>
              <p className="text-xs font-bold text-slate-800 mt-1">{selectedDeal.contactName}</p>
              <p className="text-xs text-slate-500">{selectedDeal.contactEmail}</p>
              <p className="text-xs text-slate-500">{selectedDeal.contactPhone}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Empresa / Selo</span>
              <p className="text-xs font-bold text-slate-800 mt-1">{selectedDeal.organization}</p>
              <p className="text-xs text-slate-500">Prioridade: {selectedDeal.priority}</p>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-semibold mb-1">Tags do Contrato</span>
            <div className="flex flex-wrap gap-1.5">
              {(selectedDeal.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {selectedDeal.notes && (
            <div>
              <span className="text-xs text-slate-400 block font-semibold mb-1">Observações Internas</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {selectedDeal.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
