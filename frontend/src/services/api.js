import axios from 'axios';
import { getApiUrl } from '../config.js';

export const TOKEN_KEY = 'frota:token';

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Anexa o token JWT em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Callback registrado pelo AuthContext para reagir a sessões expiradas/inválidas
let unauthorizedHandler = null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.includes('/login');

    // 401/403 fora da tela de login indicam token ausente/expirado/inválido
    if ((status === 401 || status === 403) && !isLoginRequest && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

/**
 * Extrai uma mensagem de erro legível de uma resposta da API.
 * O backend ora retorna { message } (erros de auth/validação) ora { error } (erros de servidor),
 * então tratamos os dois formatos.
 */
export function getErrorMessage(error) {
  if (error.response) {
    const data = error.response.data;
    return data?.message || data?.error || `Erro inesperado (HTTP ${error.response.status}).`;
  }
  if (error.request) {
    return 'Não foi possível conectar à API. Verifique sua conexão ou se o servidor está no ar.';
  }
  return error.message || 'Ocorreu um erro inesperado.';
}

export default api;
