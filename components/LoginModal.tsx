'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { SupabaseService } from '@/lib/supabaseService';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Key,
  Loader2,
  Database,
  CheckCircle2,
} from 'lucide-react';

export function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, goToApp, switchUser, users, saveUser, loginWithUser } = useCRM();

  // Inputs strictly empty by default (no fixed person suggested)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegisteredHints, setShowRegisteredHints] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setError(null);
    setLoading(false);
    setEmail('');
    setPassword('');
    setIsLoginModalOpen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetEmail = (email || '').toLowerCase().trim();
    const targetPass = (password || '').trim();

    if (!targetEmail) {
      setError('Por favor, informe o e-mail cadastrado.');
      return;
    }

    if (!targetPass) {
      setError('Por favor, informe sua senha de acesso.');
      return;
    }

    setLoading(true);

    try {
      // 1. Validação diretamente no Supabase
      const sbResult = await SupabaseService.authenticateUser(targetEmail, targetPass);

      if (sbResult.success && sbResult.user) {
        // Usuário validado com sucesso no Supabase!
        loginWithUser(sbResult.user);
        setIsLoginModalOpen(false);
        setEmail('');
        setPassword('');
        setLoading(false);
        return;
      }

      // Se o Supabase retornou um erro específico de senha incorreta ou usuário inativo
      if (
        sbResult.message &&
        sbResult.message !== 'Usuário não cadastrado no banco de dados.' &&
        sbResult.message !== 'Supabase não está configurado. Insira a URL e Anon Key.'
      ) {
        setError(sbResult.message);
        setLoading(false);
        return;
      }

      // 2. Se o Supabase não possui o usuário ou está desconectado, valida na base de usuários cadastrados
      const matched = (users || []).find(
        (u) => (u.email || '').toLowerCase().trim() === targetEmail
      );

      if (!matched) {
        setError(
          'Usuário não cadastrado. Verifique o e-mail informado ou solicite acesso no Aura CRM.'
        );
        setLoading(false);
        return;
      }

      // Validação de senha
      const expectedPass = matched.password || '123';
      if (targetPass !== expectedPass) {
        setError('Senha incorreta. Verifique suas credenciais de acesso.');
        setLoading(false);
        return;
      }

      if (matched.active === false) {
        setError('Este usuário está inativo no sistema. Entre em contato com o suporte ou administrador.');
        setLoading(false);
        return;
      }

      // Autenticação local bem sucedida
      setError(null);
      loginWithUser(matched);
      setIsLoginModalOpen(false);
      setEmail('');
      setPassword('');
      setLoading(false);
    } catch (err: any) {
      console.error('[Login] Validation error:', err);
      setError('Ocorreu um erro ao verificar as credenciais. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Entrar no Aura CRM
              </h2>
              <p className="text-xs text-slate-500">Validação segura de acesso e governança</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-in shake duration-150">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              E-mail Cadastrado *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                disabled={loading}
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Senha de Acesso *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                disabled={loading}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Validando credenciais...</span>
              </>
            ) : (
              <>
                <span>Acessar Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Helper: Contas cadastradas no sistema */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => setShowRegisteredHints(!showRegisteredHints)}
            className="text-[11px] text-slate-400 hover:text-indigo-600 font-semibold transition cursor-pointer"
          >
            {showRegisteredHints ? 'Ocultar contas disponíveis' : 'Ver contas cadastradas para teste'}
          </button>

          {showRegisteredHints && (
            <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1.5 max-h-36 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Clique para preencher (senha padrão: 123):
              </p>
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword(u.password || '123');
                    setError(null);
                  }}
                  className="w-full p-1.5 hover:bg-white rounded-lg flex items-center justify-between text-xs text-slate-700 transition cursor-pointer"
                >
                  <span className="font-medium text-slate-900">{u.name}</span>
                  <span className="text-[10px] text-indigo-600">{u.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
