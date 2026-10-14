'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { MusicRegistration, RegistrationSplit } from '@/lib/types';
import {
  Music2,
  Plus,
  FileCheck2,
  Award,
  Sparkles,
  Users,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';

export function MusicRegistrationView() {
  const {
    musicRegistrations,
    addMusicRegistration,
    issueIsrc,
    openCertificateModal,
    currentUser,
  } = useCRM();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New registration form state
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [genre, setGenre] = useState('Pop / MPB');
  const [type, setType] = useState<any>('Single');
  const [duration, setDuration] = useState('180');
  const [notes, setNotes] = useState('');
  const [splits, setSplits] = useState<RegistrationSplit[]>([
    {
      id: 'sp-1',
      name: currentUser?.name || 'Compositor Principal',
      role: 'Compositor',
      percentage: 70,
      document: '000.000.000-00',
      email: currentUser?.email || 'artista@sonora.com',
    },
    {
      id: 'sp-2',
      name: 'Aura Records',
      role: 'Produtor Fonográfico',
      percentage: 30,
      document: '12.345.678/0001-90',
      email: 'contato@sonora.com',
    },
  ]);

  const totalSplitPercentage = splits.reduce((sum, s) => sum + Number(s.percentage || 0), 0);

  const handleAddSplit = () => {
    setSplits([
      ...splits,
      {
        id: `sp-${Date.now()}`,
        name: '',
        role: 'Intérprete',
        percentage: 0,
        document: '',
        email: '',
      },
    ]);
  };

  const handleRemoveSplit = (id: string) => {
    if (splits.length <= 1) return;
    setSplits(splits.filter((s) => s.id !== id));
  };

  const handleUpdateSplit = (id: string, field: keyof RegistrationSplit, value: any) => {
    setSplits(
      splits.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistName) return;
    if (totalSplitPercentage !== 100) {
      alert('A soma das porcentagens da Split Sheet deve ser exatamente 100%!');
      return;
    }

    addMusicRegistration({
      title,
      artistName,
      genre,
      releaseYear: new Date().getFullYear(),
      type,
      status: 'ISRC Emitido',
      durationSeconds: Number(duration) || 180,
      splits,
      notes,
    });

    setIsModalOpen(false);
    setTitle('');
    setArtistName('');
    setNotes('');
  };

  const filteredRegistrations = (musicRegistrations || []).filter((reg) => {
    const s = (search || '').toLowerCase().trim();
    const titleMatch = (reg.title || '').toLowerCase().includes(s);
    const artistMatch = (reg.artistName || '').toLowerCase().includes(s);
    const isrcMatch = (reg.isrcCode || '').toLowerCase().includes(s);
    const matchesSearch = !s || titleMatch || artistMatch || isrcMatch;
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Registro de Músicas, ISRC & ECAD
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {filteredRegistrations.length} obras
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Geração de código ISRC oficial, split sheet de coautoria e homologação no banco de dados do ECAD
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nova Música</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, artista ou código ISRC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
        >
          <option value="all">Todos os Status</option>
          <option value="Homologado ECAD">Homologado ECAD</option>
          <option value="ISRC Emitido">ISRC Emitido</option>
          <option value="Em Análise">Em Análise</option>
          <option value="Rascunho">Rascunho</option>
        </select>
      </div>

      {/* Registrations Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Obra / Fonograma</th>
                <th className="px-5 py-3">Artista & Gênero</th>
                <th className="px-5 py-3">Código ISRC</th>
                <th className="px-5 py-3">Split Sheet</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((reg, regIdx) => (
                <tr key={reg.id || `reg-${regIdx}`} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Music2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{reg.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {reg.type} • {reg.releaseYear} • {Math.floor((reg.durationSeconds || 180) / 60)}:
                          {String((reg.durationSeconds || 180) % 60).padStart(2, '0')} min
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{reg.artistName}</p>
                    <p className="text-[11px] text-slate-400">{reg.genre}</p>
                  </td>

                  <td className="px-5 py-4 font-mono font-bold text-slate-700">
                    {reg.isrcCode ? (
                      <span className="bg-slate-100 text-indigo-700 px-2 py-1 rounded-md text-xs border border-slate-200">
                        {reg.isrcCode}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Pendente</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      {(reg.splits || []).slice(0, 2).map((sp, sIdx) => (
                        <div key={sp.id || `split-${reg.id || regIdx}-${sIdx}`} className="flex justify-between text-[11px]">
                          <span className="text-slate-600 truncate">{sp.name}</span>
                          <span className="font-bold text-slate-900">{sp.percentage}%</span>
                        </div>
                      ))}
                      {(reg.splits?.length || 0) > 2 && (
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          +{(reg.splits?.length || 0) - 2} outros autores
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        reg.status === 'Homologado ECAD'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : reg.status === 'ISRC Emitido'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {reg.status === 'Homologado ECAD' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                      {reg.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openCertificateModal(reg)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        title="Ver Certificado Oficial"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Certificado</span>
                      </button>

                      {reg.status !== 'Homologado ECAD' && (
                        <button
                          onClick={() => issueIsrc(reg.id)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Homologar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Registration Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Novo Registro Fonográfico</h2>
                <p className="text-xs text-slate-500">
                  Insira os metadados e os percentuais da split sheet para homologação no ECAD
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título da Obra / Música *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Céu de Vidro"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Artista / Banda *
                  </label>
                  <input
                    type="text"
                    required
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Ex: Marina Santos & Banda"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gênero Musical</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Single">Single</option>
                    <option value="EP">EP</option>
                    <option value="Álbum">Álbum</option>
                    <option value="Fonograma">Fonograma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duração (segundos)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Split sheet editor */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Split Sheet de Coautoria (Divisão de Direitos)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      A soma deve ser exatamente 100% para emissão do ISRC
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        totalSplitPercentage === 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Total: {totalSplitPercentage}%
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSplit}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {splits.map((s, idx) => (
                    <div
                      key={s.id || `split-row-${idx}`}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Nome do Cotitular"
                        value={s.name}
                        onChange={(e) => handleUpdateSplit(s.id, 'name', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <select
                        value={s.role}
                        onChange={(e) => handleUpdateSplit(s.id, 'role', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Compositor">Compositor</option>
                        <option value="Intérprete">Intérprete</option>
                        <option value="Músico Acompanhante">Músico</option>
                        <option value="Produtor Fonográfico">Produtor</option>
                        <option value="Editora">Editora</option>
                      </select>
                      <div className="flex items-center gap-1 w-20">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={s.percentage}
                          onChange={(e) => handleUpdateSplit(s.id, 'percentage', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSplit(s.id)}
                        className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={totalSplitPercentage !== 100}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Emitir ISRC e Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
