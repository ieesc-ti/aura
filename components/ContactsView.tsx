'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Contact } from '@/lib/types';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Building,
  Search,
  ExternalLink,
  MoreVertical,
  Briefcase,
} from 'lucide-react';

export function ContactsView() {
  const { contacts, setIsNewContactModalOpen } = useCRM();
  const [search, setSearch] = useState('');

  const filteredContacts = (contacts || []).filter((c) => {
    const s = (search || '').toLowerCase().trim();
    if (!s) return true;
    return (
      (c.name || '').toLowerCase().includes(s) ||
      (c.organization || '').toLowerCase().includes(s) ||
      (c.email || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Contatos & Clientes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredContacts.length} contatos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Artistas, produtores, editoras, supervisores musicais e gravadoras cadastradas
          </p>
        </div>

        <button
          onClick={() => setIsNewContactModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Contato</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou organização..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{contact.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{contact.role}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    contact.status === 'Ativo'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {contact.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.organization}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.phone}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Contratos
                </span>
                <span className="font-bold text-slate-900">{contact.dealCount} ativos</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Volume Total
                </span>
                <span className="font-black text-indigo-600">
                  R$ {contact.totalValue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
