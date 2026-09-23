import { prisma } from '@/lib/prisma';
import BusinessesManager from './BusinessesManager';

export const dynamic = 'force-dynamic';

export default async function AdminBusinessesPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <BusinessesManager businesses={businesses} />;
}

