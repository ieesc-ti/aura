'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { LandingService, LandingFaq } from '@/lib/types';
import {
  Globe,
  Sparkles,
  Layers,
  HelpCircle,
  CreditCard,
  Music2,
  CheckCircle2,
  Save,
  RotateCcw,
  ExternalLink,
  Sun,
  Moon,
  Plus,
  Trash2,
  Disc3,
  FileText,
  DollarSign,
  TrendingUp,
  Radio,
  Eye,
  ArrowRight,
} from 'lucide-react';

export function LandingPageAdminView() {
  const {
    landingConfig,
    updateLandingConfig,
    landingPlans,
    saveLandingPlan,
    landingTheme,
    toggleLandingTheme,
    resetLandingConfigToDefault,
    goToLandingPage,
    setActiveTab,
  } = useCRM();

  // Local draft state for editing with save/cancel feedback
  const [activeSection, setActiveSection] = useState<
    'hero' | 'metrics' | 'services' | 'steps' | 'plans' | 'faqs' | 'cta'
  >('hero');

  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // New FAQ form state
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [showAddFaq, setShowAddFaq] = useState(false);

  // New Service form state
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceLink, setNewServiceLink] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('music');

  const notifySave = (msg = 'Alterações salvas com sucesso!') => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Deseja restaurar todos os textos e configurações da landing page para os padrões originais do Aura HUB?'
      )
    ) {
      resetLandingConfigToDefault();
      notifySave('Configurações originais restauradas!');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Gestão da Landing Page Pública
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle dinâmico de todos os textos, serviços, métricas, fonogramas, planos e tira-dúvidas do site
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleLandingTheme}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition cursor-pointer"
            title="Alternar tema padrão da landing page"
          >
            {landingTheme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Tema: Modo Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Tema: Modo Claro</span>
              </>
            )}
          </button>

          {/* Reset Defaults */}
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition cursor-pointer"
            title="Restaurar textos padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          {/* View Landing Page Button */}
          <button
            onClick={goToLandingPage}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visualizar Landing Page</span>
          </button>
        </div>
      </div>

      {/* Sections Nav */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        {[
          { key: 'hero', label: '1. Topo & Hero', icon: Sparkles },
          { key: 'metrics', label: '2. Métricas de Impacto', icon: TrendingUp },
          { key: 'services', label: '3. Serviços de Registro', icon: Music2 },
          { key: 'steps', label: '4. Como Funciona', icon: Layers },
          { key: 'plans', label: '5. Planos & Preços', icon: CreditCard },
          { key: 'faqs', label: '6. Tira-Dúvidas (FAQ)', icon: HelpCircle },
          { key: 'cta', label: '7. Chamada Final (CTA)', icon: ArrowRight },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. HERO SECTION */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Textos Principais da Seção Hero
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selo Superior (Badge da Hero)
                </label>
                <input
                  type="text"
                  value={landingConfig.heroBadge}
                  onChange={(e) => updateLandingConfig({ heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título Principal (Primeira Parte)
                </label>
                <input
                  type="text"
                  value={landingConfig.heroTitle}
                  onChange={(e) => updateLandingConfig({ heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Palavra em Destaque (Grifada)
                </label>
                <input
                  type="text"
                  value={landingConfig.heroHighlight}
                  onChange={(e) => updateLandingConfig({ heroHighlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-indigo-700 font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo Explicativo da Hero
                </label>
                <textarea
                  rows={3}
                  value={landingConfig.heroSubtitle}
                  onChange={(e) => updateLandingConfig({ heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>

          {/* Hero Demo Phonogram Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Cartão Interativo do Fonograma Demonstrativo (Lado Direito da Hero)</span>
              <span className="text-xs font-normal text-slate-400">Exibido na prévia da Landing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Música</label>
                <input
                  type="text"
                  value={landingConfig.heroTrack.title}
                  onChange={(e) =>
                    updateLandingConfig({
                      heroTrack: { ...landingConfig.heroTrack, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Álbum & Artista</label>
                <input
                  type="text"
                  value={landingConfig.heroTrack.album}
                  onChange={(e) =>
                    updateLandingConfig({
                      heroTrack: { ...landingConfig.heroTrack, album: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status da Homologação</label>
                <input
                  type="text"
                  value={landingConfig.heroTrack.status}
                  onChange={(e) =>
                    updateLandingConfig({
                      heroTrack: { ...landingConfig.heroTrack, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Código ISRC</label>
                <input
                  type="text"
                  value={landingConfig.heroTrack.isrc}
                  onChange={(e) =>
                    updateLandingConfig({
                      heroTrack: { ...landingConfig.heroTrack, isrc: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Código ISWC (Obra)</label>
                <input
                  type="text"
                  value={landingConfig.heroTrack.iswc}
                  onChange={(e) =>
                    updateLandingConfig({
                      heroTrack: { ...landingConfig.heroTrack, iswc: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Royalties Rastreados (R$)</label>
                <input
                  type="number"
                  value={landingConfig.heroTrack.royaltiesTracked}
                  onChange={(e) =>
                    updateLandingConfig({
                      heroTrack: {
                        ...landingConfig.heroTrack,
                        royaltiesTracked: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. METRICS SECTION */}
      {activeSection === 'metrics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Métricas & Indicadores de Confiança</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Estes números aparecem logo abaixo da seção Hero na landing page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(landingConfig.metrics || []).map((metric, idx) => (
              <div key={metric.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Cartão {idx + 1}</span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Valor / Número</label>
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => {
                      const updated = [...landingConfig.metrics];
                      updated[idx] = { ...updated[idx], value: e.target.value };
                      updateLandingConfig({ metrics: updated });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Rótulo / Descrição</label>
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => {
                      const updated = [...landingConfig.metrics];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      updateLandingConfig({ metrics: updated });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SERVICES SECTION */}
      {activeSection === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Cabeçalho da Seção de Serviços
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção</label>
                <input
                  type="text"
                  value={landingConfig.servicesTitle}
                  onChange={(e) => updateLandingConfig({ servicesTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo da Seção</label>
                <input
                  type="text"
                  value={landingConfig.servicesSubtitle}
                  onChange={(e) => updateLandingConfig({ servicesSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Cartões de Serviços Exibidos ({landingConfig.services.length})</h2>
                <p className="text-xs text-slate-400">Edite os títulos, descrições e selos de cada serviço</p>
              </div>
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Serviço</span>
              </button>
            </div>

            {/* Add Service Subform */}
            {showAddService && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-indigo-900">Novo Serviço na Landing Page</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Título do Serviço</label>
                    <input
                      type="text"
                      placeholder="Ex: Registro Internacional de Catálogo"
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Ícone</label>
                    <select
                      value={newServiceIcon}
                      onChange={(e) => setNewServiceIcon(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="music">Música (ISWC)</option>
                      <option value="disc">Disco / Fonograma (ISRC)</option>
                      <option value="file-text">Split Sheet / Contrato</option>
                      <option value="radio">Rádio / ECAD</option>
                      <option value="dollar-sign">Sincronização & Sync</option>
                      <option value="trending-up">Streaming & Auditoria</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      placeholder="Explique o que este serviço resolve para o cliente..."
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Texto do Link / Selo</label>
                    <input
                      type="text"
                      placeholder="Ex: Homologado oficialmente ✓"
                      value={newServiceLink}
                      onChange={(e) => setNewServiceLink(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddService(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (!newServiceTitle) return;
                      const newSrv: LandingService = {
                        id: `srv-${Date.now()}`,
                        number: String(landingConfig.services.length + 1),
                        title: newServiceTitle,
                        description: newServiceDesc,
                        linkText: newServiceLink || 'Saiba mais ✓',
                        iconName: newServiceIcon,
                      };
                      updateLandingConfig({
                        services: [...landingConfig.services, newSrv],
                      });
                      setNewServiceTitle('');
                      setNewServiceDesc('');
                      setNewServiceLink('');
                      setShowAddService(false);
                      notifySave('Serviço adicionado com sucesso!');
                    }}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Salvar Serviço
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(landingConfig.services || []).map((srv, idx) => (
                <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-indigo-600">Serviço #{idx + 1}</span>
                    <button
                      onClick={() => {
                        if (landingConfig.services.length <= 1) return;
                        updateLandingConfig({
                          services: landingConfig.services.filter((s) => s.id !== srv.id),
                        });
                        notifySave('Serviço removido!');
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Excluir serviço"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Título</label>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => {
                        const copy = [...landingConfig.services];
                        copy[idx] = { ...copy[idx], title: e.target.value };
                        updateLandingConfig({ services: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => {
                        const copy = [...landingConfig.services];
                        copy[idx] = { ...copy[idx], description: e.target.value };
                        updateLandingConfig({ services: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Texto de Destaque / Selo</label>
                    <input
                      type="text"
                      value={srv.linkText}
                      onChange={(e) => {
                        const copy = [...landingConfig.services];
                        copy[idx] = { ...copy[idx], linkText: e.target.value };
                        updateLandingConfig({ services: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-indigo-600 font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. STEPS SECTION */}
      {activeSection === 'steps' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Cabeçalho do Fluxo "Como Funciona"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção</label>
                <input
                  type="text"
                  value={landingConfig.stepsTitle}
                  onChange={(e) => updateLandingConfig({ stepsTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo da Seção</label>
                <input
                  type="text"
                  value={landingConfig.stepsSubtitle}
                  onChange={(e) => updateLandingConfig({ stepsSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              As 4 Etapas do Processo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(landingConfig.steps || []).map((step, idx) => (
                <div key={step.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <span className="font-mono text-xl font-black text-indigo-400 block">{step.step}</span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Título da Etapa</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const copy = [...landingConfig.steps];
                        copy[idx] = { ...copy[idx], title: e.target.value };
                        updateLandingConfig({ steps: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      value={step.description}
                      onChange={(e) => {
                        const copy = [...landingConfig.steps];
                        copy[idx] = { ...copy[idx], description: e.target.value };
                        updateLandingConfig({ steps: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. PLANS SECTION */}
      {activeSection === 'plans' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Seção de Planos de Assinatura</h2>
                <p className="text-xs text-slate-500">
                  Os planos exibidos na landing page refletem o Cadastro de Planos do CRM.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('subscriptions')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Abrir Cadastro Completo de Planos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção de Planos</label>
                <input
                  type="text"
                  value={landingConfig.plansTitle}
                  onChange={(e) => updateLandingConfig({ plansTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo da Seção</label>
                <input
                  type="text"
                  value={landingConfig.plansSubtitle}
                  onChange={(e) => updateLandingConfig({ plansSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Plan List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Planos Cadastrados ({landingPlans.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {landingPlans.map((plan) => {
                const isActive = plan.active !== false;
                return (
                  <div
                    key={plan.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isActive
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-slate-100/60 border-dashed border-slate-300 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {plan.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isActive ? 'Ativo no Site' : 'Oculto'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">R$ {plan.price}</span>
                        <span className="text-xs text-slate-400">{plan.period || '/mês'}</span>
                      </div>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {plan.tagline || plan.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1">
                        {(plan.features || []).slice(0, 3).map((f, i) => (
                          <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => {
                            saveLandingPlan({ id: plan.id, active: e.target.checked });
                            notifySave(
                              e.target.checked
                                ? `Plano ${plan.name} ativado no site!`
                                : `Plano ${plan.name} ocultado da landing page.`
                            );
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Exibir no Site</span>
                      </label>

                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        Editar detalhes →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. FAQS SECTION */}
      {activeSection === 'faqs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Cabeçalho do Tira-Dúvidas (FAQ)
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título da Seção de Dúvidas</label>
              <input
                type="text"
                value={landingConfig.faqsTitle}
                onChange={(e) => updateLandingConfig({ faqsTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* FAQ Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Perguntas & Respostas ({landingConfig.faqs.length})</h2>
                <p className="text-xs text-slate-400">Gerencie as dúvidas frequentes exibidas aos visitantes</p>
              </div>
              <button
                onClick={() => setShowAddFaq(!showAddFaq)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Pergunta</span>
              </button>
            </div>

            {/* Add FAQ form */}
            {showAddFaq && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-indigo-900">Nova Dúvida Frequente</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pergunta</label>
                  <input
                    type="text"
                    placeholder="Ex: Como é feito o repasse dos royalties?"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Resposta</label>
                  <textarea
                    rows={3}
                    placeholder="Escreva a resposta clara e objetiva para o cliente..."
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddFaq(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (!newFaqQuestion || !newFaqAnswer) return;
                      const newF: LandingFaq = {
                        id: `faq-${Date.now()}`,
                        question: newFaqQuestion,
                        answer: newFaqAnswer,
                      };
                      updateLandingConfig({
                        faqs: [...landingConfig.faqs, newF],
                      });
                      setNewFaqQuestion('');
                      setNewFaqAnswer('');
                      setShowAddFaq(false);
                      notifySave('Pergunta adicionada com sucesso!');
                    }}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Salvar Pergunta
                  </button>
                </div>
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
              {(landingConfig.faqs || []).map((faq, idx) => (
                <div key={faq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-indigo-600">Pergunta #{idx + 1}</span>
                    <button
                      onClick={() => {
                        if (landingConfig.faqs.length <= 1) return;
                        updateLandingConfig({
                          faqs: landingConfig.faqs.filter((f) => f.id !== faq.id),
                        });
                        notifySave('Pergunta removida!');
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Excluir pergunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const copy = [...landingConfig.faqs];
                        copy[idx] = { ...copy[idx], question: e.target.value };
                        updateLandingConfig({ faqs: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const copy = [...landingConfig.faqs];
                        copy[idx] = { ...copy[idx], answer: e.target.value };
                        updateLandingConfig({ faqs: copy });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. CTA BANNER SECTION */}
      {activeSection === 'cta' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Banner de Chamada Final (Pré-Footer)
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Título da Chamada</label>
            <input
              type="text"
              value={landingConfig.ctaTitle}
              onChange={(e) => updateLandingConfig({ ctaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo Explicativo</label>
            <textarea
              rows={2}
              value={landingConfig.ctaSubtitle}
              onChange={(e) => updateLandingConfig({ ctaSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
