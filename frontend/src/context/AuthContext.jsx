import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { TOKEN_KEY, setUnauthorizedHandler } from '../services/api.js';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Decodifica o payload de um JWT sem validar a assinatura (isso é feito no backend).
 * Usamos isso apenas para ler { id, role, exp } e adaptar a interface.
 */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(decoded) {
  if (!decoded?.exp) return false;
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Inicialização: tenta restaurar a sessão a partir do token salvo
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded && !isExpired(decoded)) {
        setUser(decoded);
        setToken(stored);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Registra o handler chamado pelo axios quando uma requisição volta 401/403
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      toast.error('Sua sessão expirou. Faça login novamente.');
    });
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const { token: newToken } = await authService.login(email, password);
    const decoded = decodeToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(decoded);
  }, []);

  const register = useCallback(async (formData) => {
    return authService.register(formData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  return ctx;
}
