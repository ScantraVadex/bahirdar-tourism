import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Tag, User, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { status: 'APPROVED' },
    orderBy: { startDate: 'asc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
              Culture & Festivities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Bahir Dar Events & Cultural Festivals
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Experience the vibrant public celebrations, Timkat Epiphany processions, regatta boat races, and cultural culinary fairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={ev.featuredImage}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900/80 backdrop-blur-md text-white">
                      {ev.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md">
                    {new Date(ev.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="truncate">{ev.organizer}</span>
                    </div>
                    {ev.price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{ev.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
