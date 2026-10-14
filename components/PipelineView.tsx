'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { DealStage, Deal } from '@/lib/types';
import {
  Kanban,
  Plus,
  DollarSign,
  Calendar,
  Building,
  MoreVertical,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const STAGES: DealStage[] = [
  'Prospecção & Lead',
  'Qualificação Técnica',
  'Proposta Comercial',
  'Negociação & Fechamento',
  'Contrato Assinado',
  'Perdido',
];

export function PipelineView() {
  const { deals, updateDealStage, setSelectedDealId, setActiveTab, setIsNewDealModalOpen } = useCRM();
  const [filterOwner, setFilterOwner] = useState<string>('all');

  const filteredDeals = deals.filter((d) => (filterOwner === 'all' ? true : d.ownerName === filterOwner));

  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pipeline de Vendas & Contratos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredDeals.length} negócios
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão do funil comercial para licenciamento, distribuição e registros musicais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewDealModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Negócio</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage}
              className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 truncate" title={stage}>
                    {stage}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    R$ {stageTotal.toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                  {stageDeals.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => {
                      setSelectedDealId(deal.id);
                      setActiveTab('deal-details');
                    }}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition">
                        {deal.name}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{deal.organization}</span>
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-900">
                        R$ {deal.value.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {deal.probability}%
                      </span>
                    </div>

                    {/* Quick Move Stage Select */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Fase:</span>
                      <select
                        value={deal.stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateDealStage(deal.id, e.target.value as DealStage)}
                        className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-hidden"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">
                    <p className="text-[11px] text-slate-400">Nenhum negócio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
