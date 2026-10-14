import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Search, DollarSign, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    deals,
    contacts,
    tasks,
    setSelectedDealId,
    setSelectedContactId,
    setActiveTab,
  } = useCRM();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedDeals = deals.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.organization.toLowerCase().includes(q) ||
      d.segment.toLowerCase().includes(q)
  );

  const matchedContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
  );

  const matchedTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#e5eeff] overflow-hidden z-10 animate-in zoom-in-95 duration-100 text-left">
        <div className="p-4 border-b border-[#e5eeff] flex items-center gap-3 bg-[#f8f9ff]">
          <Search className="w-5 h-5 text-[#3525cd] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por lead, empresa, contato, valor, tag..."
            className="flex-1 bg-transparent text-sm text-[#0b1c30] placeholder-[#777587] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#777587] hover:text-[#0b1c30]"
            >
              Limpar
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[#565e74] bg-white border border-[#c7c4d8] rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4 divide-y divide-[#f1f4fb]">
          {matchedDeals.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-[#777587] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#3525cd]" />
                <span>Negócios & Oportunidades ({matchedDeals.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDeals.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDealId(d.id);
                      setActiveTab('deal-details');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#eff4ff] cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#0b1c30] group-hover:text-[#3525cd]">
                        {d.organization} — {d.name}
                      </div>
                      <div className="text-[11px] text-[#565e74]">
                        {d.stage} • R$ {d.value.toLocaleString('pt-BR')} ({d.probability}%)
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#777587] group-hover:text-[#3525cd] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedContacts.length > 0 && (
            <div className="pt-3">
              <div className="text-[10px] font-bold text-[#777587] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#3525cd]" />
                <span>Contatos & Decisores ({matchedContacts.length})</span>
              </div>
              <div className="space-y-1">
                {matchedContacts.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedContactId(c.id);
                      setActiveTab('contacts');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#eff4ff] cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#0b1c30] group-hover:text-[#3525cd]">
                        {c.name} ({c.role})
                      </div>
                      <div className="text-[11px] text-[#565e74]">
                        {c.company} • {c.email}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#777587] group-hover:text-[#3525cd] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedTasks.length > 0 && (
            <div className="pt-3">
              <div className="text-[10px] font-bold text-[#777587] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3525cd]" />
                <span>Tarefas Agendadas ({matchedTasks.length})</span>
              </div>
              <div className="space-y-1">
                {matchedTasks.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#eff4ff] cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#0b1c30] group-hover:text-[#3525cd]">
                        {t.title} — {t.company}
                      </div>
                      <div className="text-[11px] text-[#565e74]">
                        Horário: {t.time} • {t.meta}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#777587] group-hover:text-[#3525cd] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedDeals.length === 0 && matchedContacts.length === 0 && matchedTasks.length === 0 && (
            <div className="p-8 text-center text-xs text-[#777587]">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
