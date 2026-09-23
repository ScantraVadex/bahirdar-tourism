'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createItineraryAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be logged in to create a trip itinerary.' };
  }

  const title = (formData.get('title') as string) || 'My Bahir Dar Trip';
  const description = formData.get('description') as string;
  const durationDays = parseInt(formData.get('durationDays') as string, 10) || 3;

  const itinerary = await prisma.itinerary.create({
    data: {
      title,
      description: description || 'Customized Bahir Dar exploration plan',
      durationDays,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard/trips');
  revalidatePath('/dashboard');
  return { success: true, itineraryId: itinerary.id };
}

export async function deleteItineraryAction(itineraryId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const itinerary = await prisma.itinerary.findUnique({
    where: { id: itineraryId },
  });

  if (!itinerary || itinerary.userId !== user.id) {
    return { error: 'Itinerary not found or access denied' };
  }

  await prisma.itinerary.delete({
    where: { id: itineraryId },
  });

  revalidatePath('/dashboard/trips');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function addAttractionToItineraryAction(
  itineraryId: string,
  attractionId: string,
  dayNumber: number,
  timeSlot: string = 'Morning',
  notes: string = ''
) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be logged in to modify trips.' };
  }

  const itinerary = await prisma.itinerary.findUnique({
    where: { id: itineraryId },
    include: { items: true },
  });

  if (!itinerary || itinerary.userId !== user.id) {
    return { error: 'Itinerary not found.' };
  }

  const existingCount = itinerary.items.filter((i) => i.dayNumber === dayNumber).length;

  await prisma.itineraryItem.create({
    data: {
      itineraryId,
      attractionId,
      dayNumber,
      orderIndex: existingCount,
      timeSlot,
      notes: notes || undefined,
    },
  });

  revalidatePath('/dashboard/trips');
  revalidatePath(`/attractions/${attractionId}`);
  return { success: true };
}

export async function removeItemFromItineraryAction(itemId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const item = await prisma.itineraryItem.findUnique({
    where: { id: itemId },
    include: { itinerary: true },
  });

  if (!item || item.itinerary.userId !== user.id) {
    return { error: 'Item not found or permission denied' };
  }

  await prisma.itineraryItem.delete({
    where: { id: itemId },
  });

  revalidatePath('/dashboard/trips');
  return { success: true };
}
