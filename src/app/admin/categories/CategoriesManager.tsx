'use client';

import { useState } from 'react';
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from '@/actions/admin';
import { FolderTree, Plus, Trash2, Edit, X, Save } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  _count: { attractions: number };
}

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Category Management ({categories.length})
          </h1>
          <p className="text-xs text-slate-400">
            Manage tourism themes, icons, and discovery filters.
          </p>
        </div>

        {editingCategory && (
          <button
            onClick={() => setEditingCategory(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Close Edit Form</span>
          </button>
        )}
      </div>

      {/* EDIT CATEGORY FORM */}
      {editingCategory && (
        <div className="bg-slate-900 border-2 border-purple-500/70 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Edit className="w-4 h-4" />
              <span>Modify Category: {editingCategory.name}</span>
            </div>
            <button
              onClick={() => setEditingCategory(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const formData = new FormData(e.currentTarget);
              await updateCategoryAction(formData);
              setLoading(false);
              setEditingCategory(null);
            }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs"
          >
            <input type="hidden" name="id" value={editingCategory.id} />

            <div className="sm:col-span-4">
              <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingCategory.name}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-semibold text-slate-300 mb-1">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={editingCategory.description || ''}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div className="sm:col-span-3 flex items-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-1/2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create New Category Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          <span>Add New Category</span>
        </h2>

        <form
          action={async (formData: FormData) => {
            await createCategoryAction(formData);
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs"
        >
          <div className="sm:col-span-4">
            <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Wildlife Sanctuaries"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block font-semibold text-slate-300 mb-1">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Short category summary"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-bold text-sm text-white">{cat.name}</h3>
              <p className="text-xs text-slate-400 mb-1">{cat.description || 'No description'}</p>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/60">
                {cat._count.attractions} Attractions
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(cat);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2 text-purple-400 hover:text-purple-300 hover:bg-slate-800 rounded-xl transition-colors"
                title="Edit Category"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Delete category "${cat.name}"?`)) {
                    await deleteCategoryAction(cat.id);
                  }
                }}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
