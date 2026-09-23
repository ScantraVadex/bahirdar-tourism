import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import RatingStars from '@/components/RatingStars';
import { deleteReviewAction } from '@/actions/reviews';
import { MessageSquare, Trash2, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UserReviewsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: {
      attraction: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Travel Reviews ({reviews.length})
            </h1>
            <p className="text-xs text-slate-500">
              Ratings and reviews you've shared with the Bahir Dar community
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
          <p className="text-xs text-slate-500">
            Visit any attraction details page to rate and share your tips with fellow travelers.
          </p>
          <Link
            href="/attractions"
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-700"
          >
            Explore Attractions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {rev.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <Link
                  href={`/attractions/${rev.attraction.id}`}
                  className="font-bold text-base text-slate-900 hover:text-sky-600 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{rev.attraction.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} size="sm" />
                  <span className="text-xs font-bold text-slate-700">
                    {rev.rating} / 5 Stars
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>
              </div>

              <form
                action={async () => {
                  'use server';
                  await deleteReviewAction(rev.id);
                }}
              >
                <button
                  type="submit"
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
