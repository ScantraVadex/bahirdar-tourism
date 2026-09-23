'use client';

import { useState } from 'react';
import { editReviewAction, moderateReviewAction } from '@/actions/admin';
import { deleteReviewAction } from '@/actions/reviews';
import { Check, X, Trash2, Pencil, XCircle, Star } from 'lucide-react';
import Link from 'next/link';

type Review = {
  id: string;
  rating: number;
  comment: string;
  status: string;
  user: { name: string };
  attraction: { id: string; title: string };
};

type Props = {
  reviews: Review[];
};

export default function ReviewsManager({ reviews: initial }: Props) {
  const [reviews, setReviews] = useState(initial);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingReview) return;
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    fd.append('id', editingReview.id);
    const result = (await editReviewAction(fd)) as { success?: boolean; error?: string };
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? {
                ...r,
                rating: Number(fd.get('rating')),
                comment: fd.get('comment') as string,
                status: fd.get('status') as string,
              }
            : r
        )
      );
      setEditingReview(null);
    }
  }

  async function handleModerate(id: string, status: 'APPROVED' | 'REJECTED') {
    await moderateReviewAction(id, status);
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  async function handleDelete(id: string) {
    await deleteReviewAction(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-white mb-1">
          Review Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-slate-400">
          Approve, reject, edit, or delete tourist testimonials and ratings.
        </p>
      </div>

      {/* Inline Edit Form */}
      {editingReview && (
        <div className="bg-slate-900 border border-purple-700 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-purple-400" />
              Edit Review by <span className="text-purple-400 ml-1">{editingReview.user.name}</span>
            </h2>
            <button
              onClick={() => setEditingReview(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
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
                Rating (1–5) *
              </label>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={editingReview.rating}
                  required
                  className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 w-24"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                defaultValue={editingReview.status}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Comment *
              </label>
              <textarea
                name="comment"
                defaultValue={editingReview.comment}
                required
                rows={4}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
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

      {/* Reviews Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tourist</th>
                <th className="py-3 px-4">Attraction</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{rev.user.name}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">
                    <Link
                      href={`/attractions/${rev.attraction.id}`}
                      target="_blank"
                      className="hover:text-purple-400 hover:underline"
                    >
                      {rev.attraction.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {rev.rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-[260px] text-slate-400 italic truncate">
                    &quot;{rev.comment}&quot;
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : rev.status === 'REJECTED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit */}
                      <button
                        onClick={() => setEditingReview(rev)}
                        className="p-1.5 bg-purple-950 text-purple-400 hover:bg-purple-900 border border-purple-800 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Approve */}
                      {rev.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleModerate(rev.id, 'APPROVED')}
                          className="p-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Reject */}
                      {rev.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleModerate(rev.id, 'REJECTED')}
                          className="p-1.5 bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
