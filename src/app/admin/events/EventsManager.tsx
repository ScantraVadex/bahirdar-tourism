'use client';

import { useState } from 'react';
import { 
  createEventAction, 
  updateEventAction, 
  deleteEventAction 
} from '@/actions/admin';
import { Calendar, Plus, Trash2, Edit, X, Save, Upload, Image as ImageIcon } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: string;
  location: string;
  venue: string;
  startDate: Date;
  organizer: string;
  featuredImage: string;
  description: string;
  price?: string | null;
}

export default function EventsManager({ events: initialEvents }: { events: EventItem[] }) {
  const [eventList, setEventList] = useState<EventItem[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingImage, setEditingImage] = useState<string>('');
  const [createImage, setCreateImage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Handle image upload from computer for Edit form
  function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditingImage(reader.result);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Events &amp; Festivals Management ({eventList.length})
          </h1>
          <p className="text-xs text-slate-400">
            Create, schedule, edit, replace event images, and curate cultural gatherings.
          </p>
        </div>

        {editingEvent && (
          <button
            onClick={() => setEditingEvent(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Close Edit Form</span>
          </button>
        )}
      </div>

      {/* EDIT EVENT FORM */}
      {editingEvent && (
        <div className="bg-slate-900 border-2 border-purple-500/70 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Edit className="w-4 h-4" />
              <span>Modify Event: {editingEvent.title}</span>
            </div>
            <button
              onClick={() => setEditingEvent(null)}
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
              await updateEventAction(formData);

              const updatedImage = (formData.get('featuredImage') as string) || editingImage;
              setEventList((prev) =>
                prev.map((ev) =>
                  ev.id === editingEvent.id
                    ? {
                        ...ev,
                        title: formData.get('title') as string,
                        category: formData.get('category') as string,
                        startDate: new Date(formData.get('startDate') as string),
                        location: formData.get('location') as string,
                        organizer: formData.get('organizer') as string,
                        featuredImage: updatedImage,
                        description: formData.get('description') as string,
                      }
                    : ev
                )
              );

              setLoading(false);
              setEditingEvent(null);
            }}
            className="space-y-4 text-xs"
          >
            <input type="hidden" name="id" value={editingEvent.id} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingEvent.title}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editingEvent.category}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  <option value="Religious & Cultural">Religious &amp; Cultural</option>
                  <option value="Food & Festival">Food &amp; Festival</option>
                  <option value="Music & Arts">Music &amp; Arts</option>
                  <option value="Sports & Regatta">Sports &amp; Regatta</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  defaultValue={new Date(editingEvent.startDate).toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  defaultValue={editingEvent.location}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  defaultValue={editingEvent.organizer}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              {/* Event Image Input + Disk Upload */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Featured Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="featuredImage"
                    value={editingImage}
                    onChange={(e) => setEditingImage(e.target.value)}
                    placeholder="URL or upload from computer..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium text-[11px]"
                  />
                  <label className="px-3 py-2 bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 rounded-xl cursor-pointer font-bold shrink-0 flex items-center gap-1 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Live Image Preview */}
            {editingImage && (
              <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                <img
                  src={editingImage}
                  alt="Preview"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                />
                <span className="text-[11px] text-slate-400 truncate">
                  Image preview updated cleanly
                </span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Event Description *</label>
              <textarea
                name="description"
                required
                rows={2}
                defaultValue={editingEvent.description}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Event Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-400" />
          <span>Publish New Event</span>
        </h2>

        <form
          action={async (formData: FormData) => {
            if (createImage) {
              formData.set('featuredImage', createImage);
            }
            await createEventAction(formData);
            setCreateImage('');
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Event Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Lake Tana Regatta"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="category"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="Religious & Cultural">Religious &amp; Cultural</option>
                <option value="Food & Festival">Food &amp; Festival</option>
                <option value="Music & Arts">Music &amp; Arts</option>
                <option value="Sports & Regatta">Sports &amp; Regatta</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Start Date *</label>
              <input
                type="datetime-local"
                name="startDate"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Lakefront Promenade"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Organizer</label>
              <input
                type="text"
                name="organizer"
                placeholder="e.g. Amhara Culture & Tourism Bureau"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            {/* Create Image Input + Local File Upload */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Featured Image</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  name="featuredImage"
                  value={createImage}
                  onChange={(e) => setCreateImage(e.target.value)}
                  placeholder="https://... or upload image"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium text-[11px]"
                />
                <label className="px-3 py-2 bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 rounded-xl cursor-pointer font-bold shrink-0 flex items-center gap-1 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCreateImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {createImage && (
            <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
              <img
                src={createImage}
                alt="Preview"
                className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
              />
              <span className="text-[11px] text-slate-400">
                Local image loaded successfully
              </span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Event Description *</label>
            <textarea
              name="description"
              required
              rows={2}
              placeholder="Provide event details, scheduled times, ticket/free status..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Organizer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {eventList.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={ev.featuredImage}
                      alt={ev.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                    />
                    <span>{ev.title}</span>
                  </td>
                  <td className="py-3.5 px-4">{ev.category}</td>
                  <td className="py-3.5 px-4 text-purple-400 font-semibold">
                    {new Date(ev.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{ev.location}</td>
                  <td className="py-3.5 px-4">{ev.organizer}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEvent(ev);
                          setEditingImage(ev.featuredImage);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-1.5 text-purple-400 hover:text-purple-300 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 font-bold text-[11px]"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete event "${ev.title}"?`)) {
                            await deleteEventAction(ev.id);
                            setEventList((prev) => prev.filter((item) => item.id !== ev.id));
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete Event"
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

