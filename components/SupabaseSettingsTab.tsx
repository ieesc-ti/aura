'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseConfig, saveSupabaseConfig } from '@/lib/supabase';
import { SupabaseService } from '@/lib/supabaseService';
import { Database, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Globe } from 'lucide-react';

export function SupabaseSettingsTab() {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [source, setSource] = useState<'env' | 'custom' | 'none'>('none');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setUrl(config.url);
    setAnonKey(config.anonKey);
    setSource(config.source);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, anonKey);
    setSavedSuccess(true);
    setTestResult(null);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await SupabaseService.testConnection();
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Integração Supabase Cloud</h2>
          <p className="text-xs text-slate-500">
            Conecte seu banco de dados PostgreSQL do Supabase para sincronização em tempo real
          </p>
        </div>
      </div>

      {source === 'env' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Configuração carregada das variáveis de ambiente (.env).</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Credenciais salvas com sucesso no navegador!</span>
        </div>
      )}

      {testResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            testResult.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Project URL</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Anon / Public API Key</label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Salvar Configurações
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !url}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testando...' : 'Testar Conexão'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
