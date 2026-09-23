import Link from 'next/link';
import { Compass, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xl text-slate-900 leading-none block">
              Bahir Dar
            </span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Tourism Experience
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Enter your account email to receive a password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          <form className="space-y-4" action="/login">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Remembered your password?{' '}
            <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
