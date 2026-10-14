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
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  TrendingUp,
  Sun,
  Moon,
  ExternalLink,
  Shield,
  Layers,
  HelpCircle,
  Headphones,
} from 'lucide-react';

export function MusicLandingPage() {
  const {
    goToApp,
    setIsLoginModalOpen,
    isLoggedIn,
    currentUser,
    logout,
    landingConfig,
    landingPlans,
    landingTheme,
    toggleLandingTheme,
    setIsQuoteModalOpen,
  } = useCRM();

  // FAQ accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const isDark = landingTheme === 'dark';

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const activePlans = (landingPlans || []).filter((p) => p.active !== false);

  // Icon mapping helper for services
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'disc':
        return <Disc3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'radio':
        return <Radio className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'dollar-sign':
        return <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'music':
      default:
        return <Music2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white ${
        isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#f8f9ff] text-slate-900'
      }`}
    >
      {/* 1. Header Navigation */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#070b14]/90 border-slate-800/80 text-white'
            : 'bg-white/90 border-slate-200/80 text-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight">Aura HUB</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#servicos" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Serviços de Registro
            </a>
            <a href="#como-funciona" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Como Funciona
            </a>
            <a href="#planos" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Planos
            </a>
            <a href="#duvidas" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Dúvidas
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleLandingTheme}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-indigo-50/80 border-indigo-100 text-indigo-700 hover:bg-indigo-100'
              }`}
              title="Alternar Modo Claro / Escuro"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Modo Suave</span>
                </>
              )}
            </button>

            {/* Admin Panel button */}
            {isLoggedIn && currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToApp}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ir para o Painel Administrativo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-800">
                  {currentUser.name?.slice(0, 2).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ir para o Painel Administrativo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  AU
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (7 cols): Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{landingConfig.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.15]">
              {landingConfig.heroTitle}{' '}
              <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-600 underline-offset-4">
                {landingConfig.heroHighlight}
              </span>
              , Emissão de ISRC e Proteção de Autoria.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {landingConfig.heroSubtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={goToApp}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Acessar Painel Administrativo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className={`px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Music2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>+ Nova Cotação</span>
              </button>
            </div>

            {/* Trust Checks row */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Homologado ECAD & UBC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Padrão ISRC Internacional (IFPI)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Split Sheets com Validade Jurídica</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Active Track Preview Card */}
          <div className="lg:col-span-5">
            <div
              className={`rounded-3xl p-6 sm:p-7 border shadow-xl transition-all relative ${
                isDark
                  ? 'bg-slate-900/95 border-slate-800 text-white shadow-indigo-950/40'
                  : 'bg-white border-slate-200/90 text-slate-800 shadow-xl shadow-slate-200/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                  Fonograma em Gestão Ativa
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {landingConfig.heroTrack.status}
                </span>
              </div>

              {/* Title & Album */}
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {landingConfig.heroTrack.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {landingConfig.heroTrack.album}
                </p>
              </div>

              {/* Codes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Código ISRC</span>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {landingConfig.heroTrack.isrc}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Código ISWC (Obra)</span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    {landingConfig.heroTrack.iswc}
                  </span>
                </div>
              </div>

              {/* Split Sheet Progress */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Divisão de Autoria & Split Sheet (100%)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Contrato Assinado</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: '50%' }} className="bg-indigo-600 h-full" />
                  <div style={{ width: '30%' }} className="bg-purple-500 h-full" />
                  <div style={{ width: '20%' }} className="bg-blue-400 h-full" />
                </div>

                {/* Split items */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    50% Autor (Edcarlos)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    30% Produtor
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    20% Intérprete
                  </span>
                </div>
              </div>

              {/* Bottom Royalties & Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Royalties Rastreados
                  </span>
                  <p className="font-black text-emerald-600 text-base sm:text-lg">
                    R$ {landingConfig.heroTrack.royaltiesTracked.toLocaleString('pt-BR')},00
                  </p>
                </div>

                <button
                  onClick={goToApp}
                  className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir no CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {(landingConfig.metrics || []).map((m) => (
            <div
              key={m.id}
              className={`p-6 rounded-2xl border transition-all text-center ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
              }`}
            >
              <p
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  m.id === 'm-2' ? 'text-emerald-600' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {m.value}
              </p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section: Serviços de Registro & Direitos */}
      <section
        id="servicos"
        className={`py-20 px-4 sm:px-8 border-t transition-colors ${
          isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50/70 border-slate-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
              Serviços de Registro & Direitos
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {landingConfig.servicesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {landingConfig.servicesSubtitle}
            </p>
          </div>

          {/* 6 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(landingConfig.services || []).map((srv) => (
              <div
                key={srv.id}
                className={`p-7 rounded-3xl border transition-all hover:shadow-lg hover:border-indigo-400 flex flex-col justify-between gap-5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center shadow-xs">
                    {getServiceIcon(srv.iconName)}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    {srv.linkText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Fluxo Simples e Transparente
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {landingConfig.stepsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {landingConfig.stepsSubtitle}
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(landingConfig.steps || []).map((st) => (
            <div
              key={st.id}
              className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
              }`}
            >
              <div className="text-3xl font-black text-indigo-600/30 dark:text-indigo-400/40 mb-3 font-mono">
                {st.step}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">
                {st.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section: Planos de Assinatura (DYNAMICALLY CONNECTED TO CRM PLAN CATALOG) */}
      <section
        id="planos"
        className={`py-20 px-4 sm:px-8 border-t transition-colors ${
          isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50/70 border-slate-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
              Planos para cada tamanho de catálogo
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {landingConfig.plansTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {landingConfig.plansSubtitle}
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {activePlans.map((plan) => {
              const isPopular = Boolean(plan.popular);
              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'border-2 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-600/10'
                      : 'border border-slate-200 dark:border-slate-800 shadow-xs'
                  } ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {plan.popularBadge || 'MAIS POPULAR • SELOS & ESTÚDIOS'}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                          R$ {plan.price}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {plan.period || '/mês'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {plan.tagline || plan.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                      {(plan.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25'
                          : isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{plan.buttonText || 'Contratar Plano'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Section: FAQ / Tira-Dúvidas */}
      <section id="duvidas" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
            Tira-Dúvidas
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {landingConfig.faqsTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {(landingConfig.faqs || []).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Pre-Footer Call to Action Banner */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div
          className={`rounded-3xl p-8 sm:p-14 text-center border shadow-xl relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-slate-800'
              : 'bg-gradient-to-b from-indigo-50/70 via-white to-white border-slate-200 shadow-xl shadow-slate-200/50'
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {landingConfig.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            {landingConfig.ctaSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={goToApp}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Entrar no Painel Administrativo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className={`px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer border ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Music2 className="w-4 h-4 text-indigo-600" />
              <span>+ Solicitar Nova Cotação</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer
        className={`border-t py-10 px-4 sm:px-8 text-xs transition-colors ${
          isDark ? 'bg-[#070b14] border-slate-800/80 text-slate-400' : 'bg-white border-slate-200/80 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Music2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Aura HUB • Gestão & Registro Musical</p>
              <p className="text-[10px] text-slate-400">Conforme a Lei nº 9.610/98 (Direitos Autorais do Brasil)</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button onClick={goToApp} className="hover:text-indigo-600 cursor-pointer">
              Acesso ao Sistema
            </button>
            <a href="#servicos" className="hover:text-indigo-600">
              Serviços
            </a>
            <a href="#planos" className="hover:text-indigo-600">
              Planos
            </a>
            <a href="#duvidas" className="hover:text-indigo-600">
              FAQ
            </a>
          </div>

          <div>
            <p>© {new Date().getFullYear()} Aura HUB. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
