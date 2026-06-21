import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';

const initialForm = { username: '', email: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setSubmitting(true);
    try {
      // Cadastro público sempre cria conta com papel "user".
      // Promoção para admin é feita depois, na tela de Usuários, por um usuário já autenticado.
      await register({ username: form.username, email: form.email, password: form.password, role: 'user' });
      toast.success('Conta criada com sucesso. Faça login para continuar.');
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-graphite-950 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-semibold text-white">
            FROTA<span className="text-signal">.</span>
          </span>
          <p className="mt-1 text-sm text-graphite-600">Crie sua conta para acessar o painel</p>
        </div>

        <form onSubmit={handleSubmit} className="card px-6 py-7">
          <h1 className="mb-5 font-display text-lg font-semibold text-ink">Criar conta</h1>

          <div className="mb-4">
            <label className="field-label" htmlFor="username">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9]+"
              title="Apenas letras e números"
              value={form.username}
              onChange={handleChange}
              className="field-input"
              placeholder="joaosilva"
            />
            <p className="mt-1 text-xs text-graphite-600">Apenas letras e números, de 3 a 30 caracteres.</p>
          </div>

          <div className="mb-4">
            <label className="field-label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="field-input"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="mb-4">
            <label className="field-label" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="field-input"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-graphite-600">Mínimo de 8 caracteres.</p>
          </div>

          <div className="mb-6">
            <label className="field-label" htmlFor="confirmPassword">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              value={form.confirmPassword}
              onChange={handleChange}
              className="field-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="mt-5 text-center text-sm text-graphite-600">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-signal-dark hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
