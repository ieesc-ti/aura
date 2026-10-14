import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, CheckCircle2 } from 'lucide-react';

export function NewTaskModal() {
  const { isNewTaskModalOpen, setIsNewTaskModalOpen, addTask, deals } = useCRM();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('15:00');
  const [type, setType] = useState<'demo' | 'proposal' | 'followup' | 'call'>('demo');
  const [company, setCompany] = useState(deals[0]?.organization || '');
  const [meta, setMeta] = useState('Google Meet • 4 participantes');
  const [priority, setPriority] = useState<'Alta' | 'Média' | 'Urgente'>('Alta');
  const [assignedTo, setAssignedTo] = useState('Edcarlos Lima');

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      time,
      type,
      company: company || 'Cliente Enterprise',
      subtitle: `${company || 'Alinhamento Comercial'} (${type === 'demo' ? 'Apresentação' : type === 'proposal' ? 'Ajuste de SLA' : 'Alinhamento'})`,
      meta,
      priority,
      assignedTo,
    });

    setIsNewTaskModalOpen(false);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setIsNewTaskModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e5eeff] overflow-hidden z-10 animate-in zoom-in-95 duration-150 text-left">
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b1c30] font-display">
                Adicionar Nova Tarefa
              </h2>
              <p className="text-xs text-[#565e74]">
                Agende demos, follow-ups ou envio de minutas
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(false)}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-lg hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Título da Tarefa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Demonstração Técnica de Integração"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Horário / Data
              </label>
              <input
                type="text"
                placeholder="Ex: 14:30 ou HOJE"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              >
                <option value="demo">Demonstração / Reunião</option>
                <option value="proposal">Envio de Proposta</option>
                <option value="followup">Follow-up Contratual</option>
                <option value="call">Ligação de Alinhamento</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Empresa Relacionada
            </label>
            <input
              type="text"
              placeholder="Ex: FinTech Soluções Globais"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Canal / Plataforma
              </label>
              <input
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              >
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
                <option value="Média">Média</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg border border-[#c7c4d8] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3525cd] hover:bg-[#2e1fb5] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Adicionar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
