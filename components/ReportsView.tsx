'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { MONTHLY_VELOCITY, TEAM_MEMBERS } from '@/lib/mock-data';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Music2,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

export function ReportsView() {
  const { deals, musicRegistrations, expenses, subscriptions } = useCRM();

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Nome,Organização,Valor,Fase,Responsável\n' +
      deals.map((d) => `"${d.name}","${d.organization}",${d.value},"${d.stage}","${d.ownerName}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sonora_relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Relatórios Comerciais & Obras
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Exportação Inteligente
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Desempenho da equipe A&R, volume financeiro fechado e velocidade de registros ISRC
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* Monthly Velocity Chart simulation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Evolução de Faturamento & Obras Homologadas (Últimos 6 Meses)
        </h2>
        <div className="grid grid-cols-6 gap-3 pt-6 items-end h-56">
          {MONTHLY_VELOCITY.map((m) => {
            const heightPercent = Math.min(100, Math.round((m.value / 550000) * 100));
            return (
              <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  R$ {(m.value / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-xl transition-all duration-500"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-bold text-slate-700">{m.month}</span>
                <span className="text-[10px] text-purple-600 font-semibold">{m.registrations} faixas</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Desempenho Comercial da Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((tm, idx) => (
            <div
              key={tm.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                #{idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{tm.name}</h3>
                <p className="text-xs text-slate-500">{tm.role}</p>
                <p className="text-xs font-black text-indigo-600 mt-1">
                  R$ {tm.wonValue.toLocaleString('pt-BR')} • {tm.dealsCount} negócios
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
