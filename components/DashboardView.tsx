'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { MONTHLY_VELOCITY } from '@/lib/mock-data';
import {
  TrendingUp,
  CircleDollarSign,
  Music2,
  FileCheck,
  Disc,
  ArrowUpRight,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
} from 'lucide-react';

export function DashboardView() {
  const {
    deals,
    contacts,
    musicRegistrations,
    expenses,
    subscriptions,
    setActiveTab,
    setIsNewDealModalOpen,
    setIsAiDrawerOpen,
  } = useCRM();

  // Metrics calculation
  const totalPipelineValue = deals.reduce((acc, d) => acc + d.value, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const monthlyRecurring = subscriptions
    .filter((s) => s.status === 'Ativa')
    .reduce((acc, s) => acc + s.monthlyValue, 0);

  const homologatedTracks = musicRegistrations.filter((r) => r.status === 'Homologado ECAD').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Inteligência Comercial & Direitos Autorais</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Visão Geral Aura CRM
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Gestão unificada de pipeline musical, homologação automática de ISRC no ECAD, controle de
            split sheets de coautoria e contratos de sincronização.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('music-registration')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Music2 className="w-4 h-4" />
              <span>Cadastrar Nova Música</span>
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gerar Proposta com IA</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic background */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pipeline Ativo
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            R$ {totalPipelineValue.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{deals.length} negociações ativas</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Músicas / ISRC
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Disc className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {musicRegistrations.length} Faixas
          </div>
          <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>{homologatedTracks} homologadas no ECAD</span>
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              MRR Assinaturas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            R$ {monthlyRecurring.toLocaleString('pt-BR')}
            <span className="text-xs font-normal text-slate-400">/mês</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {subscriptions.length} artistas e selos ativos
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Despesas Globais
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            R$ {totalExpenses.toLocaleString('pt-BR')}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {expenses.length} lançamentos de estúdio & marketing
          </p>
        </div>
      </div>

      {/* Main Grid: Pipeline deals & Music Registrations summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Deals in negotiation */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Negócios Recentes</h2>
              <p className="text-xs text-slate-500">Oportunidades em aberto no pipeline comercial</p>
            </div>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {deals.slice(0, 5).map((deal) => (
              <div
                key={deal.id}
                onClick={() => setActiveTab('pipeline')}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {deal.organization.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{deal.name}</h3>
                    <p className="text-xs text-slate-500">
                      {deal.organization} • {deal.contactName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    R$ {deal.value.toLocaleString('pt-BR')}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {deal.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): Recent registrations and split sheet alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Catálogo ISRC</h2>
              <p className="text-xs text-slate-500">Músicas em processo de homologação</p>
            </div>
            <button
              onClick={() => setActiveTab('music-registration')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {(musicRegistrations || []).slice(0, 4).map((reg, regIdx) => (
              <div
                key={reg.id || `dash-reg-${regIdx}`}
                onClick={() => setActiveTab('music-registration')}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 hover:border-purple-300 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-[160px]">
                    {reg.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                    {reg.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{reg.artistName}</p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>ISRC: {reg.isrcCode || 'Aguardando'}</span>
                  <span>{reg.splits?.length || 0} cotitulares</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
