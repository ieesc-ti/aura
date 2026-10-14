import React from 'react';
import { useCRM } from '@/lib/crm-context';
import {
  ShieldCheck,
  Download,
  Printer,
  X,
  FileCheck,
  Music,
  FileText,
  Copy,
  CheckCircle2,
  ExternalLink,
  Award,
  Hash,
  Clock,
  Calendar,
  Lock,
} from 'lucide-react';

export function CertificateModal() {
  const {
    isCertificateModalOpen,
    setIsCertificateModalOpen,
    selectedCertificate,
  } = useCRM();

  const [copiedHash, setCopiedHash] = React.useState(false);

  if (!isCertificateModalOpen || !selectedCertificate) return null;

  const reg = selectedCertificate;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(reg.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:border-none print:shadow-none print:my-0">
        {/* Top action toolbar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Certificado de Registro Autenticado</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Válido & Inviolável
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Código: {reg.certificateNumber} • Hash SHA-256 verificado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCertificateModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE BODY */}
        <div className="p-8 md:p-12 bg-white text-slate-900 print:p-6" id="printable-certificate">
          {/* Certificate Frame with Ornate Border */}
          <div className="border-4 border-double border-slate-800 p-6 md:p-10 rounded-xl relative bg-radial from-slate-50/50 to-white">
            {/* Watermark Logo in Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-slate-900" />
            </div>

            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-slate-300 relative">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AURA HUB REGISTRO MUSICAL • PROVA DE ANTERIORIDADE</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-950 uppercase tracking-tight">
                CERTIFICADO DE AUTENTICIDADE E DEPÓSITO AUTORAL
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
                Registrado conforme Lei de Direitos Autorais nº 9.610/1998, Convenção de Berna e padrões de assinatura criptográfica temporal imutável.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
                <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  Certificado: <strong className="text-indigo-900">{reg.certificateNumber}</strong>
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  Data/Hora: <strong className="text-indigo-900">{new Date(reg.timestamp).toLocaleString('pt-BR')}</strong>
                </span>
                <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Status: <strong>{reg.status}</strong>
                </span>
              </div>
            </div>

            {/* Work Details */}
            <div className="py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Título da Obra / Fonograma
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">
                    {reg.title}
                  </div>
                  {reg.subtitle && (
                    <div className="text-xs text-slate-600 italic mt-0.5">
                      {reg.subtitle}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                      {reg.registrationType === 'complete_audio_lyrics' ? (
                        <>
                          <Music className="w-3.5 h-3.5" />
                          <span>Registro Completo (Áudio & Letra)</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>Poesia / Letra de Música</span>
                        </>
                      )}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Gênero: <strong>{reg.genre}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-600">Titular Principal / Solicitante:</span>{' '}
                    <strong className="text-slate-900 text-sm font-bold block">{reg.userName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600">Compositor da Melodia:</span>{' '}
                    <strong className="text-slate-800">{reg.mainComposer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600">Autor(a) da Letra / Poesia:</span>{' '}
                    <strong className="text-slate-800">{reg.lyricist}</strong>
                  </div>
                  {reg.isrc && (
                    <div>
                      <span className="text-slate-600">Código ISRC:</span>{' '}
                      <strong className="font-mono text-indigo-950 font-bold">{reg.isrc}</strong>
                    </div>
                  )}
                  {reg.audioFileName && (
                    <div>
                      <span className="text-slate-600">Arquivo de Áudio Master:</span>{' '}
                      <span className="font-mono text-slate-800">{reg.audioFileName}</span>{' '}
                      {reg.audioDuration && <span className="text-slate-600">({reg.audioDuration})</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Titulares e Divisão Percentual (Split Sheet) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Divisão de Titularidade Declarada (Split Sheet)</span>
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Nome do Titular</th>
                        <th className="py-2 px-3">Função / Categoria</th>
                        <th className="py-2 px-3">Documento (CPF)</th>
                        <th className="py-2 px-3 text-right">Participação (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reg.splits && reg.splits.length > 0 ? (
                        reg.splits.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-900">{s.name}</td>
                            <td className="py-2 px-3 text-slate-600">{s.role}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{s.document || 'Validado'}</td>
                            <td className="py-2 px-3 text-right font-bold text-indigo-700">{s.percentage}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-2 px-3 font-semibold text-slate-900">{reg.userName}</td>
                          <td className="py-2 px-3 text-slate-600">Autor e Titular Integral</td>
                          <td className="py-2 px-3 font-mono text-slate-600">Declarado</td>
                          <td className="py-2 px-3 text-right font-bold text-indigo-700">100%</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Letra / Poesia Transcrita */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Teor Lírico / Letra da Obra Depositada</span>
                </h3>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs leading-relaxed font-serif text-slate-800 max-h-48 overflow-y-auto whitespace-pre-line print:max-h-none">
                  {reg.lyricsText || 'Letra registrada nos metadados anexos ao depósito digital.'}
                </div>
              </div>

              {/* Assinatura Criptográfica SHA-256 e Carimbo */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Hash Criptográfico SHA-256 (Inviolabilidade Digital)</span>
                    </div>
                    <div className="font-mono text-xs break-all text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
                      {reg.sha256Hash}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="self-start md:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer print:hidden"
                  >
                    {copiedHash ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Hash Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Hash</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Carimbo de Tempo UTC: {reg.timestamp}</span>
                  <span className="text-emerald-400 font-semibold">
                    ✓ Assinado digitalmente pela autoridade certificadora Aura HUB
                  </span>
                </div>
              </div>

              {/* Footer legal text & signatures */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="text-[10px] text-slate-600 space-y-1">
                  <p>
                    <strong>Eficácia Jurídica:</strong> Este certificado comprova a anterioridade temporal e integridade do arquivo e letra nos termos do art. 19 da Lei nº 9.610/1998 e art. 10, § 2º da Medida Provisória nº 2.200-2/2001.
                  </p>
                  <p>
                    Para validar este certificado e a chave pública, consulte o verificador oficial em aurahub.com.br/validar com o código <strong>{reg.certificateNumber}</strong>.
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                  <div className="w-48 border-b border-slate-900 pb-1 mb-1 font-signature text-sm font-bold text-slate-900">
                    Aura HUB Digital Auth
                  </div>
                  <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    DEPARTAMENTO DE REGISTRO & DIREITOS AUTORAIS
                  </div>
                  <div className="text-[9px] text-slate-600">
                    Autenticação Criptográfica Aura HUB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 print:hidden">
          <span>Dica: Use "Imprimir / Salvar PDF" para gerar seu arquivo PDF oficial e arquivar.</span>
          <button
            type="button"
            onClick={() => setIsCertificateModalOpen(false)}
            className="px-4 py-1.5 rounded-lg font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
