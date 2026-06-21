import api from './api.js';

/**
 * POST /login — { email, password } -> { token }
 */
export async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  return data; // { token }
}

/**
 * POST /register — { username, email, password, role } -> { message }
 * Esta é a única rota de criação de usuários exposta pelo backend, por isso
 * é reaproveitada tanto na tela pública de cadastro quanto no botão
 * "Novo usuário" dentro do painel autenticado.
 */
export async function register({ username, email, password, role }) {
  const { data } = await api.post('/register', { username, email, password, role });
  return data; // { message }
}
