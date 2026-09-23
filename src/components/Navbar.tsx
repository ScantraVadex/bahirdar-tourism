import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from '@/actions/auth';
import MobileNav from './MobileNav';
import { 
  MapPin, 
  LogOut, 
  ShieldCheck, 
} from 'lucide-react';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-20 sm:h-24 lg:h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-slate-200 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="Bahir Dar Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl text-slate-900 leading-tight tracking-tight group-hover:text-sky-600 transition-colors">
                Bahir Dar
              </span>
              <span className="text-[10px] sm:text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
                Tourism Experience
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2.5 text-lg font-bold text-slate-700">
            <Link 
              href="/attractions" 
              className="px-4 py-3 rounded-xl hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              Attractions
            </Link>
            <Link 
              href="/hotels" 
              className="px-4 py-3 rounded-xl hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              Hotels
            </Link>
            <Link 
              href="/restaurants" 
              className="px-4 py-3 rounded-xl hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              Restaurants
            </Link>
            <Link 
              href="/events" 
              className="px-4 py-3 rounded-xl hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              Events
            </Link>
            <Link 
              href="/map" 
              className="px-4 py-3 rounded-xl hover:text-sky-600 hover:bg-sky-50 transition-colors flex items-center gap-2 text-emerald-700 font-extrabold"
            >
              <MapPin className="w-5 h-5 text-emerald-600" />
              Interactive Map
            </Link>
            <Link 
              href="/travel-guide" 
              className="px-4 py-3 rounded-xl hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              Travel Guide
            </Link>
          </nav>

          {/* Desktop User Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-purple-700 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 px-5 py-2.5 text-base font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors shadow-sm"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover shadow-xs border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-black">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    title="Logout"
                    className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-3 text-base font-bold text-slate-700 hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 text-base font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/25 rounded-2xl transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Drawer Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <MobileNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
