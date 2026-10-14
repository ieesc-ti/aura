import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, LogIn, Lock, Mail, Shield, Check, AlertCircle } from 'lucide-react';

export function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, loginUser, goToAdminPanel } = useCRM();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLoginForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = loginUser(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      setLoading(false);
    } else {
      setSuccessMsg('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        setIsLoginModalOpen(false);
        goToAdminPanel();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e5eeff] w-full max-w-md overflow-hidden text-left animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3525cd] to-[#4f46e5] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0b1c30]">Acesso • Aura HUB</h2>
              <p className="text-[11px] text-[#565e74]">Portal do Usuário & Gestão Musical</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Banner / Área de Imagem customizável */}
          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-5 bg-[#0b1c30] border border-[#e5eeff] shadow-inner flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop"
              alt="Aura HUB Banner"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30] via-[#0b1c30]/40 to-transparent flex flex-col justify-end p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-indigo-400" />
                Ambiente Seguro
              </span>
              <p className="text-sm font-bold text-white tracking-tight">
                Aura HUB Management
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">
                E-mail Corporativo ou Artístico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777587] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: seuemail@aurahub.com.br"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777587] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#3525cd] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#3525cd] hover:bg-[#2e1fb5] disabled:opacity-60 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Validando credenciais...' : 'Entrar no Aura HUB'}</span>
              </button>
            </div>
          </form>

          <div className="mt-4 pt-3 border-t border-[#e5eeff] text-center">
            <p className="text-[11px] text-[#777587]">
              Acesso exclusivo para associados, autores e equipe administrativa Aura HUB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
