import React from 'react';

export default function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium uppercase tracking-wide ' +
        (isAdmin ? 'bg-signal-light text-signal-dark' : 'bg-graphite-950/5 text-graphite-700')
      }
    >
      {isAdmin ? 'admin' : 'user'}
    </span>
  );
}
