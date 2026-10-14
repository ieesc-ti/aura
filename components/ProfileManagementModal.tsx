'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, Shield } from 'lucide-react';
import { TAB_LABELS } from '@/lib/user-presets';

export function ProfileManagementModal() {
  const { isProfileManagementOpen, setIsProfileManagementOpen, accessProfiles } = useCRM();

  if (!isProfileManagementOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Perfis de Acesso & Permissões</h2>
          </div>
          <button
            onClick={() => setIsProfileManagementOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {accessProfiles.map((prof) => (
            <div key={prof.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs">{prof.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {prof.role.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{prof.description}</p>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Abas Acessíveis:</span>
                <div className="flex flex-wrap gap-1">
                  {prof.permissions.allowedTabs.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-[10px]"
                    >
                      {TAB_LABELS[t] || t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
