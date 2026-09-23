import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import RatingStars from '@/components/RatingStars';
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  Compass, 
  ArrowRight, 
  Clock, 
  MapPin,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Counts
  const [favoriteCount, itineraryCount, reviewCount, upcomingItinerary, recentReviews] =
    await Promise.all([
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.itinerary.count({ where: { userId: user.id } }),
      prisma.review.count({ where: { userId: user.id } }),
      prisma.itinerary.findFirst({
        where: { userId: user.id },
        include: {
          items: {
            include: { attraction: true },
            orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }],
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.findMany({
        where: { userId: user.id },
        include: { attraction: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs sm:text-sm font-extrabold text-sky-200 uppercase tracking-wider mb-2 block">
            Welcome to your travel hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Hello, {user.name.split(' ')[0]}! ☀️
          </h1>
          <p className="text-base sm:text-lg text-sky-100 leading-relaxed mb-8">
            Ready to discover Bahir Dar? Access your saved destinations, customize daily itineraries, and organize your trip along Lake Tana and the Blue Nile.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/attractions"
              className="px-6 py-3.5 bg-white text-sky-900 rounded-2xl font-extrabold text-sm shadow-md hover:bg-sky-50 transition-all inline-flex items-center gap-2 hover:scale-105"
            >
              <Compass className="w-5 h-5 text-sky-600" />
              <span>Explore Attractions</span>
            </Link>
            <Link
              href="/dashboard/trips"
              className="px-6 py-3.5 bg-sky-700/80 border border-sky-400/40 text-white rounded-2xl font-extrabold text-sm hover:bg-sky-700 transition-all inline-flex items-center gap-2 hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex items-center gap-5 hover:border-rose-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">
              {favoriteCount}
            </span>
            <span className="text-sm font-bold text-slate-500">
              Saved Favorites
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex items-center gap-5 hover:border-sky-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">
              {itineraryCount}
            </span>
            <span className="text-sm font-bold text-slate-500">
              Trip Itineraries
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex items-center gap-5 hover:border-amber-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">
              {reviewCount}
            </span>
            <span className="text-sm font-bold text-slate-500">
              Reviews Given
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Trip Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Featured Itinerary
            </h2>
            <p className="text-xs text-slate-500">Your latest planned trip</p>
          </div>
          <Link
            href="/dashboard/trips"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
          >
            <span>Manage All Trips</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingItinerary ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {upcomingItinerary.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {upcomingItinerary.description || 'Custom itinerary'}
                </p>
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg w-fit">
                {upcomingItinerary.durationDays} Days Plan ({upcomingItinerary.items.length} Activities)
              </span>
            </div>

            {/* Activities preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingItinerary.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.attraction.featuredImage}
                      alt={item.attraction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold text-sky-600 uppercase">
                        Day {item.dayNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.timeSlot}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {item.attraction.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              You haven't created a trip yet. Start planning your Bahir Dar adventure!
            </p>
            <Link
              href="/dashboard/trips"
              className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-700"
            >
              Create First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Your Recent Reviews
            </h2>
            <Link
              href="/dashboard/reviews"
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {rev.attraction.title}
                  </h4>
                  <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                </div>
                <RatingStars rating={rev.rating} size="sm" showNumber={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
