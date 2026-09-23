import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RatingStars from '@/components/RatingStars';
import { Utensils, MapPin, Clock, Phone, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RestaurantsPage() {
  const restaurants = await prisma.business.findMany({
    where: { type: 'RESTAURANT', status: 'APPROVED' },
    orderBy: { rating: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
              Culinary & Dining
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Bahir Dar Restaurants & Lakeside Dining
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Experience fresh Lake Tana grilled fish ("Asa"), savory traditional injera platters, honey wine (Tej), and live cultural music.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((rest) => {
              const facilities: string[] = rest.facilities
                ? JSON.parse(rest.facilities)
                : [];

              return (
                <div
                  key={rest.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rest.featuredImage}
                      alt={rest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900/80 backdrop-blur-md text-white">
                        {rest.cuisineType || 'Traditional Ethiopian'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold">
                      <RatingStars rating={rest.rating} size="sm" />
                      <span className="text-amber-300 font-bold">{rest.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{rest.location}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {rest.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {rest.description}
                      </p>

                      {facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {facilities.map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-semibold rounded-lg border border-amber-200/50"
                            >
                              {fac}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                      {rest.openingHours && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{rest.openingHours}</span>
                        </div>
                      )}
                      {rest.phone && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{rest.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
