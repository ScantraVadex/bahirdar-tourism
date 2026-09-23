import { prisma } from '@/lib/prisma';
import UsersManager from './UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
          favorites: true,
          itineraries: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <UsersManager users={users} />;
}

