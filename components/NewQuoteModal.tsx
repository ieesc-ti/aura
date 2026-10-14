'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, Send, Music2, Sparkles, CheckCircle2 } from 'lucide-react';

export function NewQuoteModal() {
  const { isQuoteModalOpen, setIsQuoteModalOpen, requestQuote, landingTheme, landingPlans } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Emissão de ISRC & Homologação ECAD');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    requestQuote({
      name,
      email,
      phone,
      service,
      notes,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setIsQuoteModalOpen(false);
    }, 2000);
  };

  const isDark = landingTheme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white shadow-indigo-950/50'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Music2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">Solicitar Cotação</h2>
              <p className="text-[11px] text-slate-400">Atendimento comercial Aura HUB</p>
            </div>
          </div>

          <button
            onClick={() => setIsQuoteModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Cotação Enviada!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sua oportunidade foi registrada com sucesso no pipeline comercial do CRM. Entraremos em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome do Artista, Produtor ou Empresa *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Selo Sonora ou Carlos Silva"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@artista.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Serviço ou Plano Desejado *
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <optgroup label="Planos de Assinatura">
                  {(landingPlans || []).map((p) => (
                    <option key={p.id} value={`Plano: ${p.name} - R$ ${p.price}${p.period || '/mês'}`}>
                      Plano: {p.name} (R$ {p.price}{p.period || '/mês'})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Serviços Avulsos">
                  <option value="Emissão de ISRC & Homologação ECAD">Emissão de ISRC & Homologação ECAD</option>
                  <option value="Registro de Obras & Composição (ISWC)">Registro de Obras & Composição (ISWC)</option>
                  <option value="Split Sheets com Assinatura Eletrônica">Split Sheets com Assinatura Eletrônica</option>
                  <option value="Licenciamento de Sincronização (Sync Audiovisual)">Licenciamento de Sincronização (Sync Audiovisual)</option>
                  <option value="Auditoria de Streaming & Catálogo">Auditoria de Streaming & Catálogo</option>
                  <option value="Consultoria Jurídica e Direitos Autorais">Consultoria Jurídica e Direitos Autorais</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detalhes do Catálogo ou Músicas (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Tenho um EP com 5 faixas e gostaria de emitir ISRC com split sheets..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Solicitação de Cotação</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
