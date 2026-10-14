'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
      }
    } catch {
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6 text-[#0b1c30]">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo deu errado ao carregar</h1>
            <p className="text-sm text-slate-600 mb-6">
              Ocorreu uma falha na renderização inicial.
            </p>
            {this.state.error && (
              <div className="text-left bg-slate-900 text-slate-200 text-xs p-3 rounded-lg overflow-x-auto mb-6 font-mono">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => typeof window !== 'undefined' && window.location.reload()}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition cursor-pointer"
              >
                Tentar Novamente
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition text-xs cursor-pointer"
              >
                Limpar Cache Local e Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
