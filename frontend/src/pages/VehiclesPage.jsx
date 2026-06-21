import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as vehicleService from '../services/vehicleService.js';
import { VEHICLE_TYPES } from '../services/vehicleService.js';
import { getErrorMessage } from '../services/api.js';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const currentYear = new Date().getFullYear();
const emptyForm = { type: 'carro', brand: '', model: '', year: currentYear };

export default function VehiclesPage() {
  const [activeType, setActiveType] = useState(VEHICLE_TYPES[0]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);

  const [editVehicle, setEditVehicle] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [deleteVehicle, setDeleteVehicle] = useState(null);

  const fetchVehicles = async (type) => {
    setLoading(true);
    try {
      const data = await vehicleService.listVehiclesByType(type);
      setVehicles(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(activeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  // --- Criação ---
  const openCreate = () => {
    setCreateForm({ ...emptyForm, type: activeType });
    setCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await vehicleService.createVehicle(createForm);
      toast.success('Veículo cadastrado com sucesso.');
      setCreateOpen(false);
      // A API só lista por tipo, então alinhamos a aba ativa com o tipo recém-criado
      if (createForm.type !== activeType) {
        setActiveType(createForm.type);
      } else {
        fetchVehicles(activeType);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --- Edição ---
  const openEdit = (v) => {
    setEditVehicle(v);
    setEditForm({ type: v.type, brand: v.brand, model: v.model, year: v.year });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await vehicleService.updateVehicle(editVehicle._id, editForm);
      toast.success('Veículo atualizado com sucesso.');
      setEditVehicle(null);
      if (editForm.type !== activeType) {
        setActiveType(editForm.type);
      } else {
        fetchVehicles(activeType);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --- Remoção ---
  const handleDeleteConfirm = async () => {
    try {
      await vehicleService.deleteVehicle(deleteVehicle._id);
      toast.success('Veículo removido com sucesso.');
      setDeleteVehicle(null);
      fetchVehicles(activeType);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleteVehicle(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Veículos</h1>
          <p className="mt-1 text-sm text-graphite-600">Frota de carros e motos cadastrados.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          + Novo veículo
        </button>
      </div>

      <div className="mb-5 inline-flex rounded-md border border-line bg-white p-1">
        {VEHICLE_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveType(t)}
            className={
              'rounded px-4 py-1.5 text-sm font-medium capitalize transition-colors ' +
              (activeType === t ? 'bg-graphite-950 text-white' : 'text-graphite-700 hover:bg-graphite-950/5')
            }
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner full />
      ) : vehicles.length === 0 ? (
        <EmptyState
          title={`Nenhum veículo do tipo "${activeType}"`}
          description="Cadastre um novo veículo nesta categoria."
          action={
            <button type="button" className="btn-primary" onClick={openCreate}>
              + Novo veículo
            </button>
          }
        />
      ) : (
        <>
          {/* Tabela — desktop */}
          <div className="hidden overflow-hidden rounded-lg border border-line bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-graphite-950/[0.03] text-xs uppercase tracking-wide text-graphite-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Marca</th>
                  <th className="px-4 py-3 font-medium">Modelo</th>
                  <th className="px-4 py-3 font-medium">Ano</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {vehicles.map((v) => (
                  <tr key={v._id}>
                    <td className="px-4 py-3 font-medium text-ink">{v.brand}</td>
                    <td className="px-4 py-3 text-graphite-700">{v.model}</td>
                    <td className="px-4 py-3 font-mono text-graphite-700">{v.year}</td>
                    <td className="px-4 py-3 capitalize text-graphite-700">{v.type}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn-ghost" onClick={() => openEdit(v)}>
                          Editar
                        </button>
                        <button type="button" className="btn-danger" onClick={() => setDeleteVehicle(v)}>
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {vehicles.map((v) => (
              <div key={v._id} className="card px-4 py-4">
                <div className="mb-1 flex items-start justify-between">
                  <p className="font-medium text-ink">
                    {v.brand} {v.model}
                  </p>
                  <span className="font-mono text-xs uppercase text-graphite-600">{v.type}</span>
                </div>
                <p className="text-sm text-graphite-600">Ano {v.year}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-ghost flex-1" onClick={() => openEdit(v)}>
                    Editar
                  </button>
                  <button type="button" className="btn-danger flex-1" onClick={() => setDeleteVehicle(v)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal de criação */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo veículo">
        <VehicleForm form={createForm} setForm={setCreateForm} onSubmit={handleCreateSubmit} onCancel={() => setCreateOpen(false)} saving={saving} submitLabel="Cadastrar" />
      </Modal>

      {/* Modal de edição */}
      <Modal open={Boolean(editVehicle)} onClose={() => setEditVehicle(null)} title="Editar veículo">
        <VehicleForm form={editForm} setForm={setEditForm} onSubmit={handleEditSubmit} onCancel={() => setEditVehicle(null)} saving={saving} submitLabel="Salvar alterações" />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteVehicle)}
        title="Remover veículo"
        message={`Tem certeza que deseja remover "${deleteVehicle?.brand} ${deleteVehicle?.model}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteVehicle(null)}
      />
    </div>
  );
}

function VehicleForm({ form, setForm, onSubmit, onCancel, saving, submitLabel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label className="field-label" htmlFor="v-type">
          Tipo
        </label>
        <select
          id="v-type"
          className="field-input"
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
        >
          {VEHICLE_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="field-label" htmlFor="v-brand">
          Marca
        </label>
        <input
          id="v-brand"
          required
          className="field-input"
          value={form.brand}
          onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
        />
      </div>
      <div className="mb-4">
        <label className="field-label" htmlFor="v-model">
          Modelo
        </label>
        <input
          id="v-model"
          required
          className="field-input"
          value={form.model}
          onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
        />
      </div>
      <div className="mb-6">
        <label className="field-label" htmlFor="v-year">
          Ano
        </label>
        <input
          id="v-year"
          type="number"
          required
          min={1900}
          max={currentYear + 1}
          className="field-input"
          value={form.year}
          onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
