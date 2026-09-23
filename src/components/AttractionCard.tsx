import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';
import FavoriteButton from './FavoriteButton';

interface AttractionCardProps {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  featuredImage: string;
  categoryName: string;
  location: string;
  rating: number;
  reviewCount: number;
  isFavorited?: boolean;
}

export default function AttractionCard({
  id,
  title,
  shortDesc,
  featuredImage,
  categoryName,
  location,
  rating,
  reviewCount,
  isFavorited = false,
}: AttractionCardProps) {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      {/* Image Banner */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {categoryName}
          </span>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton attractionId={id} initialFavorited={isFavorited} size="sm" />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium">
          <RatingStars rating={rating} size="sm" />
          <span className="font-bold text-amber-300">{rating.toFixed(1)}</span>
          <span className="text-slate-300 text-[10px]">({reviewCount})</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 mb-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 mb-5 flex-1">
          {shortDesc}
        </p>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Bahir Dar, Ethiopia
          </span>
          <Link
            href={`/attractions/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700 group-hover:translate-x-1 transition-all"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
