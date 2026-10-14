'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { AppUser, UserRole } from '@/lib/types';
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/user-presets';
import { X, UserPlus, Users, Trash2 } from 'lucide-react';

export function UserManagementModal() {
  const {
    isUserManagementOpen,
    setIsUserManagementOpen,
    users,
    saveUser,
    deleteUser,
    accessProfiles,
  } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('artist');
  const [profileId, setProfileId] = useState('prof-artist');

  if (!isUserManagementOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    saveUser({
      name,
      email,
      role,
      profileId,
      permissions: DEFAULT_ROLE_PERMISSIONS[role],
      active: true,
    });

    setName('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Gerenciar Usuários</h2>
          </div>
          <button
            onClick={() => setIsUserManagementOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add user form */}
        <form onSubmit={handleAdd} className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
          <h3 className="text-xs font-bold text-slate-700">Adicionar Novo Membro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={role}
              onChange={(e) => {
                const r = e.target.value as UserRole;
                setRole(r);
                setProfileId(`prof-${r}`);
              }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            >
              <option value="admin">Administrador</option>
              <option value="manager">Gerente A&R</option>
              <option value="producer">Produtor</option>
              <option value="artist">Artista</option>
            </select>

            <button
              type="submit"
              className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              + Adicionar
            </button>
          </div>
        </form>

        {/* Users List */}
        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
          {users.map((u) => (
            <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{u.name}</p>
                <p className="text-[11px] text-slate-500">{u.email} • {u.role.toUpperCase()}</p>
              </div>
              {users.length > 1 && (
                <button
                  onClick={() => deleteUser(u.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
