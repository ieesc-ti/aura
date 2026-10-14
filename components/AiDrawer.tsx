'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, Sparkles, Send, Bot, Copy, Check } from 'lucide-react';

export function AiDrawer() {
  const { isAiDrawerOpen, setIsAiDrawerOpen, deals } = useCRM();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isAiDrawerOpen) return null;

  const handleGenerate = (type: 'proposal' | 'pitch' | 'analysis') => {
    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      if (type === 'proposal') {
        setResponse(
          `## Minuta de Proposta Comercial - Aura Hub\n\n**Cliente:** Gravadora / Selo Parceiro\n**Objeto:** Licenciamento e Homologação de Catálogo com Split Sheet Validada\n\n1. **Escopo dos Serviços:**\n   - Emissão de Códigos ISRC com chancela ECAD para 10 fonogramas.\n   - Formalização de split sheets com certificação digital de coautoria.\n   - Distribuição digital global e arrecadação de direitos conexos.\n\n2. **Condições Comerciais:**\n   - Investimento: R$ 45.000,00 (Quarenta e cinco mil reais).\n   - Prazo de Execução: 15 dias úteis.\n   - Validade da Proposta: 10 dias.\n\n*Gerado pela IA Comercial Aura.*`
        );
      } else if (type === 'pitch') {
        setResponse(
          `**Pitch de Fechamento de Sincronização:**\n\n"Olá! Analisamos a trilha solicitada para a série. A faixa possui 100% dos direitos autorais e conexos homologados e desimpedidos pelo Aura Hub, sem risco de litígio no ECAD. Podemos liberar a licença de sincronização imediata por R$ 85.000 com exclusividade de 24 meses em streaming global. O que acha de finalizarmos a minuta hoje?"`
        );
      } else {
        setResponse(
          `**Análise de Risco de Direitos Autorais:**\n\n- **Status do Catálogo:** 95% das obras possuem ISRC regular.\n- **Atenção:** 1 obra está pendente de validação do percentual de um dos compositores.\n- **Recomendação:** Assinar aditivo da split sheet antes da veiculação comercial para evitar retenção de royalties no ECAD.`
        );
      }
      setLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">IA Comercial Aura</h2>
              <p className="text-[10px] text-slate-400">Assistente de propostas e contratos</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick prompt templates */}
        <div className="p-4 border-b border-slate-100 space-y-2">
          <p className="text-xs font-bold text-slate-700">Ações Rápidas:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenerate('proposal')}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              📄 Gerar Proposta
            </button>
            <button
              onClick={() => handleGenerate('pitch')}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              🎯 Pitch de Sincronização
            </button>
            <button
              onClick={() => handleGenerate('analysis')}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              ⚖️ Análise de Risco ECAD
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">A IA está redigindo o conteúdo...</p>
            </div>
          ) : response ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 space-y-3 leading-relaxed relative">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer shadow-xs"
                title="Copiar texto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <div className="whitespace-pre-line pr-6">{response}</div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Selecione uma ação rápida acima para gerar documentos comerciais e propostas musicais com IA.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
