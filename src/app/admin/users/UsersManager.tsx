'use client';

import { useState } from 'react';
import { updateUserRoleAction, editUserAction } from '@/actions/admin';
import { CheckCircle2, XCircle, Pencil, XCircle as CloseIcon } from 'lucide-react';

type UserCount = {
  reviews: number;
  favorites: number;
  itineraries: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  bio: string | null;
  _count: UserCount;
};

type Props = {
  users: User[];
};

export default function UsersManager({ users: initial }: Props) {
  const [users, setUsers] = useState(initial);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    fd.append('id', editingUser.id);
    const result = (await editUserAction(fd)) as { success?: boolean; error?: string };
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: fd.get('name') as string,
                email: fd.get('email') as string,
                bio: fd.get('bio') as string,
                role: fd.get('role') as string,
                status: fd.get('status') as string,
              }
            : u
        )
      );
      setEditingUser(null);
    }
  }

  async function handleQuickSave(userId: string, role: string, status: string) {
    await updateUserRoleAction(userId, role, status);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role, status } : u))
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-white mb-1">
          User Accounts &amp; Permissions ({users.length})
        </h1>
        <p className="text-xs text-slate-400">
          Manage registered tourists, assign administrator privileges, and toggle account activation.
        </p>
      </div>

      {/* Inline Edit Form */}
      {editingUser && (
        <div className="bg-slate-900 border border-purple-700 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-purple-400" />
              Edit User: <span className="text-purple-400 ml-1">{editingUser.name}</span>
            </h2>
            <button
              onClick={() => setEditingUser(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 bg-rose-950 border border-rose-800 text-rose-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                name="name"
                defaultValue={editingUser.name}
                required
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email *
              </label>
              <input
                name="email"
                type="email"
                defaultValue={editingUser.email}
                required
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={editingUser.bio ?? ''}
                rows={3}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Role
              </label>
              <select
                name="role"
                defaultValue={editingUser.role}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="TOURIST">TOURIST</option>
                <option value="BUSINESS">BUSINESS</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                defaultValue={editingUser.status}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-400 font-bold flex items-center justify-center text-xs">
                        {u.name[0].toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-950 text-purple-400 border border-purple-800'
                          : u.role === 'BUSINESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-sky-950 text-sky-400 border border-sky-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        u.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{u.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {u._count.itineraries} trips • {u._count.reviews} reviews •{' '}
                    {u._count.favorites} saved
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 bg-purple-950 text-purple-400 hover:bg-purple-900 border border-purple-800 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Quick role/status form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const fd = new FormData(e.currentTarget);
                          handleQuickSave(
                            u.id,
                            fd.get('role') as string,
                            fd.get('status') as string
                          );
                        }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <select
                          name="role"
                          defaultValue={u.role}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white"
                        >
                          <option value="TOURIST">TOURIST</option>
                          <option value="BUSINESS">BUSINESS</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <select
                          name="status"
                          defaultValue={u.status}
                          className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
