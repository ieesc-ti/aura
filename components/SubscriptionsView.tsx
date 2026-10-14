'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { ClientSubscription, LandingPlan } from '@/lib/types';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Pencil,
  Trash2,
  Globe,
  Users,
  Check,
  X,
  Layers,
} from 'lucide-react';

export function SubscriptionsView() {
  const {
    subscriptions,
    addSubscription,
    landingPlans,
    saveLandingPlan,
    deleteLandingPlan,
    setActiveTab,
  } = useCRM();

  // Active view tab: Subscribers vs Plans Catalog
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'catalog'>('subscribers');

  // Modal: New Client Subscription
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [planId, setPlanId] = useState(landingPlans[0]?.id || 'plan-selo');
  const [monthlyValue, setMonthlyValue] = useState(String(landingPlans[0]?.price || 149));

  // Modal: Create / Edit Plan in Catalog
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<LandingPlan> | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [deletePlanConfirmId, setDeletePlanConfirmId] = useState<string | null>(null);

  const totalMRR = subscriptions
    .filter((s) => s.status === 'Ativa')
    .reduce((sum, s) => sum + s.monthlyValue, 0);

  // Active plans available
  const availablePlans = landingPlans.filter((p) => p.active !== false);

  // Handle create client subscription
  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !email) return;

    const matchedPlan = landingPlans.find((p) => p.id === planId) || landingPlans[0];
    const planLabel = matchedPlan ? matchedPlan.name : 'Plano Personalizado';

    addSubscription({
      clientName,
      email,
      planName: planLabel,
      status: 'Ativa',
      monthlyValue: parseFloat(monthlyValue) || (matchedPlan ? matchedPlan.price : 149),
      nextBillingDate: '2024-11-05',
      registeredTracksCount: 1,
    });

    setIsModalOpen(false);
    setClientName('');
    setEmail('');
  };

  // Open modal to create a new plan
  const handleOpenNewPlan = () => {
    setEditingPlan({
      name: '',
      tagline: '',
      price: 99,
      period: '/mês',
      description: '',
      features: ['Até 10 ISRCs mensais', 'Split Sheets com validade jurídica', 'Homologação ECAD'],
      popular: false,
      popularBadge: 'RECOMENDADO',
      buttonText: 'Contratar Plano',
      buttonVariant: 'primary',
      active: true,
    });
    setNewFeatureText('');
    setIsPlanModalOpen(true);
  };

  // Open modal to edit existing plan
  const handleOpenEditPlan = (plan: LandingPlan) => {
    setEditingPlan({ ...plan, features: [...(plan.features || [])] });
    setNewFeatureText('');
    setIsPlanModalOpen(true);
  };

  // Handle plan save
  const handleSavePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.name) return;

    saveLandingPlan({
      ...editingPlan,
      price: Number(editingPlan.price) || 0,
      features: editingPlan.features && editingPlan.features.length > 0
        ? editingPlan.features
        : ['ISRCs Inclusos', 'Split Sheet Oficial'],
    });

    setIsPlanModalOpen(false);
    setEditingPlan(null);
  };

  // Add feature to current editing plan
  const handleAddFeature = () => {
    if (!newFeatureText.trim() || !editingPlan) return;
    const currentFeatures = editingPlan.features || [];
    setEditingPlan({
      ...editingPlan,
      features: [...currentFeatures, newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  // Remove feature
  const handleRemoveFeature = (index: number) => {
    if (!editingPlan?.features) return;
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Planos & Assinaturas Recorrentes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {subscriptions.length} assinantes • {landingPlans.length} planos no catálogo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle de mensalidades de clientes e cadastro de planos sincronizados com a Landing Page pública
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('landing-admin')}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gestão da Landing Page</span>
          </button>

          {activeSubTab === 'subscribers' ? (
            <button
              onClick={() => {
                if (landingPlans.length > 0) {
                  setPlanId(landingPlans[0].id);
                  setMonthlyValue(String(landingPlans[0].price));
                }
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Assinatura</span>
            </button>
          ) : (
            <button
              onClick={handleOpenNewPlan}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Plano</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('subscribers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'subscribers'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Assinantes & Clientes ({subscriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Cadastro de Planos (Landing & Comercial) ({landingPlans.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBSCRIBERS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-6">
          {/* MRR Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">
                Receita Mensal Recorrente (MRR)
              </span>
              <p className="text-3xl font-black mt-1">R$ {totalMRR.toLocaleString('pt-BR')}/mês</p>
              <p className="text-xs text-emerald-100 mt-1">
                Taxa de adimplência: 94% • Renovação automática via cartão ou Pix
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-emerald-200" />
              <div>
                <p className="text-xs text-emerald-100 font-semibold">Planos Ativos no Catálogo</p>
                <p className="text-base font-bold text-white">
                  {availablePlans.length} planos exibidos na Landing Page
                </p>
              </div>
            </div>
          </div>

          {/* Subscriptions List: Mobile Cards + Desktop Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-slate-100">
              {subscriptions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Nenhuma assinatura cadastrada no momento.
                </div>
              ) : (
                subscriptions.map((sub) => (
                  <div key={sub.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                    {/* Header: Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-sm truncate">{sub.clientName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{sub.email}</p>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          sub.status === 'Ativa'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    {/* Plan & Monthly fee */}
                    <div className="bg-slate-50/80 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Plano Contratado
                        </span>
                        <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                          {sub.planName}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Mensalidade
                        </span>
                        <p className="font-black text-slate-900 text-base leading-tight">
                          R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                          <span className="text-[10px] text-slate-400 font-normal">/mês</span>
                        </p>
                      </div>
                    </div>

                    {/* Footer: Next billing & tracks */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                      <span className="text-[11px]">
                        Vencimento:{' '}
                        <strong className="font-mono text-slate-700">{sub.nextBillingDate}</strong>
                      </span>
                      <span className="font-semibold text-slate-700 text-[11px]">
                        {sub.registeredTracksCount} faixas inclusas
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Cliente / Artista</th>
                    <th className="px-5 py-3">Plano</th>
                    <th className="px-5 py-3">Mensalidade</th>
                    <th className="px-5 py-3">Próximo Vencimento</th>
                    <th className="px-5 py-3">Faixas Inclusas</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{sub.clientName}</p>
                        <p className="text-[11px] text-slate-400">{sub.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                          {sub.planName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-black text-slate-900 whitespace-nowrap">
                        R$ {sub.monthlyValue.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {sub.nextBillingDate}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-700 whitespace-nowrap">
                        {sub.registeredTracksCount} faixas
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            sub.status === 'Ativa'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANS CATALOG (CADASTRO DE PLANOS) */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-950">
                  Sincronização Automática com a Landing Page
                </h3>
                <p className="text-xs text-indigo-700/80 mt-0.5 leading-relaxed">
                  Todos os planos ativados neste catálogo aparecem em tempo real na seção de Preços da Landing Page pública. Você pode adicionar planos, alterar preços, atualizar benefícios e definir o plano de destaque.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenNewPlan}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Plano</span>
            </button>
          </div>

          {/* Grid of Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landingPlans.map((plan) => {
              const isActive = plan.active !== false;
              const isPopular = Boolean(plan.popular);
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between gap-5 relative shadow-xs ${
                    isPopular
                      ? 'border-2 border-indigo-600 ring-4 ring-indigo-50'
                      : isActive
                      ? 'border-slate-200'
                      : 'border-dashed border-slate-300 opacity-60 bg-slate-50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {plan.popularBadge || 'MAIS POPULAR'}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {plan.name}
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-black text-slate-900">R$ {plan.price}</span>
                          <span className="text-xs text-slate-500 font-medium">{plan.period || '/mês'}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isActive ? 'Ativo no Site' : 'Oculto'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {plan.tagline || plan.description}
                    </p>

                    {/* Features list */}
                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Benefícios Inclusos ({plan.features?.length || 0})
                      </span>
                      {(plan.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Toggles */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => {
                            saveLandingPlan({ id: plan.id, active: e.target.checked });
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Exibir na Landing</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={isPopular}
                          onChange={(e) => {
                            saveLandingPlan({ id: plan.id, popular: e.target.checked });
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Destacar</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenEditPlan(plan)}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar Plano</span>
                      </button>

                      <button
                        onClick={() => setDeletePlanConfirmId(plan.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Excluir Plano"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Nova Assinatura com Planos Dinâmicos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Adicionar Assinante</h2>
            <p className="text-xs text-slate-500 mb-4">
              Selecione o plano desejado do catálogo comercial para vincular ao cliente.
            </p>

            <form onSubmit={handleCreateSubscription} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Cliente / Artista / Selo *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Selo Tropicalia ou João Silva"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@tropicalia.com"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plano do Catálogo
                </label>
                <select
                  value={planId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setPlanId(selectedId);
                    const matched = landingPlans.find((p) => p.id === selectedId);
                    if (matched) {
                      setMonthlyValue(String(matched.price));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  {landingPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - R$ {p.price}{p.period || '/mês'} {p.active === false ? '(Oculto na Landing)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Valor da Mensalidade (R$)
                </label>
                <input
                  type="number"
                  required
                  value={monthlyValue}
                  onChange={(e) => setMonthlyValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Ativar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Criar / Editar Plano do Catálogo */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingPlan.id ? 'Editar Plano de Assinatura' : 'Novo Plano de Assinatura'}
                </h2>
                <p className="text-xs text-slate-400">
                  Configurações exibidas no site e no catálogo do CRM
                </p>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlanSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nome do Plano * (ex: COMPOSITOR INDEPENDENTE)
                </label>
                <input
                  type="text"
                  required
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="Nome do plano"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price || 0}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, price: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Periodicidade</label>
                  <input
                    type="text"
                    value={editingPlan.period || '/mês'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                    placeholder="/mês, /ano"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tagline / Resumo (Frase curta abaixo do título)
                </label>
                <input
                  type="text"
                  value={editingPlan.tagline || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, tagline: e.target.value })}
                  placeholder="Ex: Para artistas e autores que lançam singles pontuais."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Benefícios / Features do Plano
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {(editingPlan.features || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                        title="Remover benefício"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Adicionar novo benefício..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Popular flag & badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={Boolean(editingPlan.popular)}
                    onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Destacar como "Mais Popular" na Landing Page</span>
                </label>

                {editingPlan.popular && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Texto do Selo de Destaque
                    </label>
                    <input
                      type="text"
                      value={editingPlan.popularBadge || ''}
                      onChange={(e) =>
                        setEditingPlan({ ...editingPlan, popularBadge: e.target.value })
                      }
                      placeholder="Ex: MAIS POPULAR • SELOS & ESTÚDIOS"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>

              {/* CTA text & Active toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Texto do Botão CTA</label>
                  <input
                    type="text"
                    value={editingPlan.buttonText || 'Contratar Plano'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, buttonText: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editingPlan.active !== false}
                      onChange={(e) => setEditingPlan({ ...editingPlan, active: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Ativo na Landing Page</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletePlanConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Excluir Plano do Catálogo?</h3>
            <p className="text-xs text-slate-500">
              Este plano não será mais exibido na Landing Page e não estará disponível para novas assinaturas.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletePlanConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteLandingPlan(deletePlanConfirmId);
                  setDeletePlanConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
