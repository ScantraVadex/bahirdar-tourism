import { prisma } from '@/lib/prisma';
import CategoriesManager from './CategoriesManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { attractions: true } },
    },
    orderBy: { name: 'asc' },
  });

  return <CategoriesManager categories={categories} />;
}
