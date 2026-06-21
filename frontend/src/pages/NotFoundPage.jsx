import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <span className="font-mono text-sm uppercase tracking-wide text-graphite-600">Erro 404</span>
      <h1 className="font-display text-3xl font-semibold text-ink">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-graphite-600">A página que você tentou acessar não existe ou foi movida.</p>
      <Link to="/" className="btn-primary mt-2">
        Voltar ao painel
      </Link>
    </div>
  );
}
