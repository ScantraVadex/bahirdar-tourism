'use client';

import { useState } from 'react';
import { submitReviewAction } from '@/actions/reviews';
import RatingStars from './RatingStars';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  attractionId: string;
  isLoggedIn: boolean;
}

export default function ReviewForm({ attractionId, isLoggedIn }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-100 text-center">
        <h4 className="font-bold text-slate-900 mb-1">Share Your Experience</h4>
        <p className="text-xs text-slate-600 mb-4">
          Sign in to leave a review, share travel tips, and rate this attraction.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors"
        >
          Sign In to Review
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (comment.trim().length < 5) {
      setError('Please write at least a few words describing your experience.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('attractionId', attractionId);
    formData.append('rating', rating.toString());
    formData.append('comment', comment);

    try {
      const res = await submitReviewAction(null, formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setComment('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
      <h4 className="text-base font-bold text-slate-900 mb-3">Leave a Review & Rating</h4>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Thank you! Your review has been published.</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Rating
        </label>
        <div className="flex items-center gap-3">
          <RatingStars
            rating={rating}
            size="lg"
            interactive={true}
            onChange={(newRating) => setRating(newRating)}
          />
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {rating} Star{rating > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Travel Review
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of the view, entrance accessibility, boat experience, or local guides?"
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs shadow-sky-600/20 transition-all disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{loading ? 'Submitting...' : 'Post Review'}</span>
      </button>
    </form>
  );
}
