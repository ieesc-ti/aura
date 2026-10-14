'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import {
  Disc,
  Award,
  CircleDollarSign,
  FileCheck2,
  Download,
  Share2,
  TrendingUp,
  Sparkles,
  Music2,
  ExternalLink,
} from 'lucide-react';

export function ClientDashboardView() {
  const { musicRegistrations, openCertificateModal, setActiveTab, currentUser } = useCRM();

  // Filter registrations belonging to the current user or show catalog
  const myTracks = musicRegistrations;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Artist Profile Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-indigo-900/50 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center font-black text-xl text-amber-300">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'AR'}
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Portal do Artista Aura</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">{currentUser?.name}</h1>
              <p className="text-xs text-slate-400">{currentUser?.email} • Artista Homologado ECAD</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('music-registration')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Music2 className="w-4 h-4" />
              <span>Novo Registro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Faixas Registradas</span>
            <Disc className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myTracks.length}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">100% com ISRC Oficial</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Status ECAD</span>
            <FileCheck2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">Homologado</p>
          <p className="text-xs text-slate-500 mt-1">Geração de split sheet validada</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Estimativa Royalties</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">R$ 14.820,00</p>
          <p className="text-xs text-slate-500 mt-1">Próxima apuração trimestral</p>
        </div>
      </div>

      {/* Track List with Certificate trigger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Meu Catálogo Fonográfico</h2>
            <p className="text-xs text-slate-500">Músicas com ISRC emitido e certificados prontos para download</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTracks.map((track) => (
            <div
              key={track.id}
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-4 hover:border-indigo-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{track.title}</h3>
                  <p className="text-xs text-slate-500">{track.artistName} • {track.genre}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {track.status}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">ISRC:</span>
                <span className="font-bold text-indigo-700">{track.isrcCode || 'BR-SNR-24-00101'}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500">
                  {track.splits?.length || 0} cotitulares no split
                </span>
                <button
                  onClick={() => openCertificateModal(track)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Emitir Certificado</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
