import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminCharts from '@/components/AdminCharts';
import { 
  Users, 
  MapPin, 
  Building2, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  Plus,
  ArrowUpRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [userCount, attractionCount, businessCount, reviewCount, eventCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.attraction.count(),
      prisma.business.count(),
      prisma.review.count(),
      prisma.event.count(),
    ]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 text-purple-400 font-extrabold text-sm uppercase tracking-wider mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Bahir Dar Tourism Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl leading-relaxed">
            System overview, tourism metrics, listings moderation, and database management.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/attractions"
            className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>New Attraction</span>
          </Link>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-bold">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{userCount}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-bold">Attractions</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{attractionCount}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-bold">Businesses</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{businessCount}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-bold">Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{reviewCount}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-md hover:border-slate-700 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-bold">Events</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{eventCount}</span>
        </div>
      </div>

      {/* Visual Analytics with Recharts */}
      <AdminCharts />

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/admin/attractions"
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/60 hover:bg-slate-800/90 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-base text-white">Manage Attractions</h3>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Create, update coordinates, publish or unpublish Bahir Dar attractions.
          </p>
        </Link>

        <Link
          href="/admin/reviews"
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/60 hover:bg-slate-800/90 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-base text-white">Moderate Reviews</h3>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Review user feedback, approve testimonials, and maintain community safety.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-purple-500/60 hover:bg-slate-800/90 transition-all group shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-base text-white">User Accounts & Roles</h3>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Assign Admin or Business roles and deactivate spam accounts.
          </p>
        </Link>
      </div>
    </div>
  );
}
