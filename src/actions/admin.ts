'use server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAttractionAction(formData: FormData) {
  await requireAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const shortDesc = formData.get('shortDesc') as string;
  const categoryId = formData.get('categoryId') as string;
  const location = formData.get('location') as string;
  const address = (formData.get('address') as string) || '';
  const latitude = parseFloat(formData.get('latitude') as string) || 11.5942;
  const longitude = parseFloat(formData.get('longitude') as string) || 37.3875;
  const entryFee = formData.get('entryFee') as string;
  const openingHours = formData.get('openingHours') as string;
  const bestTime = formData.get('bestTime') as string;
  const featuredImage =
    (formData.get('featuredImage') as string) ||
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80';

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  await prisma.attraction.create({
    data: {
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      shortDesc: shortDesc || description.slice(0, 120),
      categoryId,
      location,
      address,
      latitude,
      longitude,
      entryFee,
      openingHours,
      bestTime,
      featuredImage,
      activities: JSON.stringify(['Sightseeing', 'Guided Tour', 'Photography']),
      highlights: JSON.stringify(['Unique Bahir Dar Landmark', 'Scenic Views']),
      gallery: JSON.stringify([featuredImage]),
      isFeatured: formData.get('isFeatured') === 'on',
      isApproved: true,
    },
  });

  revalidatePath('/admin/attractions');
  revalidatePath('/attractions');
  revalidatePath('/');
  return { success: true };
}

export async function updateAttractionAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const shortDesc = formData.get('shortDesc') as string;
  const categoryId = formData.get('categoryId') as string;
  const location = formData.get('location') as string;
  const address = (formData.get('address') as string) || '';
  const latitude = parseFloat(formData.get('latitude') as string) || 11.5942;
  const longitude = parseFloat(formData.get('longitude') as string) || 37.3875;
  const entryFee = formData.get('entryFee') as string;
  const openingHours = formData.get('openingHours') as string;
  const bestTime = formData.get('bestTime') as string;
  const featuredImage = formData.get('featuredImage') as string;
  const isFeatured = formData.get('isFeatured') === 'on';

  await prisma.attraction.update({
    where: { id },
    data: {
      title,
      description,
      shortDesc: shortDesc || description.slice(0, 120),
      categoryId,
      location,
      address,
      latitude,
      longitude,
      entryFee,
      openingHours,
      bestTime,
      featuredImage,
      isFeatured,
    },
  });

  revalidatePath('/admin/attractions');
  revalidatePath('/attractions');
  revalidatePath(`/attractions/${id}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteAttractionAction(id: string) {
  await requireAdmin();
  await prisma.attraction.delete({ where: { id } });
  revalidatePath('/admin/attractions');
  revalidatePath('/attractions');
  revalidatePath('/');
  return { success: true };
}

export async function toggleAttractionApprovalAction(id: string, isApproved: boolean) {
  await requireAdmin();
  await prisma.attraction.update({
    where: { id },
    data: { isApproved },
  });
  revalidatePath('/admin/attractions');
  revalidatePath('/attractions');
  return { success: true };
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = (formData.get('icon') as string) || 'Landmark';
  const image =
    (formData.get('image') as string) ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80';

  const slug = name.toLowerCase().trim().replace(/[\s]+/g, '-');

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
      icon,
      image,
    },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/attractions');
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
  revalidatePath('/attractions');
  return { success: true };
}

export async function updateUserRoleAction(userId: string, role: string, status: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role, status },
  });
  revalidatePath('/admin/users');
  return { success: true };
}

export async function moderateReviewAction(reviewId: string, status: 'APPROVED' | 'REJECTED') {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });
  revalidatePath('/admin/reviews');
  return { success: true };
}

export async function createEventAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = (formData.get('category') as string) || 'Cultural';
  const location = formData.get('location') as string;
  const venue = (formData.get('venue') as string) || location;
  const startDate = new Date(formData.get('startDate') as string);
  const organizer = (formData.get('organizer') as string) || 'Bahir Dar Tourism';
  const featuredImage =
    (formData.get('featuredImage') as string) ||
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80';

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-') + '-' + Date.now().toString().slice(-4);

  await prisma.event.create({
    data: {
      title,
      slug,
      description,
      category,
      location,
      venue,
      startDate,
      organizer,
      featuredImage,
      status: 'APPROVED',
    },
  });

  revalidatePath('/admin/events');
  revalidatePath('/events');
  return { success: true };
}

export async function deleteEventAction(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath('/admin/events');
  revalidatePath('/events');
  return { success: true };
}

export async function updateBusinessStatusAction(id: string, status: string) {
  await requireAdmin();
  await prisma.business.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/businesses');
  revalidatePath('/hotels');
  revalidatePath('/restaurants');
  return { success: true };
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = (formData.get('icon') as string) || 'Landmark';
  const image = formData.get('image') as string;

  await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
      icon,
      image,
    },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/attractions');
  return { success: true };
}

export async function updateEventAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = (formData.get('category') as string) || 'Cultural';
  const location = formData.get('location') as string;
  const venue = (formData.get('venue') as string) || location;
  const startDateStr = formData.get('startDate') as string;
  const organizer = (formData.get('organizer') as string) || 'Bahir Dar Tourism';
  const featuredImage = formData.get('featuredImage') as string;
  const price = formData.get('price') as string;

  await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      category,
      location,
      venue,
      startDate: new Date(startDateStr),
      organizer,
      featuredImage,
      price,
    },
  });

  revalidatePath('/admin/events');
  revalidatePath('/events');
  return { success: true };
}

export async function updateBusinessAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const address = formData.get('address') as string;
  const priceRange = formData.get('priceRange') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const website = formData.get('website') as string;
  const featuredImage = formData.get('featuredImage') as string;
  const status = (formData.get('status') as string) || 'APPROVED';

  await prisma.business.update({
    where: { id },
    data: {
      name,
      type,
      description,
      location,
      address,
      priceRange,
      phone,
      email,
      website,
      featuredImage,
      status,
    },
  });

  revalidatePath('/admin/businesses');
  revalidatePath('/hotels');
  revalidatePath('/restaurants');
  return { success: true };
}

export async function editReviewAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const comment = formData.get('comment') as string;
  const rating = parseInt(formData.get('rating') as string) || 5;
  const status = (formData.get('status') as string) || 'APPROVED';

  await prisma.review.update({
    where: { id },
    data: {
      comment,
      rating,
      status,
    },
  });

  revalidatePath('/admin/reviews');
  revalidatePath('/attractions');
  return { success: true };
}

export async function editUserAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const bio = formData.get('bio') as string;
  const role = formData.get('role') as string;
  const status = formData.get('status') as string;

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      bio,
      role,
      status,
    },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function createBusinessAction(formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const type = (formData.get('type') as string) || 'HOTEL';
  const description = formData.get('description') as string;
  const location = (formData.get('location') as string) || 'Bahir Dar';
  const address = (formData.get('address') as string) || '';
  const priceRange = (formData.get('priceRange') as string) || '$$';
  const phone = (formData.get('phone') as string) || '';
  const email = (formData.get('email') as string) || '';
  const website = (formData.get('website') as string) || '';
  const featuredImage =
    (formData.get('featuredImage') as string) ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80';

  const newBiz = await prisma.business.create({
    data: {
      name,
      type,
      description,
      location,
      address,
      latitude: 11.5942,
      longitude: 37.3875,
      priceRange,
      phone,
      email,
      website,
      featuredImage,
      status: 'APPROVED',
      rating: 4.8,
    },
  });

  revalidatePath('/admin/businesses');
  revalidatePath('/hotels');
  revalidatePath('/restaurants');
  return { success: true, business: newBiz };
}

export async function deleteBusinessAction(id: string) {
  await requireAdmin();
  await prisma.business.delete({ where: { id } });
  revalidatePath('/admin/businesses');
  revalidatePath('/hotels');
  revalidatePath('/restaurants');
  return { success: true };
}


