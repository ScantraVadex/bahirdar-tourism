'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Heart, 
  Calendar, 
  MessageSquare, 
  User, 
  LogOut,
  Compass
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface DashboardSidebarProps {
  userName: string;
  userEmail: string;
  userRole: string;
  userAvatar?: string | null;
}

export default function DashboardSidebar({
  userName,
  userEmail,
  userRole,
  userAvatar,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/favorites', label: 'My Favorites', icon: Heart },
    { href: '/dashboard/trips', label: 'Trip Itineraries', icon: Calendar },
    { href: '/dashboard/reviews', label: 'My Reviews', icon: MessageSquare },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <aside className="w-full lg:w-96 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md flex flex-col justify-between shrink-0">
      <div>
        {/* User Card */}
        <div className="flex items-center gap-4 pb-7 mb-7 border-b border-slate-100">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-slate-100 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white font-black flex items-center justify-center text-2xl shadow-lg shadow-sky-600/25 shrink-0">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-black text-xl text-slate-900 truncate">
              {userName}
            </span>
            <span className="text-sm font-medium text-slate-500 truncate mt-0.5">{userEmail}</span>
            <span className="mt-2 text-xs font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-lg w-fit border border-sky-200 uppercase tracking-wider">
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-extrabold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-8 mt-10 border-t border-slate-100 space-y-3">
        <Link
          href="/attractions"
          className="flex items-center gap-3.5 px-5 py-3.5 text-base font-extrabold text-emerald-700 hover:bg-emerald-50 rounded-2xl transition-colors"
        >
          <Compass className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>Explore Attractions</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3.5 px-5 py-3.5 text-base font-extrabold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
