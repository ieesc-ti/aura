'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import {
  Music2,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  LogIn,
  LogOut,
  Disc3,
  Globe,
  Radio,
  FileCheck,
} from 'lucide-react';

export function MusicLandingPage() {
  const {
    goToApp,
    setIsLoginModalOpen,
    addMusicRegistration,
    isLoggedIn,
    currentUser,
    logout,
  } = useCRM();

  // Quick register wizard
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardArtist, setWizardArtist] = useState('');
  const [wizardGenre, setWizardGenre] = useState('Pop / MPB');
  const [wizardRegistered, setWizardRegistered] = useState(false);

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardTitle || !wizardArtist) return;

    addMusicRegistration({
      title: wizardTitle,
      artistName: wizardArtist,
      genre: wizardGenre,
      releaseYear: new Date().getFullYear(),
      type: 'Single',
      status: 'ISRC Emitido',
      splits: [
        {
          id: 'sp-landing-1',
          name: wizardArtist,
          role: 'Compositor',
          percentage: 100,
          document: '000.000.000-00',
          email: 'artista@exemplo.com',
        },
      ],
    });

    setWizardRegistered(true);
    setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <nav className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-[#070b14]/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight">Aura</span>
            <span className="text-xs text-indigo-400 font-semibold tracking-wider block -mt-1 uppercase">
              Music Hub & CRM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Logged in User Badge */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {currentUser.name?.slice(0, 2).toUpperCase() || 'AU'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-indigo-400 capitalize">{currentUser.role}</p>
                </div>
              </div>

              {/* Direct Access to Dashboard */}
              <button
                onClick={goToApp}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Acessar Painel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Desconectar"
                className="p-2 bg-slate-900/90 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/80 hover:border-red-500/30 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:py-28 max-w-6xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Homologação ECAD Oficial & ISRC em Segundos</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6">
          Proteja suas músicas, emita seu{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ISRC e colete 100% dos seus royalties
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          O sistema completo para artistas, compositores e selos independentes. Emissão instantânea de
          ISRC brasileiro, divisão de split sheets e gestão de contratos comerciais.
        </p>

        {/* Quick Registration Card */}
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-left">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span>Registro Rápido de Obra Musical</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Preencha abaixo para gerar uma prévia imediata do seu ISRC e Certificado Oficial:
          </p>

          {wizardRegistered ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-white text-sm">Obra registrada com sucesso!</p>
              <p className="text-xs text-slate-300">Redirecionando para o seu painel de controle...</p>
            </div>
          ) : (
            <form onSubmit={handleQuickRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nome da Música / Fonograma
                </label>
                <input
                  type="text"
                  required
                  value={wizardTitle}
                  onChange={(e) => setWizardTitle(e.target.value)}
                  placeholder="Ex: Noite Estrelada"
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nome do Artista / Banda
                  </label>
                  <input
                    type="text"
                    required
                    value={wizardArtist}
                    onChange={(e) => setWizardArtist(e.target.value)}
                    placeholder="Ex: Seu Nome Artístico"
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Gênero</label>
                  <select
                    value={wizardGenre}
                    onChange={(e) => setWizardGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden"
                  >
                    <option value="Pop / MPB">Pop / MPB</option>
                    <option value="Rock / Indie">Rock / Indie</option>
                    <option value="Sertanejo">Sertanejo</option>
                    <option value="Trap / Rap">Trap / Rap</option>
                    <option value="Eletrônica">Eletrônica</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Registrar Obra & Emitir Certificado</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="px-6 py-16 border-t border-slate-800/80 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Homologação ECAD</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integração com bases do ECAD e Abramus, gerando códigos ISRC válidos internacionalmente
              para rádio, TV e plataformas digitais.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Split Sheets Jurídicas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Divisão exata de direitos autorais entre compositores, produtores e intérpretes com
              assinatura digital e certificação.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Inteligência Comercial</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CRM completo com IA integrada para criação de propostas de sincronização audiovisual e
              licenciamento de catálogo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Aura Music CRM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
