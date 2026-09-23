import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createItineraryAction, deleteItineraryAction, removeItemFromItineraryAction } from '@/actions/itinerary';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Compass, 
  ChevronRight,
  Printer
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const itineraries = await prisma.itinerary.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          attraction: {
            include: { category: true },
          },
        },
        orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* Header & Create Trip Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 text-sky-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Itinerary Builder</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Personal Trip Planner
            </h1>
          </div>
        </div>

        {/* Quick Create Trip Form */}
        <form
          action={async (formData: FormData) => {
            'use server';
            await createItineraryAction(formData);
          }}
          className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4"
        >
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Create a New Trip
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                name="title"
                required
                placeholder="Trip name (e.g. My 3-Day Bahir Dar Adventure)"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
            <div className="sm:col-span-3">
              <select
                name="durationDays"
                defaultValue={3}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
              >
                <option value={1}>1 Day Trip</option>
                <option value={2}>2 Days Trip</option>
                <option value={3}>3 Days (Recommended)</option>
                <option value={4}>4 Days Trip</option>
                <option value={5}>5 Days Trip</option>
                <option value={7}>1 Week Trip</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Itinerary</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Itineraries List */}
      {itineraries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-sky-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No itineraries yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create your first trip above, then browse attractions and click "Add to My Trip" to organize your days!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {itineraries.map((itinerary) => {
            // Group items by day
            const daysMap: Record<number, typeof itinerary.items> = {};
            for (let d = 1; d <= itinerary.durationDays; d++) {
              daysMap[d] = [];
            }
            itinerary.items.forEach((item) => {
              if (!daysMap[item.dayNumber]) daysMap[item.dayNumber] = [];
              daysMap[item.dayNumber].push(item);
            });

            return (
              <div
                key={itinerary.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Itinerary Header */}
                <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {itinerary.durationDays} Days Itinerary
                      </span>
                      <span className="text-xs text-slate-400">
                        {itinerary.items.length} total activities planned
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {itinerary.title}
                    </h2>
                    {itinerary.description && (
                      <p className="text-xs text-slate-300 mt-1">
                        {itinerary.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/attractions"
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Attractions</span>
                    </Link>
                    <form
                      action={async () => {
                        'use server';
                        await deleteItineraryAction(itinerary.id);
                      }}
                    >
                      <button
                        type="submit"
                        title="Delete Itinerary"
                        className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Day-by-Day Timeline */}
                <div className="p-6 sm:p-8 space-y-8">
                  {Array.from({ length: itinerary.durationDays }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const items = daysMap[dayNum] || [];

                    return (
                      <div key={dayNum} className="relative pl-6 sm:pl-8 border-l-2 border-sky-200">
                        {/* Day indicator badge */}
                        <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                          D{dayNum}
                        </div>

                        <div className="mb-4">
                          <h3 className="font-extrabold text-base text-slate-900">
                            Day {dayNum} Itinerary
                          </h3>
                          <span className="text-xs text-slate-500">
                            {items.length} destination{items.length === 1 ? '' : 's'} scheduled
                          </span>
                        </div>

                        {items.length === 0 ? (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                            <span>No attractions scheduled for Day {dayNum} yet.</span>
                            <Link
                              href="/attractions"
                              className="text-sky-600 font-bold hover:underline"
                            >
                              Browse to add →
                            </Link>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 hover:shadow-md transition-all group"
                              >
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                  <img
                                    src={item.attraction.featuredImage}
                                    alt={item.attraction.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                                      {item.timeSlot || 'Morning'}
                                    </span>
                                    <form
                                      action={async () => {
                                        'use server';
                                        await removeItemFromItineraryAction(item.id);
                                      }}
                                    >
                                      <button
                                        type="submit"
                                        title="Remove item"
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </form>
                                  </div>

                                  <h4 className="font-bold text-sm text-slate-900 truncate mb-1">
                                    {item.attraction.title}
                                  </h4>

                                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 mb-2 truncate">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span>{item.attraction.location}</span>
                                  </p>

                                  {item.notes && (
                                    <p className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded-lg border border-slate-100">
                                      "{item.notes}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
