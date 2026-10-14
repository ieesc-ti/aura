'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { ClientSubscription } from '@/lib/types';
import { CreditCard, Plus, CheckCircle, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function SubscriptionsView() {
  const { subscriptions, addSubscription } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [planName, setPlanName] = useState<'Básico Artista' | 'Pro Distribuição' | 'Selo Enterprise'>('Pro Distribuição');
  const [monthlyValue, setMonthlyValue] = useState('180');

  const totalMRR = subscriptions
    .filter((s) => s.status === 'Ativa')
    .reduce((sum, s) => sum + s.monthlyValue, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !email) return;

    addSubscription({
      clientName,
      email,
      planName,
      status: 'Ativa',
      monthlyValue: parseFloat(monthlyValue) || 180,
      nextBillingDate: '2024-11-05',
      registeredTracksCount: 1,
    });

    setIsModalOpen(false);
    setClientName('');
    setEmail('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Planos & Assinaturas Recorrentes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {subscriptions.length} assinaturas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle de mensalidades de artistas e selos parceiros do Aura Hub
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Assinatura</span>
        </button>
      </div>

      {/* MRR Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">
            Receita Mensal Recorrente (MRR)
          </span>
          <p className="text-3xl font-black mt-1">R$ {totalMRR.toLocaleString('pt-BR')}/mês</p>
          <p className="text-xs text-emerald-100 mt-1">
            Taxa de adimplência: 94% • Renovação automática via cartão ou Pix
          </p>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Cliente / Artista</th>
                <th className="px-5 py-3">Plano</th>
                <th className="px-5 py-3">Mensalidade</th>
                <th className="px-5 py-3">Próximo Vencimento</th>
                <th className="px-5 py-3">Faixas Inclusas</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900">{sub.clientName}</p>
                    <p className="text-[11px] text-slate-400">{sub.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {sub.planName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-black text-slate-900">
                    R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {sub.nextBillingDate}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">
                    {sub.registeredTracksCount} faixas
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'Ativa'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Subscription */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Adicionar Assinante</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Selo Tropicalia"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@tropicalia.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plano</label>
                <select
                  value={planName}
                  onChange={(e) => {
                    const p = e.target.value as any;
                    setPlanName(p);
                    if (p === 'Básico Artista') setMonthlyValue('79');
                    else if (p === 'Pro Distribuição') setMonthlyValue('180');
                    else setMonthlyValue('3000');
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Básico Artista">Básico Artista (R$ 79/mês)</option>
                  <option value="Pro Distribuição">Pro Distribuição (R$ 180/mês)</option>
                  <option value="Selo Enterprise">Selo Enterprise (R$ 3.000/mês)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valor Mensal (R$)</label>
                <input
                  type="number"
                  required
                  value={monthlyValue}
                  onChange={(e) => setMonthlyValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Ativar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
