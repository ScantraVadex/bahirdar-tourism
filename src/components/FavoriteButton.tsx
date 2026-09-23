'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavoriteAction } from '@/actions/favorites';

interface FavoriteButtonProps {
  attractionId: string;
  initialFavorited?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function FavoriteButton({
  attractionId,
  initialFavorited = false,
  size = 'md',
  showText = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    // Optimistic update
    const previous = isFavorited;
    setIsFavorited(!previous);

    try {
      const res = await toggleFavoriteAction(attractionId);
      if (res.error) {
        setIsFavorited(previous);
        alert(res.error);
      } else {
        setIsFavorited(Boolean(res.favorited));
      }
    } catch {
      setIsFavorited(previous);
    } finally {
      setLoading(false);
    }
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
      className={`group/fav flex items-center justify-center gap-2 rounded-full transition-all active:scale-90 ${
        showText
          ? isFavorited
            ? 'bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-100'
            : 'bg-white border border-slate-200 text-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50'
          : isFavorited
          ? 'bg-white/95 text-rose-500 shadow-md p-2 hover:bg-rose-50'
          : 'bg-white/90 text-slate-600 shadow-md p-2 hover:text-rose-500 hover:bg-white'
      }`}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          isFavorited ? 'fill-rose-500 text-rose-500' : 'group-hover/fav:scale-110'
        }`}
      />
      {showText && (
        <span>{isFavorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
      )}
    </button>
  );
}
