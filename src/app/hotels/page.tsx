import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RatingStars from '@/components/RatingStars';

import { Hotel, MapPin, Phone, Mail, Globe, Wifi, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HotelsPage() {
  const hotels = await prisma.business.findMany({
    where: { type: 'HOTEL', status: 'APPROVED' },
    orderBy: { rating: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-deepPurple-600 uppercase tracking-wider mb-2 block">
              Accommodations & Lodging
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-deepPurple-900 tracking-tight mb-4">
              Bahir Dar Hotels & Resorts
            </h1>
            <p className="text-deepPurple-600 text-sm sm:text-base leading-relaxed">
              From luxury waterfront eco-resorts overlooking Lake Tana to comfortable city center hotels near Giorgis roundabout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hotels.map((hotel) => {
              const facilities: string[] = hotel.facilities
                ? JSON.parse(hotel.facilities)
                : [];

              return (
                <div
                  key={hotel.id}
                  className="bg-ivory rounded-3xl border border-deepPurple-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                    <img
                      src={hotel.featuredImage}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gold/80 backdrop-blur-md text-ivory">
                        {hotel.priceRange || '$$$'} Price Tier
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold">
                      <RatingStars rating={hotel.rating} size="sm" />
                      <span className="text-gold font-bold">{hotel.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                              <img src="/icons/map-pin.png" alt="Location" className="w-3.5 h-3.5" />
                        <span>{hotel.location}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {hotel.description}
                      </p>

                      {facilities.length > 0 && (
                        <div className="pt-3 border-t border-deepPurple-100">
                          <span className="text-[11px] font-bold text-deepPurple-400 uppercase tracking-wider block mb-2">
                            Key Amenities
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {facilities.map((fac, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-deepPurple/10 text-deepPurple text-[11px] font-medium rounded-lg"
                              >
                                {fac}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="space-y-1">
                        {hotel.phone && (
                          <div className="flex items-center gap-1.5 font-medium">
                              <img src="/icons/phone.png" alt="Phone" className="w-3.5 h-3.5" />
                            <span>{hotel.phone}</span>
                          </div>
                        )}
                        {hotel.email && (
                          <div className="flex items-center gap-1.5 font-medium">
                              <img src="/icons/mail.png" alt="Email" className="w-3.5 h-3.5" />
                            <span>{hotel.email}</span>
                          </div>
                        )}
                      </div>

                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-deepPurple font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          <img src="/icons/globe.png" alt="Website" className="w-3.5 h-3.5" />
                          <span>Visit Website</span>
                        </a>
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
