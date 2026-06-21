import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RoleBadge from '../components/RoleBadge.jsx';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Painel</h1>
          <p className="mt-1 text-sm text-graphite-600">
            Sessão autenticada como <span className="font-mono">id #{user?.id}</span>
          </p>
        </div>
        {user?.role && <RoleBadge role={user.role} />}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          to="/usuarios"
          className="card group flex flex-col gap-2 px-6 py-6 transition hover:border-signal hover:shadow-md"
        >
          <span className="font-mono text-xs uppercase tracking-wide text-graphite-600">Recurso · SQL</span>
          <h2 className="font-display text-lg font-semibold text-ink">Usuários</h2>
          <p className="text-sm text-graphite-600">
            Listar, cadastrar, editar e remover contas de acesso ao sistema.
          </p>
          <span className="mt-2 text-sm font-medium text-signal-dark group-hover:underline">Gerenciar usuários →</span>
        </Link>

        <Link
          to="/veiculos"
          className="card group flex flex-col gap-2 px-6 py-6 transition hover:border-signal hover:shadow-md"
        >
          <span className="font-mono text-xs uppercase tracking-wide text-graphite-600">Recurso · NoSQL</span>
          <h2 className="font-display text-lg font-semibold text-ink">Veículos</h2>
          <p className="text-sm text-graphite-600">
            Listar, cadastrar, editar e remover carros e motos da frota.
          </p>
          <span className="mt-2 text-sm font-medium text-signal-dark group-hover:underline">Gerenciar veículos →</span>
        </Link>
      </div>
    </div>
  );
}
