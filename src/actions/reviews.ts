'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReviewAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be logged in to submit a review.' };
  }

  const attractionId = formData.get('attractionId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const comment = formData.get('comment') as string;

  if (!attractionId || !rating || !comment || comment.trim().length < 5) {
    return { error: 'Please select a star rating and provide a comment of at least 5 characters.' };
  }

  await prisma.review.create({
    data: {
      rating,
      comment: comment.trim(),
      status: 'APPROVED', // Auto-approved or moderate in admin
      userId: user.id,
      attractionId,
    },
  });

  // Recalculate attraction average rating
  const reviews = await prisma.review.findMany({
    where: { attractionId, status: 'APPROVED' },
    select: { rating: true },
  });

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = reviews.length > 0 ? Number((total / reviews.length).toFixed(1)) : 5.0;

  await prisma.attraction.update({
    where: { id: attractionId },
    data: {
      rating: avg,
      reviewCount: reviews.length,
    },
  });

  revalidatePath(`/attractions/${attractionId}`);
  revalidatePath('/dashboard/reviews');
  revalidatePath('/dashboard');
  return { success: true, message: 'Your review has been submitted successfully!' };
}

export async function deleteReviewAction(reviewId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return { error: 'Review not found' };
  }

  if (review.userId !== user.id && user.role !== 'ADMIN') {
    return { error: 'You are not allowed to delete this review' };
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  // Update attraction stats
  const reviews = await prisma.review.findMany({
    where: { attractionId: review.attractionId, status: 'APPROVED' },
    select: { rating: true },
  });

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = reviews.length > 0 ? Number((total / reviews.length).toFixed(1)) : 5.0;

  await prisma.attraction.update({
    where: { id: review.attractionId },
    data: {
      rating: avg,
      reviewCount: reviews.length,
    },
  });

  revalidatePath(`/attractions/${review.attractionId}`);
  revalidatePath('/dashboard/reviews');
  revalidatePath('/admin/reviews');
  return { success: true };
}
