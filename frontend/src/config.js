/**
 * Resolve a URL base da API backend.
 *
 * Ordem de prioridade:
 * 1. window.APP_CONFIG.API_URL — injetado em tempo de execução pelo
 *    container Docker (ver public/env-config.js e docker-entrypoint.sh).
 *    Isso permite trocar a URL da API sem precisar rebuildar a imagem.
 * 2. import.meta.env.VITE_API_URL — usado em desenvolvimento local
 *    (npm run dev), lido do arquivo .env.
 * 3. Valor padrão de fallback.
 */
export function getApiUrl() {
  if (typeof window !== 'undefined' && window.APP_CONFIG?.API_URL) {
    return window.APP_CONFIG.API_URL;
  }

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return 'http://localhost:3000';
}
