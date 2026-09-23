import { DatabaseSync } from 'node:sqlite';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const sqlite = new DatabaseSync('prisma/dev.db.backup');

async function restore() {
  console.log('--- Starting Data Migration from SQLite Backup to Neon PostgreSQL ---');

  // 1. Clean existing PostgreSQL tables in reverse foreign-key order
  console.log('Cleaning default seed data from PostgreSQL...');
  await prisma.itineraryItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.business.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users
  const users = sqlite.prepare('SELECT * FROM User').all() as any[];
  console.log(`Migrating ${users.length} Users...`);
  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role || 'TOURIST',
        status: u.status || 'ACTIVE',
        avatar: u.avatar || null,
        bio: u.bio || null,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
      },
    });
  }

  // 3. Categories
  const categories = sqlite.prepare('SELECT * FROM Category').all() as any[];
  console.log(`Migrating ${categories.length} Categories...`);
  for (const c of categories) {
    await prisma.category.create({
      data: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || null,
        icon: c.icon || null,
        image: c.image || null,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      },
    });
  }

  // 4. Attractions
  const attractions = sqlite.prepare('SELECT * FROM Attraction').all() as any[];
  console.log(`Migrating ${attractions.length} Attractions...`);
  for (const a of attractions) {
    await prisma.attraction.create({
      data: {
        id: a.id,
        title: a.title,
        slug: a.slug,
        description: a.description,
        shortDesc: a.shortDesc,
        categoryId: a.categoryId,
        location: a.location,
        address: a.address || null,
        latitude: Number(a.latitude),
        longitude: Number(a.longitude),
        entryFee: a.entryFee || null,
        openingHours: a.openingHours || null,
        bestTime: a.bestTime || null,
        activities: a.activities || null,
        highlights: a.highlights || null,
        featuredImage: a.featuredImage,
        gallery: a.gallery || null,
        rating: Number(a.rating || 5.0),
        reviewCount: Number(a.reviewCount || 0),
        isFeatured: Boolean(a.isFeatured === 1 || a.isFeatured === true),
        isApproved: Boolean(a.isApproved === 1 || a.isApproved === true),
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(),
      },
    });
  }

  // 5. Businesses (Hotels, Restaurants, etc.)
  const businesses = sqlite.prepare('SELECT * FROM Business').all() as any[];
  console.log(`Migrating ${businesses.length} Businesses...`);
  for (const b of businesses) {
    await prisma.business.create({
      data: {
        id: b.id,
        name: b.name,
        type: b.type,
        description: b.description,
        address: b.address,
        location: b.location,
        latitude: Number(b.latitude),
        longitude: Number(b.longitude),
        priceRange: b.priceRange || null,
        rating: Number(b.rating || 4.8),
        phone: b.phone || null,
        email: b.email || null,
        website: b.website || null,
        facilities: b.facilities || null,
        cuisineType: b.cuisineType || null,
        openingHours: b.openingHours || null,
        featuredImage: b.featuredImage,
        gallery: b.gallery || null,
        status: b.status || 'APPROVED',
        userId: b.userId || null,
        createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
        updatedAt: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      },
    });
  }

  // 6. Events
  const events = sqlite.prepare('SELECT * FROM Event').all() as any[];
  console.log(`Migrating ${events.length} Events...`);
  for (const e of events) {
    await prisma.event.create({
      data: {
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        category: e.category,
        location: e.location,
        venue: e.venue,
        startDate: e.startDate ? new Date(e.startDate) : new Date(),
        endDate: e.endDate ? new Date(e.endDate) : null,
        price: e.price || null,
        organizer: e.organizer,
        featuredImage: e.featuredImage,
        status: e.status || 'APPROVED',
        createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
        updatedAt: e.updatedAt ? new Date(e.updatedAt) : new Date(),
      },
    });
  }

  // 7. Reviews
  const reviews = sqlite.prepare('SELECT * FROM Review').all() as any[];
  console.log(`Migrating ${reviews.length} Reviews...`);
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        rating: Number(r.rating),
        comment: r.comment,
        status: r.status || 'APPROVED',
        userId: r.userId,
        attractionId: r.attractionId,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
      },
    });
  }

  // 8. Favorites
  const favorites = sqlite.prepare('SELECT * FROM Favorite').all() as any[];
  console.log(`Migrating ${favorites.length} Favorites...`);
  for (const f of favorites) {
    await prisma.favorite.create({
      data: {
        id: f.id,
        userId: f.userId,
        attractionId: f.attractionId,
        createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
      },
    });
  }

  // 9. Itineraries & Items
  const itineraries = sqlite.prepare('SELECT * FROM Itinerary').all() as any[];
  console.log(`Migrating ${itineraries.length} Itineraries...`);
  for (const it of itineraries) {
    await prisma.itinerary.create({
      data: {
        id: it.id,
        title: it.title,
        description: it.description || null,
        durationDays: Number(it.durationDays || 3),
        startDate: it.startDate ? new Date(it.startDate) : null,
        userId: it.userId,
        createdAt: it.createdAt ? new Date(it.createdAt) : new Date(),
        updatedAt: it.updatedAt ? new Date(it.updatedAt) : new Date(),
      },
    });
  }

  const items = sqlite.prepare('SELECT * FROM ItineraryItem').all() as any[];
  console.log(`Migrating ${items.length} ItineraryItems...`);
  for (const item of items) {
    await prisma.itineraryItem.create({
      data: {
        id: item.id,
        dayNumber: Number(item.dayNumber || 1),
        orderIndex: Number(item.orderIndex || 0),
        notes: item.notes || null,
        timeSlot: item.timeSlot || null,
        itineraryId: item.itineraryId,
        attractionId: item.attractionId,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      },
    });
  }

  console.log('✅ ALL SQLite data, custom attractions, businesses, events, and photos migrated to Neon PostgreSQL successfully!');
}

restore()
  .catch((e) => {
    console.error('Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
