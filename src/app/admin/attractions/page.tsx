import { prisma } from '@/lib/prisma';
import AttractionsManager from './AttractionsManager';

export const dynamic = 'force-dynamic';

export default async function AdminAttractionsPage() {
  const [attractions, categories] = await Promise.all([
    prisma.attraction.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany(),
  ]);

  return <AttractionsManager attractions={attractions} categories={categories} />;
}
