import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AttractionCard from '@/components/AttractionCard';
import { Heart, Compass } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      attraction: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Saved Favorites ({favorites.length})
            </h1>
            <p className="text-xs text-slate-500">
              Places in Bahir Dar you've bookmarked for your trip
            </p>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No favorites saved yet</h3>
          <p className="text-xs text-slate-500">
            Browse our catalog of Bahir Dar attractions and click the heart icon to save places here.
          </p>
          <Link
            href="/attractions"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-700"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Attractions</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((fav) => (
            <AttractionCard
              key={fav.id}
              id={fav.attraction.id}
              slug={fav.attraction.slug}
              title={fav.attraction.title}
              shortDesc={fav.attraction.shortDesc}
              featuredImage={fav.attraction.featuredImage}
              categoryName={fav.attraction.category.name}
              location={fav.attraction.location}
              rating={fav.attraction.rating}
              reviewCount={fav.attraction.reviewCount}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
