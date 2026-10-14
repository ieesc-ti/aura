'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Priority } from '@/lib/types';
import { X } from 'lucide-react';

export function NewTaskModal() {
  const { isNewTaskModalOpen, setIsNewTaskModalOpen, addTask, currentUser, deals } = useCRM();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [dealId, setDealId] = useState('');

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const matchedDeal = deals.find((d) => d.id === dealId);

    addTask({
      title,
      dueDate: dueDate || 'Amanhã',
      assignedTo: currentUser.name,
      priority,
      dealId: dealId || undefined,
      dealName: matchedDeal?.name || undefined,
    });

    setIsNewTaskModalOpen(false);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Nova Tarefa</h2>
          <button
            onClick={() => setIsNewTaskModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Título da Tarefa *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Validar split sheet com produtor"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data Limite</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Vincular a um Negócio</label>
            <select
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            >
              <option value="">Nenhum (Geral)</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.organization})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
