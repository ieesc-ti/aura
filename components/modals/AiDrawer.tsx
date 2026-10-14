import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, Sparkles, Copy, Check } from 'lucide-react';

export function AiDrawer() {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    deals,
    selectedDeal,
    setSelectedDealId,
    setActiveTab,
  } = useCRM();

  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'closing' | 'risks' | 'proposal'>('closing');
  const [copied, setCopied] = useState(false);

  if (!isAiDrawerOpen) return null;

  const currentDeal = selectedDeal || deals[0];

  const handleGenerate = (mode: 'closing' | 'risks' | 'proposal') => {
    setActiveMode(mode);
    setLoading(true);
    setAnalysisText(null);

    setTimeout(() => {
      const formattedVal = `R$ ${currentDeal.value.toLocaleString('pt-BR')}`;
      if (mode === 'proposal') {
        setAnalysisText(
          `Assunto: Proposta Executiva & Validação de Cronograma — ${currentDeal.name}\n\nPrezada Diretoria da ${currentDeal.organization},\n\nConforme nosso alinhamento técnico, consolidamos os parâmetros finais para a implantação da solução ${currentDeal.name} (${formattedVal}).\n\n• SLA Corporativo 99,95% e suporte RevOps dedicado.\n• Redução projetada de 35% no tempo de ciclo operacional nos primeiros 60 dias.\n• Metodologia 'Fast-Track Enterprise' com migração assistida de dados legados.\n\nFico à disposição para um breve alinhamento a fim de ratificarmos os próximos passos.\n\nAtenciosamente,\n${currentDeal.ownerName} | Desenvolvedor Aura CRM`
        );
      } else if (mode === 'risks') {
        setAnalysisText(
          `⚠️ Matriz de Mitigação de Riscos & Objeções — ${currentDeal.organization}:\n\n1. "Restrição de Orçamento Trimestral":\n• Contra-argumento: Propor estrutura de amortização semestral alinhada a marcos de entrega (milestones).\n\n2. "Curva de Adoção da Equipe":\n• Contra-argumento: Apresentar plano de treinamento com 4 workshops dedicados e suporte prioritário.\n\n3. "Segurança e Governança na Vertical ${currentDeal.segment}":\n• Contra-argumento: Disponibilizar relatório de conformidade LGPD e certificação SOC 2 Tipo II.`
        );
      } else {
        setAnalysisText(
          `🎯 Diagnóstico Executivo de Fechamento (IA Aura):\n\n• Probabilidade Calculada: ${currentDeal.probability}% com saúde de ${currentDeal.healthScore || 85}/100.\n• Valor Ponderado em Jogo: ${formattedVal}.\n• Próximo Passo Crítico: Validar com o patrocinador econômico a aprovação do aditivo até o encerramento do trimestre.\n• Tática de Aceleração: Conectar o time de suporte à área usuária da ${currentDeal.organization} para eliminar objeções técnicas.`
        );
      }
      setLoading(false);
    }, 600);
  };

  const copyToClipboard = () => {
    if (analysisText) {
      navigator.clipboard.writeText(analysisText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={() => setIsAiDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e5eeff] shadow-2xl flex flex-col justify-between text-left animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3525cd] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0b1c30] font-display">
                  Insights de IA Aura
                </h2>
                <p className="text-xs text-[#565e74]">
                  Análise preditiva e recomendações estratégicas
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-lg hover:bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {/* Deal selector */}
            <div>
              <label className="block text-xs font-bold text-[#565e74] uppercase mb-1">
                SELECIONE A OPORTUNIDADE:
              </label>
              <select
                value={currentDeal?.id}
                onChange={(e) => {
                  setSelectedDealId(e.target.value);
                  setAnalysisText(null);
                }}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-xs font-semibold text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
              >
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.organization} — {d.name} (R$ {d.value.toLocaleString('pt-BR')})
                  </option>
                ))}
              </select>
            </div>

            {/* Deal Snapshot */}
            {currentDeal && (
              <div className="p-3 bg-[#eff4ff] border border-[#dce9ff] rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#0b1c30]">
                  <span>{currentDeal.name}</span>
                  <span className="text-[#3525cd]">
                    R$ {currentDeal.value.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between text-[#565e74]">
                  <span>Estágio: {currentDeal.stage}</span>
                  <span>Probabilidade: {currentDeal.probability}%</span>
                </div>
              </div>
            )}

            {/* Analysis Mode Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleGenerate('closing')}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeMode === 'closing'
                    ? 'bg-[#3525cd] text-white border-[#3525cd]'
                    : 'bg-[#f8f9ff] text-[#565e74] border-[#e5eeff] hover:bg-[#eff4ff]'
                }`}
              >
                Diagnóstico
              </button>
              <button
                onClick={() => handleGenerate('risks')}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeMode === 'risks'
                    ? 'bg-[#3525cd] text-white border-[#3525cd]'
                    : 'bg-[#f8f9ff] text-[#565e74] border-[#e5eeff] hover:bg-[#eff4ff]'
                }`}
              >
                Riscos & SLA
              </button>
              <button
                onClick={() => handleGenerate('proposal')}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activeMode === 'proposal'
                    ? 'bg-[#3525cd] text-white border-[#3525cd]'
                    : 'bg-[#f8f9ff] text-[#565e74] border-[#e5eeff] hover:bg-[#eff4ff]'
                }`}
              >
                E-mail Fechamento
              </button>
            </div>

            {/* Analysis Result Box */}
            {loading ? (
              <div className="p-8 text-center space-y-2 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                <div className="w-6 h-6 border-2 border-[#3525cd] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-[#3525cd]">
                  Processando dados com o motor de IA...
                </p>
              </div>
            ) : analysisText ? (
              <div className="bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3525cd] uppercase tracking-wider">
                    RECOMENDAÇÃO ACIONÁVEL
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-[#e5eeff] text-xs text-[#0b1c30] whitespace-pre-line leading-relaxed font-sans">
                  {analysisText}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f8f9ff] border border-dashed border-[#c7c4d8] rounded-xl text-xs text-[#565e74] space-y-2">
                <Sparkles className="w-6 h-6 text-[#3525cd] mx-auto opacity-70" />
                <p>
                  Clique em um dos botões acima para executar o diagnóstico preditivo para esta oportunidade.
                </p>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#e5eeff] bg-[#f8f9ff] flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setActiveTab('deal-details');
                setIsAiDrawerOpen(false);
              }}
              className="font-bold text-[#3525cd] hover:underline"
            >
              Abrir Ficha Completa do Negócio →
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="px-3 py-1.5 bg-white border border-[#c7c4d8] rounded-lg font-semibold text-[#565e74] hover:bg-[#f8f9ff]"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
