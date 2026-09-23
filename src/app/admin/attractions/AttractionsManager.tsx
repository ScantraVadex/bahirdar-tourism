'use client';

import { useState } from 'react';
import { 
  createAttractionAction, 
  updateAttractionAction, 
  deleteAttractionAction, 
  toggleAttractionApprovalAction 
} from '@/actions/admin';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Save, 
  Eye, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Attraction {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  categoryId: string;
  category: Category;
  location: string;
  address: string | null;
  latitude: number;
  longitude: number;
  entryFee: string | null;
  openingHours: string | null;
  bestTime: string | null;
  featuredImage: string;
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  isFeatured: boolean;
}

interface Props {
  attractions: Attraction[];
  categories: Category[];
}

export default function AttractionsManager({ attractions, categories }: Props) {
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Attraction Management ({attractions.length})
          </h1>
          <p className="text-xs text-slate-400">
            Create, moderate, edit coordinates, and manage all Bahir Dar destination listings.
          </p>
        </div>

        {editingAttraction && (
          <button
            onClick={() => setEditingAttraction(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Close Edit Form</span>
          </button>
        )}
      </div>

      {/* EDIT MODAL / INLINE FORM (When an attraction is selected for editing) */}
      {editingAttraction && (
        <div className="bg-slate-900 border-2 border-purple-500/70 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-base">
              <Edit className="w-5 h-5" />
              <span>Modify Attraction: {editingAttraction.title}</span>
            </div>
            <button
              onClick={() => setEditingAttraction(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const formData = new FormData(e.currentTarget);
              await updateAttractionAction(formData);
              setLoading(false);
              setEditingAttraction(null);
            }}
            className="space-y-4 text-xs"
          >
            <input type="hidden" name="id" value={editingAttraction.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Attraction Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingAttraction.title}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  name="categoryId"
                  required
                  defaultValue={editingAttraction.categoryId}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Location / Sub-city</label>
                <input
                  type="text"
                  name="location"
                  required
                  defaultValue={editingAttraction.location}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  defaultValue={editingAttraction.latitude}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  defaultValue={editingAttraction.longitude}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Admission Fee</label>
                <input
                  type="text"
                  name="entryFee"
                  defaultValue={editingAttraction.entryFee || ''}
                  placeholder="e.g. 150 ETB / Free"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Description (Summary)</label>
                <input
                  type="text"
                  name="shortDesc"
                  defaultValue={editingAttraction.shortDesc}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Featured Image URL</label>
                <input
                  type="text"
                  name="featuredImage"
                  defaultValue={editingAttraction.featuredImage}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Detailed Description</label>
              <textarea
                name="description"
                rows={3}
                required
                defaultValue={editingAttraction.description}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={editingAttraction.isFeatured}
                  className="rounded border-slate-800 text-purple-600 focus:ring-0 bg-slate-950"
                />
                <span>Feature on Homepage Hero/Slider</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAttraction(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Create New Attraction Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          <span>Add New Attraction to Database</span>
        </h2>

        <form
          action={async (formData: FormData) => {
            await createAttractionAction(formData);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Attraction Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Dega Estifanos Island"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="categoryId"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location / Sub-city</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Lake Tana North Sector"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                defaultValue={11.5942}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                defaultValue={37.3875}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Admission Fee</label>
              <input
                type="text"
                name="entryFee"
                placeholder="e.g. 150 ETB / Free"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
              <input
                type="text"
                name="shortDesc"
                placeholder="One-sentence teaser"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Featured Image URL</label>
              <input
                type="text"
                name="featuredImage"
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Detailed Description</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Full background, historical context, flora/fauna, boat routes..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                name="isFeatured"
                className="rounded border-slate-800 text-purple-600 focus:ring-0 bg-slate-950"
              />
              <span>Feature on Homepage Hero/Slider</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Attraction</span>
            </button>
          </div>
        </form>
      </div>

      {/* Attractions List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-bold text-base text-white">All Attractions List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Attraction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {attractions.map((att) => (
                <tr key={att.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={att.featuredImage}
                      alt={att.title}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <span className="truncate max-w-[180px]">{att.title}</span>
                  </td>
                  <td className="py-3.5 px-4">{att.category.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{att.location}</td>
                  <td className="py-3.5 px-4 font-semibold text-amber-400">
                    ★ {att.rating.toFixed(1)} ({att.reviewCount})
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={async () => {
                        await toggleAttractionApprovalAction(att.id, !att.isApproved);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        att.isApproved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {att.isApproved ? 'Approved' : 'Hidden'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAttraction(att);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-1.5 text-purple-400 hover:text-purple-300 rounded-lg hover:bg-purple-950/40 transition-colors"
                        title="Edit Attraction Attributes"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/attractions/${att.id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="View Live Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete "${att.title}"?`)) {
                            await deleteAttractionAction(att.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
