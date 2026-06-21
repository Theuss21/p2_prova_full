import api from './api.js';

/**
 * GET /users -> [{ id, username, email, role }]
 */
export async function listUsers() {
  const { data } = await api.get('/users');
  return data;
}

/**
 * PUT /users/:id — { username, email, role } -> usuário atualizado
 * Observação: o backend não aceita troca de senha por esta rota.
 */
export async function updateUser(id, { username, email, role }) {
  const { data } = await api.put(`/users/${id}`, { username, email, role });
  return data;
}

/**
 * DELETE /users/:id -> { message }
 */
export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}
