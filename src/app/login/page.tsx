'use client';

import Link from 'next/link';
import { useState } from 'react';
import { loginAction } from '@/actions/auth';
import { Compass, Lock, Mail, ArrowRight, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'TOURIST' | 'ADMIN'>('TOURIST');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('expectedRole', selectedRole);

    try {
      const res = await loginAction(null, formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      // Next.js redirect throws a special error which means redirect is happening
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xl text-slate-900 leading-none block">Bahir Dar</span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Tourism Experience</span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sign In to Your Account</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">Choose your account category and enter your credentials to continue.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">

          {/* Category Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Select Login Category
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
              {/* Tourist Tab */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('TOURIST');
                  setError(null);
                }}
                className={`py-3 px-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === 'TOURIST'
                    ? 'bg-white text-sky-700 shadow-sm border border-sky-200 ring-2 ring-sky-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedRole === 'TOURIST' ? 'bg-sky-100 text-sky-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <span>Tourist</span>
                <span className="text-[11px] font-normal opacity-80">Traveler & Explorer</span>
              </button>

              {/* Admin Tab */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ADMIN');
                  setError(null);
                }}
                className={`py-3 px-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center gap-1.5 ${
                  selectedRole === 'ADMIN'
                    ? 'bg-white text-purple-800 shadow-sm border border-purple-200 ring-2 ring-purple-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedRole === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Admin</span>
                <span className="text-[11px] font-normal opacity-80">System Management</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-sky-600 hover:text-sky-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'ADMIN'
                  ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-700/20'
                  : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20'
              } ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-98'}`}
            >
              <span>{loading ? 'Signing In...' : `Sign In as ${selectedRole === 'ADMIN' ? 'Admin' : 'Tourist'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {selectedRole === 'TOURIST' && (
            <p className="text-center text-xs text-slate-500">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-bold text-sky-600 hover:text-sky-700">
                Create Account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
