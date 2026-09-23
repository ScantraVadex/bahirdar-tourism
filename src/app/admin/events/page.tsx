import { prisma } from '@/lib/prisma';
import EventsManager from './EventsManager';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' },
  });

  return <EventsManager events={events} />;
}
