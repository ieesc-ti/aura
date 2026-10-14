'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, User, Building, Mail, Phone, Briefcase } from 'lucide-react';

export function NewContactModal() {
  const { isNewContactModalOpen, setIsNewContactModalOpen, addContact } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Artista / Compositor');
  const [organization, setOrganization] = useState('');

  if (!isNewContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addContact({
      name,
      email,
      phone: phone || '+55 11 99999-9999',
      role,
      organization: organization || 'Independente',
      dealCount: 0,
      totalValue: 0,
      status: 'Ativo',
    });

    setIsNewContactModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Novo Contato / Artista</h2>
          <button
            onClick={() => setIsNewContactModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Roberto Silva"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="roberto@email.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 11 98888-7777"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Papel</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Compositor, Produtor..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organização</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ex: Selo Independente"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewContactModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Salvar Contato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
