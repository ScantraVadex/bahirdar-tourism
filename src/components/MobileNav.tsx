'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { 
  Menu, 
  X, 
  Compass, 
  Hotel, 
  Utensils, 
  Calendar, 
  MapPin, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface MobileNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  } | null;
}

const navLinks = [
  { href: '/attractions', label: 'Attractions', icon: Compass },
  { href: '/hotels', label: 'Hotels', icon: Hotel },
  { href: '/restaurants', label: 'Restaurants', icon: Utensils },
  { href: '/events', label: 'Events & Festivals', icon: Calendar },
  { href: '/map', label: 'Interactive Map', icon: MapPin, highlight: true },
  { href: '/travel-guide', label: 'Travel Guide', icon: BookOpen },
];

export default function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer automatically when user navigates to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        className="p-2.5 rounded-xl text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-sky-500"
      >
        {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Mobile Menu Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[310px] max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top Header inside drawer */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-900 leading-tight">Bahir Dar</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tourism Portal</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5">
          <p className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Explore Bahir Dar
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-bold text-sm transition-all ${
                  item.highlight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                    : isActive
                    ? 'bg-sky-50 text-sky-600 border border-sky-100'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-sky-600'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.highlight
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1">{item.label}</span>
                {item.highlight && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black uppercase tracking-wider">
                    GIS
                  </span>
                )}
              </Link>
            );
          })}

          {/* User Account / Role Quick Links */}
          {user && (
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
              <p className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                My Travel Account
              </p>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>Tourist Dashboard</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-bold text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Admin Control Center</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Bottom Auth Section inside drawer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-900 truncate">{user.name}</span>
                  <span className="text-xs text-slate-500 truncate">{user.email}</span>
                </div>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-800 bg-white border border-slate-200 font-bold text-sm flex items-center justify-center hover:bg-slate-100 transition-colors shadow-xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-white bg-sky-600 hover:bg-sky-700 font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 transition-all active:scale-98"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
