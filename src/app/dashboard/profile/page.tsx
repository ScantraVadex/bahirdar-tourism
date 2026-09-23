'use client';

import { useState, useEffect, useRef } from 'react';
import { updateProfileAction } from '@/actions/auth';
import { 
  User, 
  Mail, 
  CheckCircle2, 
  Edit3, 
  Camera, 
  Save, 
  X, 
  Lock, 
  Upload,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    bio: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            role: data.role || '',
            status: data.status || 'ACTIVE',
            bio: data.bio || '',
            avatar: data.avatar || '',
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    }
    loadUser();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file (PNG, JPG, JPEG, WEBP).' });
      return;
    }

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 4MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, avatar: base64 }));
      setMessage(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const data = new FormData();
    data.set('name', formData.name);
    data.set('bio', formData.bio);
    data.set('avatar', formData.avatar);
    if (formData.newPassword) {
      data.set('currentPassword', formData.currentPassword);
      data.set('newPassword', formData.newPassword);
    }

    try {
      const res = await updateProfileAction(data);
      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Profile Settings
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Manage your personal information, profile photo, and security
            </p>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setMessage(null);
              }}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md shadow-sky-600/20 inline-flex items-center gap-2 hover:scale-105"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setMessage(null);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-2xl transition-all inline-flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* View or Edit Container */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-8">
        {!isEditing ? (
          /* READ-ONLY VIEW */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100 text-center sm:text-left">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-slate-100 shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-black text-4xl flex items-center justify-center shadow-lg shrink-0">
                  {formData.name ? formData.name[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">{formData.name}</h2>
                <p className="text-sm font-medium text-slate-500">{formData.email}</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-black bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                    {formData.role} Account
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-slate-900 font-extrabold text-base block">{formData.name}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                <span className="text-slate-900 font-extrabold text-base block">{formData.email}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Account Role</span>
                <span className="text-slate-900 font-extrabold text-base block">{formData.role}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Account Status</span>
                <span className="text-emerald-700 font-extrabold text-base flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{formData.status}</span>
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">
                Bio / Traveler Notes
              </span>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {formData.bio || 'No bio provided yet. Click "Edit Profile" to add details about your travel passions and experiences in Bahir Dar!'}
              </p>
            </div>
          </div>
        ) : (
          /* EDIT FORM */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-sky-600" />
                <span>Profile Picture</span>
              </label>

              {/* Upload Box */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-7 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-sky-400 transition-colors">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    className="w-24 h-24 rounded-3xl object-cover shadow-md border-2 border-white shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-black text-3xl flex items-center justify-center shadow-md shrink-0">
                    {formData.name ? formData.name[0].toUpperCase() : 'U'}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Upload a photo from your computer
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supports JPG, PNG, WEBP files up to 4MB
                    </p>
                  </div>

                  {/* Hidden native file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-2 hover:scale-105"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose From Disk</span>
                    </button>

                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, avatar: '' }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-3 text-base bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Bio / Traveler Notes
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself, your favorite monasteries, or travel plans in Bahir Dar..."
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
              />
            </div>

            {/* Password Change Section (Optional) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                <Lock className="w-5 h-5 text-sky-600" />
                <span>Change Password (optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    minLength={6}
                    value={formData.newPassword}
                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-md shadow-sky-600/25 inline-flex items-center gap-2 hover:scale-105 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setMessage(null);
                }}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
