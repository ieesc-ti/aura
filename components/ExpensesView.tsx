'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { ExpenseCategory, Expense } from '@/lib/types';
import {
  Receipt,
  Plus,
  CircleDollarSign,
  Calendar,
  Tag,
  Trash2,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = [
  'Estúdio & Gravação',
  'Marketing & Lançamento',
  'Distribuição',
  'Direitos & ECAD',
  'Design & Capa',
  'Outros',
];

export function ExpensesView() {
  const { expenses, addExpense, deleteExpense } = useCRM();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Estúdio & Gravação');
  const [amount, setAmount] = useState('');
  const [artistOrProject, setArtistOrProject] = useState('');
  const [status, setStatus] = useState<'Pago' | 'Pendente' | 'Agendado'>('Pago');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      title,
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      artistOrProject: artistOrProject || 'Geral',
      status,
    });

    setIsModalOpen(false);
    setTitle('');
    setAmount('');
    setArtistOrProject('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Controle de Despesas Musicais
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {expenses.length} lançamentos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Custos com gravação, masterização, campanhas de marketing e taxas associativas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Lançar Despesa</span>
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Despesas</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            R$ {totalExpenses.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-500 mt-1">Todas as categorias</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Estúdio & Gravação</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            R${' '}
            {expenses
              .filter((e) => e.category === 'Estúdio & Gravação')
              .reduce((s, e) => s + e.amount, 0)
              .toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-500 mt-1">Produção técnica</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Marketing & Tráfego</span>
          <p className="text-2xl font-black text-purple-600 mt-1">
            R${' '}
            {expenses
              .filter((e) => e.category === 'Marketing & Lançamento')
              .reduce((s, e) => s + e.amount, 0)
              .toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-500 mt-1">Divulgação de singles</p>
        </div>
      </div>

      {/* Expenses List: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhuma despesa registrada.
            </div>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                {/* Header: Title & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm">{exp.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{exp.artistOrProject}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      exp.status === 'Pago'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>

                {/* Category & Date badge */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
                    {exp.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{exp.date}</span>
                </div>

                {/* Footer: Value & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Valor</span>
                    <span className="text-base font-black text-slate-900">
                      R$ {exp.amount.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Excluir Despesa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Descrição da Despesa</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3">Artista / Projeto</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Valor</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{exp.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{exp.artistOrProject}</td>
                  <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{exp.date}</td>
                  <td className="px-5 py-3.5 font-black text-slate-900 whitespace-nowrap">
                    R$ {exp.amount.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        exp.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      title="Excluir Despesa"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Lançar Nova Despesa</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mixagem Faixa 2"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1500.00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Artista / Projeto</label>
                <input
                  type="text"
                  value={artistOrProject}
                  onChange={(e) => setArtistOrProject(e.target.value)}
                  placeholder="Ex: Single Aurora"
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
