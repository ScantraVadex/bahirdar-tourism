import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AttractionCard from '@/components/AttractionCard';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Anchor, 
  SunMedium, 
  Search,
  BookOpen,
  Camera,
  Coffee,
  Shield
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();

  // Fetch featured attractions
  const featuredAttractions = await prisma.attraction.findMany({
    where: { isApproved: true },
    include: { category: true },
    orderBy: { rating: 'desc' },
    take: 6,
  });

  // Fetch user favorites if logged in
  const userFavoriteIds = new Set(
    user
      ? (
          await prisma.favorite.findMany({
            where: { userId: user.id },
            select: { attractionId: true },
          })
        ).map((f) => f.attractionId)
      : []
  );

  // Fetch categories
  const categories = await prisma.category.findMany({
    take: 6,
  });

  // Fetch upcoming events
  const events = await prisma.event.findMany({
    where: { status: 'APPROVED' },
    orderBy: { startDate: 'asc' },
    take: 2,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center bg-slate-900 overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85"
              alt="Bahir Dar Lake Tana & Blue Nile"
              className="w-full h-full object-cover object-center brightness-60 scale-105 animate-in fade-in duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ethiopia's Riviera & UNESCO Biosphere Reserve</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-white tracking-tight leading-none mb-6">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Bahir Dar</span>
            </h1>

            {/* Supporting text */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-200 font-normal leading-relaxed mb-10">
              Where Lake Tana meets the Blue Nile. Explore 14th-century island monasteries, thunderous waterfalls, and rich Ethiopian cultural heritage.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-white/20 mb-8">
              <form action="/attractions" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 px-3 py-2 w-full text-slate-700">
                  <Search className="w-5 h-5 text-sky-600 shrink-0" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search attractions, waterfalls, monasteries, boat tours..."
                    className="w-full text-sm bg-transparent border-none focus:outline-none placeholder:text-slate-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all shrink-0"
                >
                  Search
                </button>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/attractions"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all hover:scale-105"
              >
                Explore Bahir Dar
              </Link>
              <Link
                href={user ? "/dashboard/trips" : "/register"}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm backdrop-blur-md transition-all hover:scale-105"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </section>

        {/* POPULAR ATTRACTIONS */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
                  Iconic Highlights
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Popular Tourist Attractions
                </h2>
              </div>
              <Link
                href="/attractions"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 group"
              >
                <span>View All Attractions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  id={attraction.id}
                  slug={attraction.slug}
                  title={attraction.title}
                  shortDesc={attraction.shortDesc}
                  featuredImage={attraction.featuredImage}
                  categoryName={attraction.category.name}
                  location={attraction.location}
                  rating={attraction.rating}
                  reviewCount={attraction.reviewCount}
                  isFavorited={userFavoriteIds.has(attraction.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY SHOWCASE */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block">
                Tailored Experiences
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore by Interest
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/attractions?category=${category.slug}`}
                  className="group relative flex flex-col items-center p-6 rounded-2xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 hover:border-sky-300 transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-white text-sky-600 shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* WHY VISIT BAHIR DAR */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 block">
                  Why Visit Bahir Dar
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
                  One of Africa's Most Beautiful Palm-Lined Lakeside Cities
                </h2>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Bahir Dar is the capital of the Amhara Region, situated on the southern shore of Lake Tana—the largest lake in Ethiopia and the source of the Blue Nile. With its wide palm avenues, pleasant tropical climate, and deep spiritual heritage, it is an essential jewel on the Ethiopian northern historical circuit.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <Anchor className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">Lake Tana UNESCO Biosphere</h4>
                      <p className="text-xs text-slate-400">Home to 37 islands and over 20 historic Orthodox monasteries dating back to the 14th century.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                      <SunMedium className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">The Majestic Blue Nile Falls</h4>
                      <p className="text-xs text-slate-400">Experience Tis Abay ("Smoking Water") cascading 45 meters into the dramatic volcanic gorge.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">Vibrant Amhara Culture & Fresh Fish Cuisine</h4>
                      <p className="text-xs text-slate-400">Savor fresh grilled Nile perch along the sunset promenade and enjoy spirited Eskista dance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1548625361-195fe5787e91?auto=format&fit=crop&w=1000&q=80"
                    alt="Lake Tana Monasteries"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-5 rounded-2xl shadow-xl max-w-xs border border-slate-100 hidden sm:block">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Safe & Welcoming</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Recognized with UNESCO Peace Cities Prize for its tranquil lakeside lifestyle and warm hospitality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED EVENTS & TRAVEL GUIDE PREVIEW */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Upcoming Events */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1 block">
                      Local Happenings
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      Featured Events & Festivals
                    </h3>
                  </div>
                  <Link href="/events" className="text-xs font-bold text-sky-600 hover:text-sky-700">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={ev.featuredImage}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                            {ev.category}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {new Date(ev.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1 truncate">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                          {ev.description}
                        </p>
                        <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{ev.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Guide Callout */}
              <div className="bg-gradient-to-br from-sky-600 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-sky-200 uppercase tracking-wider mb-2 block">
                    Essential Visitor Information
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                    Bahir Dar Travel & Practical Guide
                  </h3>
                  <p className="text-sm text-sky-100 leading-relaxed mb-6">
                    Everything you need to know before visiting Bahir Dar: Best travel seasons, airport transfers from Ginbot 20 Airport, local Amharic greetings, money exchange, and safety contacts.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-medium text-sky-100">
                    Free Comprehensive Guide
                  </span>
                  <Link
                    href="/travel-guide"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sky-900 font-bold text-xs shadow-md hover:bg-sky-50 transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
