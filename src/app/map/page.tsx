import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import type { MapMarkerItem } from '@/components/MapInner';
import { MapPin, Compass, Hotel, Utensils, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InteractiveMapPage() {
  const attractions = await prisma.attraction.findMany({
    where: { isApproved: true },
    include: { category: true },
  });

  const businesses = await prisma.business.findMany({
    where: { status: 'APPROVED' },
  });

  const events = await prisma.event.findMany({
    where: { status: 'APPROVED' },
  });

  // Prepare unified map markers
  const markers: MapMarkerItem[] = [
    ...attractions.map((a) => ({
      id: a.id,
      title: a.title,
      type: 'attraction' as const,
      category: a.category.name,
      latitude: a.latitude,
      longitude: a.longitude,
      image: a.featuredImage,
      rating: a.rating,
      url: `/attractions/${a.id}`,
      address: a.location,
    })),
    ...businesses.map((b) => ({
      id: b.id,
      title: b.name,
      type: (b.type === 'HOTEL' ? 'hotel' : 'restaurant') as 'hotel' | 'restaurant',
      category: b.type === 'HOTEL' ? 'Hotel & Resort' : 'Restaurant & Dining',
      latitude: b.latitude,
      longitude: b.longitude,
      image: b.featuredImage,
      rating: b.rating,
      price: b.priceRange || '$$',
      url: b.type === 'HOTEL' ? '/hotels' : '/restaurants',
      address: b.location,
    })),
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      type: 'event' as const,
      category: e.category,
      latitude: 11.5942,
      longitude: 37.3875,
      image: e.featuredImage,
      url: '/events',
      address: e.location,
    })),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>Geographic Explorer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Interactive Bahir Dar & Lake Tana Map
              </h1>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-sky-700">
                <span className="w-3 h-3 rounded-full bg-sky-600 inline-block" />
                Attractions ({attractions.length})
              </span>
              <span className="flex items-center gap-1.5 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" />
                Hotels & Resorts
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                Restaurants & Fish
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
                Festivals & Events
              </span>
            </div>
          </div>

          {/* Full Interactive Map */}
          <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-lg">
            <MapComponent
              items={markers}
              center={[11.5942, 37.3875]}
              zoom={12}
              className="h-[620px] w-full rounded-2xl overflow-hidden"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
