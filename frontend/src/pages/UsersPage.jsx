import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import RoleBadge from '../components/RoleBadge.jsx';

const emptyCreateForm = { username: '', email: '', password: '', role: 'user' };
const emptyEditForm = { username: '', email: '', role: 'user' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const [deleteUser, setDeleteUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.listUsers();
      setUsers(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Criação ---
  const openCreate = () => {
    setCreateForm(emptyCreateForm);
    setCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.register(createForm);
      toast.success('Usuário cadastrado com sucesso.');
      setCreateOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --- Edição ---
  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ username: u.username, email: u.email, role: u.role });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateUser(editUser.id, editForm);
      toast.success('Usuário atualizado com sucesso.');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --- Remoção ---
  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(deleteUser.id);
      toast.success('Usuário removido com sucesso.');
      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleteUser(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Usuários</h1>
          <p className="mt-1 text-sm text-graphite-600">Contas com acesso ao painel.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          + Novo usuário
        </button>
      </div>

      {loading ? (
        <Spinner full />
      ) : users.length === 0 ? (
        <EmptyState
          title="Nenhum usuário cadastrado"
          description="Cadastre o primeiro usuário para começar."
          action={
            <button type="button" className="btn-primary" onClick={openCreate}>
              + Novo usuário
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
                  <th className="px-4 py-3 font-medium">Usuário</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Papel</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-ink">{u.username}</td>
                    <td className="px-4 py-3 text-graphite-700">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn-ghost" onClick={() => openEdit(u)}>
                          Editar
                        </button>
                        <button type="button" className="btn-danger" onClick={() => setDeleteUser(u)}>
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
            {users.map((u) => (
              <div key={u.id} className="card px-4 py-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-ink">{u.username}</p>
                    <p className="text-sm text-graphite-600">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-ghost flex-1" onClick={() => openEdit(u)}>
                    Editar
                  </button>
                  <button type="button" className="btn-danger flex-1" onClick={() => setDeleteUser(u)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal de criação */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo usuário">
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-4">
            <label className="field-label" htmlFor="c-username">
              Usuário
            </label>
            <input
              id="c-username"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9]+"
              title="Apenas letras e números"
              className="field-input"
              value={createForm.username}
              onChange={(e) => setCreateForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="field-label" htmlFor="c-email">
              E-mail
            </label>
            <input
              id="c-email"
              type="email"
              required
              className="field-input"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="field-label" htmlFor="c-password">
              Senha
            </label>
            <input
              id="c-password"
              type="password"
              required
              minLength={8}
              className="field-input"
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="mb-6">
            <label className="field-label" htmlFor="c-role">
              Papel
            </label>
            <select
              id="c-role"
              className="field-input"
              value={createForm.role}
              onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setCreateOpen(false)}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de edição */}
      <Modal open={Boolean(editUser)} onClose={() => setEditUser(null)} title="Editar usuário">
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="field-label" htmlFor="e-username">
              Usuário
            </label>
            <input
              id="e-username"
              required
              minLength={3}
              maxLength={30}
              className="field-input"
              value={editForm.username}
              onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="field-label" htmlFor="e-email">
              E-mail
            </label>
            <input
              id="e-email"
              type="email"
              required
              className="field-input"
              value={editForm.email}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="mb-2">
            <label className="field-label" htmlFor="e-role">
              Papel
            </label>
            <select
              id="e-role"
              className="field-input"
              value={editForm.role}
              onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <p className="mb-6 text-xs text-graphite-600">A troca de senha não é suportada por esta API.</p>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setEditUser(null)}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteUser)}
        title="Remover usuário"
        message={`Tem certeza que deseja remover o usuário "${deleteUser?.username}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteUser(null)}
      />
    </div>
  );
}
