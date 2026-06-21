import React from 'react';

export default function Spinner({ full = false, label = 'Carregando...' }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3 text-graphite-600">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-signal" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  if (!full) return spinner;

  return <div className="flex min-h-[40vh] w-full items-center justify-center py-16">{spinner}</div>;
}
