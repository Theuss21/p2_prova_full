import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import RoleBadge from './RoleBadge.jsx';

const links = [
  { to: '/', label: 'Painel', end: true },
  { to: '/usuarios', label: 'Usuários' },
  { to: '/veiculos', label: 'Veículos' },
];

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        'rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
        (isActive ? 'bg-white/10 text-white' : 'text-graphite-600/90 hover:text-white hover:bg-white/5')
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-graphite-950 text-graphite-600">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            FROTA<span className="text-signal">.</span>
          </span>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} {...l} />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user?.role && <RoleBadge role={user.role} />}
          <span className="font-mono text-xs text-graphite-600">id #{user?.id}</span>
          <button type="button" onClick={handleLogout} className="btn-ghost border-white/15 text-white hover:bg-white/10">
            Sair
          </button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              {user?.role && <RoleBadge role={user.role} />}
              <span className="font-mono text-xs text-graphite-600">id #{user?.id}</span>
            </div>
            <button type="button" onClick={handleLogout} className="btn-ghost border-white/15 text-white hover:bg-white/10">
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
