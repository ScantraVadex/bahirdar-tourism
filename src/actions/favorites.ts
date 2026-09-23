'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleFavoriteAction(attractionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be logged in to save favorites.', favorited: false };
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_attractionId: {
        userId: user.id,
        attractionId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    revalidatePath('/attractions');
    revalidatePath(`/attractions/${attractionId}`);
    revalidatePath('/dashboard/favorites');
    revalidatePath('/dashboard');
    return { favorited: false, success: true };
  } else {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        attractionId,
      },
    });
    revalidatePath('/attractions');
    revalidatePath(`/attractions/${attractionId}`);
    revalidatePath('/dashboard/favorites');
    revalidatePath('/dashboard');
    return { favorited: true, success: true };
  }
}
