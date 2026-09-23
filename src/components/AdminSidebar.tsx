'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  MapPin, 
  FolderTree, 
  Users, 
  MessageSquare, 
  Calendar, 
  Building2,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Analytics & Overview', icon: LayoutDashboard },
    { href: '/admin/attractions', label: 'Attractions', icon: MapPin },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/users', label: 'Users & Roles', icon: Users },
    { href: '/admin/reviews', label: 'Reviews Moderation', icon: MessageSquare },
    { href: '/admin/events', label: 'Events & Festivals', icon: Calendar },
    { href: '/admin/businesses', label: 'Businesses & Hotels', icon: Building2 },
  ];

  return (
    <aside className="w-full lg:w-96 bg-slate-900 text-slate-300 rounded-3xl p-8 shadow-2xl flex flex-col justify-between shrink-0 border border-slate-800">
      <div>
        {/* Admin Header */}
        <div className="flex items-center gap-4 pb-7 mb-7 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-black text-xl text-white">Admin Portal</h2>
            <span className="text-xs text-purple-400 font-extrabold uppercase tracking-widest mt-1 block">
              Bahir Dar Tourism
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-base font-extrabold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-8 mt-10 border-t border-slate-800 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-3.5 px-5 py-3 text-base font-extrabold text-sky-400 hover:bg-slate-800 rounded-2xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 shrink-0" />
          <span>Back to Live Website</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3.5 px-5 py-3 text-base font-extrabold text-rose-400 hover:bg-rose-950/40 rounded-2xl transition-colors"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
