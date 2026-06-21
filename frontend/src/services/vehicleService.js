import api from './api.js';

export const VEHICLE_TYPES = ['carro', 'moto'];

/**
 * GET /vehicles/:type -> [{ _id, type, brand, model, year }]
 * Importante: o backend não tem uma rota para listar TODOS os veículos,
 * apenas filtrados por tipo. Por isso a tela de Veículos sempre opera
 * com um tipo selecionado (carro ou moto).
 */
export async function listVehiclesByType(type) {
  const { data } = await api.get(`/vehicles/${type}`);
  return data;
}

/**
 * POST /vehicles — { type, brand, model, year } -> veículo criado
 */
export async function createVehicle({ type, brand, model, year }) {
  const { data } = await api.post('/vehicles', { type, brand, model, year: Number(year) });
  return data;
}

/**
 * PUT /vehicles/:id — { type, brand, model, year } -> veículo atualizado
 * Nota: o id de veículos é o _id do MongoDB.
 */
export async function updateVehicle(id, { type, brand, model, year }) {
  const { data } = await api.put(`/vehicles/${id}`, { type, brand, model, year: Number(year) });
  return data;
}

/**
 * DELETE /vehicles/:id -> { message }
 */
export async function deleteVehicle(id) {
  const { data } = await api.delete(`/vehicles/${id}`);
  return data;
}
