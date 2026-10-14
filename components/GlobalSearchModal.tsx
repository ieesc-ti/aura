'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Search, X, Kanban, Users, Music2, ArrowRight } from 'lucide-react';

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    deals,
    contacts,
    musicRegistrations,
    setSelectedDealId,
    setActiveTab,
  } = useCRM();

  const [term, setTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const t = (term || '').toLowerCase().trim();

  const matchedDeals = (deals || []).filter(
    (d) =>
      !t ||
      (d.name || '').toLowerCase().includes(t) ||
      (d.organization || '').toLowerCase().includes(t)
  );

  const matchedContacts = (contacts || []).filter(
    (c) =>
      !t ||
      (c.name || '').toLowerCase().includes(t) ||
      (c.email || '').toLowerCase().includes(t)
  );

  const matchedMusic = (musicRegistrations || []).filter(
    (m) =>
      !t ||
      (m.title || '').toLowerCase().includes(t) ||
      (m.artistName || '').toLowerCase().includes(t) ||
      ((m.isrcCode || '').toLowerCase().includes(t))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar por músicas, ISRC, artistas, propostas..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Músicas */}
          {matchedMusic.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                Catálogo & Músicas ({matchedMusic.length})
              </p>
              {matchedMusic.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveTab('music-registration');
                    setIsSearchOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Music2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-bold text-slate-900">{m.title}</p>
                      <p className="text-[10px] text-slate-400">{m.artistName} • {m.isrcCode || 'Sem ISRC'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600">Ver Obra →</span>
                </div>
              ))}
            </div>
          )}

          {/* Negócios */}
          {matchedDeals.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                Negócios & Contratos ({matchedDeals.length})
              </p>
              {matchedDeals.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDealId(d.id);
                    setActiveTab('deal-details');
                    setIsSearchOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Kanban className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-bold text-slate-900">{d.name}</p>
                      <p className="text-[10px] text-slate-400">{d.organization} • R$ {d.value.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600">Abrir →</span>
                </div>
              ))}
            </div>
          )}

          {/* Contatos */}
          {matchedContacts.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                Contatos ({matchedContacts.length})
              </p>
              {matchedContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveTab('contacts');
                    setIsSearchOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.role} • {c.organization}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">Ver Perfil →</span>
                </div>
              ))}
            </div>
          )}

          {matchedMusic.length === 0 && matchedDeals.length === 0 && matchedContacts.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              Nenhum resultado encontrado para &quot;{term}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
