import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AttractionCard from '@/components/AttractionCard';
import { Search, Filter, Compass, MapPin, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function AttractionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || '';
  const selectedCategory = params.category || '';
  const sort = params.sort || 'rating';

  const user = await getCurrentUser();

  // Categories for filter pills
  const categories = await prisma.category.findMany();

  // Build Prisma query filter
  const where: any = {
    isApproved: true,
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { location: { contains: q } },
    ];
  }

  if (selectedCategory) {
    where.category = {
      slug: selectedCategory,
    };
  }

  let orderBy: any = { rating: 'desc' };
  if (sort === 'title') {
    orderBy = { title: 'asc' };
  } else if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  const attractions = await prisma.attraction.findMany({
    where,
    include: { category: true },
    orderBy,
  });

  // User favorites
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
              Discover Destinations
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Explore Bahir Dar Attractions
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              From island monasteries and historical palaces to the roaring waterfalls of Tis Abay and tranquil hippo sanctuaries on Lake Tana.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
            <form method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search attraction name, monastery, falls..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              {/* Category selector */}
              <div className="sm:col-span-3">
                <select
                  name="category"
                  defaultValue={selectedCategory}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort selector */}
              <div className="sm:col-span-2">
                <select
                  name="sort"
                  defaultValue={sort}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700"
                >
                  <option value="rating">Top Rated</option>
                  <option value="title">Alphabetical</option>
                  <option value="newest">Recently Added</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  className="w-full h-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center"
                >
                  Filter
                </button>
              </div>
            </form>

            {/* Category quick pills */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
              <Link
                href="/attractions"
                className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-colors ${
                  !selectedCategory
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Attractions ({attractions.length})
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/attractions?category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {attractions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No attractions found
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Try clearing your search query or selecting a different category.
              </p>
              <Link
                href="/attractions"
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-700"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {attractions.map((attraction) => (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
