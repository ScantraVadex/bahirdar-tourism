import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RatingStars from '@/components/RatingStars';
import FavoriteButton from '@/components/FavoriteButton';
import AddToTripModal from '@/components/AddToTripModal';
import ReviewForm from '@/components/ReviewForm';
import MapComponent from '@/components/MapComponent';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Sparkles, 
  Compass, 
  ArrowLeft,
  Share2,
  MessageSquare
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AttractionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const attraction = await prisma.attraction.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      isApproved: true,
    },
    include: {
      category: true,
      reviews: {
        where: { status: 'APPROVED' },
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!attraction) {
    notFound();
  }

  // Check if current user has favorited
  const favorite = user
    ? await prisma.favorite.findUnique({
        where: {
          userId_attractionId: {
            userId: user.id,
            attractionId: attraction.id,
          },
        },
      })
    : null;

  // Get user itineraries for "Add to Trip" modal
  const userItineraries = user
    ? await prisma.itinerary.findMany({
        where: { userId: user.id },
        select: { id: true, title: true, durationDays: true },
      })
    : [];

  const activities: string[] = attraction.activities
    ? JSON.parse(attraction.activities)
    : [];
  const highlights: string[] = attraction.highlights
    ? JSON.parse(attraction.highlights)
    : [];
  const gallery: string[] = attraction.gallery
    ? JSON.parse(attraction.gallery)
    : [attraction.featuredImage];

  const mapMarker = [
    {
      id: attraction.id,
      title: attraction.title,
      type: 'attraction' as const,
      category: attraction.category.name,
      latitude: attraction.latitude,
      longitude: attraction.longitude,
      image: attraction.featuredImage,
      rating: attraction.rating,
      url: `/attractions/${attraction.id}`,
      address: attraction.location,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Back Link Bar */}
        <div className="bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link
              href="/attractions"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all attractions</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Category: <span className="font-bold text-slate-800">{attraction.category.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={attraction.featuredImage}
              alt={attraction.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-sky-600/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  {attraction.category.name}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-amber-300">
                  <RatingStars rating={attraction.rating} size="sm" />
                  <span>{attraction.rating.toFixed(1)}</span>
                  <span className="text-slate-300 font-normal">
                    ({attraction.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                {attraction.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{attraction.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">
                    Overview & Background
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {attraction.description}
                  </p>
                </div>

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Experience Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {activities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Popular Activities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activities.map((act, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200/60 text-xs font-semibold"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Gallery */}
              {gallery.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`${attraction.title} photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Location Map */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Geographic Location
                    </h3>
                    <p className="text-xs text-slate-500">
                      Coordinates: {attraction.latitude}, {attraction.longitude}
                    </p>
                  </div>
                </div>

                <MapComponent
                  items={mapMarker}
                  center={[attraction.latitude, attraction.longitude]}
                  zoom={13}
                  className="h-80 rounded-2xl overflow-hidden border border-slate-200"
                />
              </div>

              {/* Reviews Section */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-sky-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Traveler Reviews ({attraction.reviews.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                    <RatingStars rating={attraction.rating} size="sm" />
                    <span>{attraction.rating.toFixed(1)} / 5</span>
                  </div>
                </div>

                {/* Review Form */}
                <ReviewForm
                  attractionId={attraction.id}
                  isLoggedIn={Boolean(user)}
                />

                {/* Reviews List */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {attraction.reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">
                      No reviews yet for this attraction. Be the first to share your experience!
                    </p>
                  ) : (
                    attraction.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                              {rev.user.name[0].toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-slate-900">
                                {rev.user.name}
                              </h5>
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          <RatingStars rating={rev.rating} size="sm" />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-10">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Visiting Info Sidebar */}
            <div className="space-y-6">
              {/* Trip Planner Action Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900">
                  Plan Your Experience
                </h3>

                <div className="space-y-2.5">
                  <div className="w-full">
                    <AddToTripModal
                      attractionId={attraction.id}
                      attractionTitle={attraction.title}
                      userItineraries={userItineraries}
                    />
                  </div>

                  <FavoriteButton
                    attractionId={attraction.id}
                    initialFavorited={Boolean(favorite)}
                    showText={true}
                  />
                </div>
              </div>

              {/* Visiting Information Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                  Visiting Information
                </h3>

                <ul className="space-y-4 text-xs">
                  {attraction.entryFee && (
                    <li className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">
                          Admission Fee
                        </span>
                        <span className="text-slate-500">{attraction.entryFee}</span>
                      </div>
                    </li>
                  )}

                  {attraction.openingHours && (
                    <li className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">
                          Opening Hours
                        </span>
                        <span className="text-slate-500">
                          {attraction.openingHours}
                        </span>
                      </div>
                    </li>
                  )}

                  {attraction.bestTime && (
                    <li className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">
                          Best Season / Time
                        </span>
                        <span className="text-slate-500">{attraction.bestTime}</span>
                      </div>
                    </li>
                  )}

                  <li className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Location / Access
                      </span>
                      <span className="text-slate-500">
                        {attraction.address || attraction.location}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
