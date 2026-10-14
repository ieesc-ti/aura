'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#070b14] text-white text-center">
      <h1 className="text-4xl font-black mb-2">404</h1>
      <p className="text-slate-400 text-sm mb-6">Página não encontrada no Aura Music CRM.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
