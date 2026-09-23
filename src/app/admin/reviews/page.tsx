import { prisma } from '@/lib/prisma';
import ReviewsManager from './ReviewsManager';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      attraction: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <ReviewsManager reviews={reviews} />;
}

