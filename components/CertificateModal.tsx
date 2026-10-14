'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { Award, X, Printer, ShieldCheck, Music2, QrCode } from 'lucide-react';

export function CertificateModal() {
  const { selectedCertificateReg, closeCertificateModal, isCertificateModalOpen } = useCRM();

  if (!isCertificateModalOpen || !selectedCertificateReg) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative my-8 print:p-0 print:border-none print:shadow-none">
        {/* Top bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Certificado Oficial de Registro Musical</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={closeCertificateModal}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Frame */}
        <div className="border-4 border-double border-indigo-950/20 p-8 rounded-2xl bg-gradient-to-b from-amber-50/20 via-white to-indigo-50/20 text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-indigo-600 flex items-center justify-center text-white shadow-md mb-4">
            <Award className="w-8 h-8 text-slate-900" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-900 block mb-1">
            República Federativa do Brasil • Lei 9.610/98 de Direitos Autorais
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Certificado de Registro Fonográfico & ISRC
          </h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Emitido via Aura Music CRM • Homologação perante o banco de dados fonográfico nacional
          </p>

          {/* Details Card */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 text-left max-w-lg mx-auto shadow-xs space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Título da Obra</span>
              <p className="text-base font-black text-slate-900">{selectedCertificateReg.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Artista Principal</span>
                <p className="font-bold text-slate-800">{selectedCertificateReg.artistName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Gênero & Ano</span>
                <p className="font-semibold text-slate-700">
                  {selectedCertificateReg.genre} • {selectedCertificateReg.releaseYear}
                </p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-indigo-600 font-bold uppercase block">Código ISRC Oficial</span>
                <span className="font-mono font-black text-indigo-900 text-sm">
                  {selectedCertificateReg.isrcCode || 'BR-SNR-24-00100'}
                </span>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                Cotitulares & Split Sheet Registrada
              </span>
              <div className="space-y-1">
                {(selectedCertificateReg.splits || []).map((s, idx) => {
                  const splitKey = s.id || `cert-split-${selectedCertificateReg.id || 'reg'}-${idx}-${s.name || 'author'}`;
                  return (
                    <div key={splitKey} className="flex justify-between text-[11px] py-0.5 border-b border-slate-100">
                      <span className="text-slate-700 font-medium">
                        {s.name} {s.role ? `(${s.role})` : ''}
                      </span>
                      <span className="font-bold text-slate-900">{s.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer of certificate */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 text-left max-w-lg mx-auto">
            <div>
              <p className="font-bold text-slate-800">Autenticidade Garantida</p>
              <p className="text-slate-400">Data de Emissão: {selectedCertificateReg.registrationDate}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-slate-400">ID: {selectedCertificateReg.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
