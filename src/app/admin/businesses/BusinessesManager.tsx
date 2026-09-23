'use client';

import { useState } from 'react';
import { 
  createBusinessAction, 
  updateBusinessAction, 
  updateBusinessStatusAction, 
  deleteBusinessAction 
} from '@/actions/admin';
import { Check, X, Pencil, XCircle, Plus, Trash2, Upload, Building2, Store } from 'lucide-react';

type Business = {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string | null;
  location: string;
  priceRange: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  featuredImage: string;
  status: string;
  rating: number;
};

type Props = {
  businesses: Business[];
};

export default function BusinessesManager({ businesses: initial }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>(initial);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editImage, setEditImage] = useState<string>('');
  const [createImage, setCreateImage] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Handle image upload from computer for Edit form
  function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Handle image upload from computer for Create form
  function handleCreateImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCreateImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    if (createImage) {
      fd.set('featuredImage', createImage);
    }
    const result = (await createBusinessAction(fd)) as {
      success?: boolean;
      error?: string;
      business?: Business;
    };
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else if (result?.business) {
      setBusinesses((prev) => [result.business!, ...prev]);
      setIsAdding(false);
      setCreateImage('');
    }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingBiz) return;
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    fd.append('id', editingBiz.id);
    if (editImage) {
      fd.set('featuredImage', editImage);
    }
    const result = (await updateBusinessAction(fd)) as { success?: boolean; error?: string };
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      const updatedImage = (fd.get('featuredImage') as string) || editImage || editingBiz.featuredImage;
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === editingBiz.id
            ? {
                ...b,
                name: fd.get('name') as string,
                type: fd.get('type') as string,
                description: fd.get('description') as string,
                location: fd.get('location') as string,
                address: fd.get('address') as string,
                priceRange: fd.get('priceRange') as string,
                phone: fd.get('phone') as string,
                email: fd.get('email') as string,
                website: fd.get('website') as string,
                featuredImage: updatedImage,
                status: fd.get('status') as string,
              }
            : b
        )
      );
      setEditingBiz(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Business &amp; Hotel Directory ({businesses.length})
          </h1>
          <p className="text-xs text-slate-400">
            Add new hotels, restaurants, resorts, and eco-boat associations, or manage existing listings.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingBiz(null);
            setCreateImage('');
          }}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 shrink-0"
        >
          {isAdding ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Hotel / Restaurant</span>
            </>
          )}
        </button>
      </div>

      {/* ADD NEW BUSINESS FORM */}
      {isAdding && (
        <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Add New Hotel, Restaurant or Business Listing
            </h2>
            <button
              onClick={() => setIsAdding(false)}
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

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Business Name *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Grand Resort & Spa Bahir Dar"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category / Type *
              </label>
              <select
                name="type"
                defaultValue="HOTEL"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="HOTEL">HOTEL &amp; RESORT</option>
                <option value="RESTAURANT">RESTAURANT &amp; CAFE</option>
                <option value="ECO_BOAT">ECO BOAT ASSOCIATION</option>
                <option value="TOUR_OPERATOR">TOUR OPERATOR</option>
                <option value="CULTURE">CULTURAL CLUB</option>
                <option value="HANDICRAFT">HANDICRAFT &amp; SOUVENIR</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="Provide amenities, services, specialties, Lake Tana view details..."
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Location *
              </label>
              <input
                name="location"
                required
                placeholder="e.g. Lakefront Boulevard, Kebele 03"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Address
              </label>
              <input
                name="address"
                placeholder="e.g. Near Lake Tana Port"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Price Range
              </label>
              <select
                name="priceRange"
                defaultValue="$$"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="$">$ (Budget / Economic)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Luxury / High End)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                name="phone"
                placeholder="+251 58 220 0000"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="contact@hotel.com"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Website URL
              </label>
              <input
                name="website"
                placeholder="https://..."
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Image Input + Local File Upload */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Featured Cover Image
              </label>
              <div className="flex gap-2 items-center">
                <input
                  name="featuredImage"
                  type="text"
                  value={createImage}
                  onChange={(e) => setCreateImage(e.target.value)}
                  placeholder="https://... or choose file from computer"
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <label className="px-4 py-2.5 bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 rounded-xl cursor-pointer font-bold shrink-0 flex items-center gap-1.5 transition-colors text-xs">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCreateImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Live Preview */}
            {createImage && (
              <div className="md:col-span-2 flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                <img
                  src={createImage}
                  alt="Preview"
                  className="w-20 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                />
                <span className="text-xs text-slate-400">
                  Image loaded cleanly and ready for publishing
                </span>
              </div>
            )}

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'Publishing…' : 'Publish Listing'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INLINE EDIT FORM */}
      {editingBiz && (
        <div className="bg-slate-900 border border-purple-700 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-purple-400" />
              Edit Business: <span className="text-purple-400">{editingBiz.name}</span>
            </h2>
            <button
              onClick={() => setEditingBiz(null)}
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
                Business Name *
              </label>
              <input
                name="name"
                defaultValue={editingBiz.name}
                required
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Type *
              </label>
              <select
                name="type"
                defaultValue={editingBiz.type}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="HOTEL">HOTEL &amp; RESORT</option>
                <option value="RESTAURANT">RESTAURANT &amp; CAFE</option>
                <option value="ECO_BOAT">ECO BOAT ASSOCIATION</option>
                <option value="TOUR_OPERATOR">TOUR OPERATOR</option>
                <option value="CULTURE">CULTURAL CLUB</option>
                <option value="HANDICRAFT">HANDICRAFT &amp; SOUVENIR</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                defaultValue={editingBiz.description}
                required
                rows={3}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Location *
              </label>
              <input
                name="location"
                defaultValue={editingBiz.location}
                required
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Address
              </label>
              <input
                name="address"
                defaultValue={editingBiz.address ?? ''}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Price Range
              </label>
              <input
                name="priceRange"
                defaultValue={editingBiz.priceRange ?? ''}
                placeholder="e.g. $, $$, $$$"
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={editingBiz.phone ?? ''}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={editingBiz.email ?? ''}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Website
              </label>
              <input
                name="website"
                defaultValue={editingBiz.website ?? ''}
                placeholder="https://..."
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Featured Image Input + Upload */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Featured Cover Image
              </label>
              <div className="flex gap-2 items-center">
                <input
                  name="featuredImage"
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <label className="px-4 py-2.5 bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 rounded-xl cursor-pointer font-bold shrink-0 flex items-center gap-1.5 transition-colors text-xs">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Live Preview */}
            {editImage && (
              <div className="md:col-span-2 flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                <img
                  src={editImage}
                  alt="Preview"
                  className="w-20 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                />
                <span className="text-xs text-slate-400">
                  Image preview updated cleanly
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                defaultValue={editingBiz.status}
                className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingBiz(null)}
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

      {/* Businesses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={biz.featuredImage}
                        alt={biz.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                      />
                      <div>
                        <span className="text-sm">{biz.name}</span>
                        <span className="block text-[10px] text-amber-400 font-semibold">
                          ★ {biz.rating.toFixed(1)} ({biz.priceRange || '$$'})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {biz.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-medium">{biz.location}</td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <div>{biz.phone || 'No phone'}</div>
                    <div className="text-[10px] text-slate-500">{biz.email || ''}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        biz.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {biz.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingBiz(biz);
                          setEditImage(biz.featuredImage);
                          setIsAdding(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-1.5 bg-purple-950 text-purple-400 hover:bg-purple-900 border border-purple-800 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Approve/Suspend */}
                      {biz.status !== 'APPROVED' ? (
                        <button
                          onClick={async () => {
                            await updateBusinessStatusAction(biz.id, 'APPROVED');
                            setBusinesses((prev) =>
                              prev.map((b) =>
                                b.id === biz.id ? { ...b, status: 'APPROVED' } : b
                              )
                            );
                          }}
                          className="p-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await updateBusinessStatusAction(biz.id, 'REJECTED');
                            setBusinesses((prev) =>
                              prev.map((b) =>
                                b.id === biz.id ? { ...b, status: 'REJECTED' } : b
                              )
                            );
                          }}
                          className="p-1.5 bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px]"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={async () => {
                          if (confirm(`Delete business listing "${biz.name}"?`)) {
                            await deleteBusinessAction(biz.id);
                            setBusinesses((prev) => prev.filter((b) => b.id !== biz.id));
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete Listing"
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

