'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { Contact } from '@/lib/types';
import { X, Mail, Phone, Building, Briefcase } from 'lucide-react';

interface ContactCrudModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactCrudModal({ contact, isOpen, onClose }: ContactCrudModalProps) {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-base font-bold text-slate-900">{contact.name}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 font-bold block">Função / Cargo</span>
            <p className="font-semibold text-slate-800">{contact.role}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold block">Empresa</span>
            <p className="font-semibold text-slate-800">{contact.organization}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold block">Email</span>
            <p className="font-semibold text-slate-800">{contact.email}</p>
          </div>
          <div>
            <span className="text-slate-400 font-bold block">Telefone</span>
            <p className="font-semibold text-slate-800">{contact.phone}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
