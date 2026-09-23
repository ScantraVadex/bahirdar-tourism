import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Bahir Dar Tourism Experience database...');

  // 1. Clean existing records
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.business.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash('biruk123', 10);
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Biruk',
      email: 'biruk@gmail.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      bio: 'System Administrator.',
    },
  });

  const businessUser = await prisma.user.create({
    data: {
      name: 'Tana Hospitality Group',
      email: 'business@bahirdar.travel',
      password: passwordHash,
      role: 'BUSINESS',
      status: 'ACTIVE',
      bio: 'Leading eco-tourism, hospitality, and boat cruise provider on Lake Tana.',
    },
  });

  const touristUser = await prisma.user.create({
    data: {
      name: 'Helen Bekele',
      email: 'tourist@bahirdar.travel',
      password: passwordHash,
      role: 'TOURIST',
      status: 'ACTIVE',
      bio: 'Travel enthusiast exploring Ethiopia’s historic northern routes and natural wonders.',
    },
  });

  // 3. Create Categories
  const categoriesData = [
    {
      name: 'Nature',
      slug: 'nature',
      description: 'Lakes, waterfalls, lush wetlands, and wildlife sanctuaries in and around Bahir Dar.',
      icon: 'Trees',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Religious',
      slug: 'religious',
      description: 'Ancient Ethiopian Orthodox monasteries with vibrant 14th-17th century biblical murals.',
      icon: 'Church',
      image: 'https://images.unsplash.com/photo-1548625361-195fe5787e91?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Culture',
      slug: 'culture',
      description: 'Traditional music, dance, authentic coffee ceremonies, and Amhara handicraft traditions.',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'History',
      slug: 'history',
      description: 'Imperial palaces, royal viewpoints, and historic relics of Emperor Haile Selassie.',
      icon: 'Landmark',
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Adventure',
      slug: 'adventure',
      description: 'Papyrus boat kayaking, Nile gorge hiking, birdwatching expeditions, and water sports.',
      icon: 'Compass',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Food',
      slug: 'food',
      description: 'Fresh Lake Tana fish culinary delicacies, traditional injera platters, and local honey wine.',
      icon: 'UtensilsCrossed',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Lakeside nightlife, cultural live music (Eskista) clubs, and scenic promenade lounges.',
      icon: 'Music',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }

  // 4. Create Attractions
  const attractionsData = [
    {
      title: 'Blue Nile Falls (Tis Abay)',
      slug: 'blue-nile-falls-tis-abay',
      description: 'The Blue Nile Falls, known locally as Tis Abay ("Smoking Water"), is one of Ethiopia’s most dramatic natural sights. Located roughly 30 km downstream from Bahir Dar, the river plunges over a 45-meter cliff into a misty gorge. Crossing the historic 17th-century Portuguese Stone Bridge and hiking through the verdant valley offers breathtaking panoramic viewpoints.',
      shortDesc: 'Dramatic 45m waterfall cascading into the Nile gorge, known locally as "Smoking Water".',
      categoryId: categories['nature'],
      location: 'Tis Abay Village, 30km South of Bahir Dar',
      address: 'Tis Isat Road, Amhara Region',
      latitude: 11.4908,
      longitude: 37.5937,
      entryFee: '100 ETB (Local) / 250 ETB (International)',
      openingHours: '08:00 AM - 05:30 PM Daily',
      bestTime: 'August - November (Peak waterfall volume after rainy season)',
      activities: JSON.stringify(['Gorge Hiking', 'Portuguese Bridge Crossing', 'Landscape Photography', 'Birdwatching']),
      highlights: JSON.stringify(['Dramatic water spray mist rainbows', 'Historical 17th-century stone bridge', 'Authentic rural Ethiopian countryside walk']),
      featuredImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
      ]),
      rating: 4.9,
      reviewCount: 38,
      isFeatured: true,
      isApproved: true,
    },
    {
      title: 'Lake Tana Island Monasteries (Ura Kidane Mehret)',
      slug: 'ura-kidane-mehret-monastery',
      description: 'Perched on the lush Zege Peninsula surrounded by dense coffee forests, Ura Kidane Mehret is renowned as the most magnificent monastery on Lake Tana. Founded in the 14th century, its circular church walls are covered floor-to-ceiling with vibrant, intricately preserved frescoes depicting Ethiopian biblical narratives, angels, and imperial history.',
      shortDesc: 'Famed 14th-century circular monastery covered in vivid, ancient Ethiopian Orthodox frescoes.',
      categoryId: categories['religious'],
      location: 'Zege Peninsula, Lake Tana',
      address: 'Zege Forest Reserve, Bahir Dar',
      latitude: 11.6967,
      longitude: 37.3323,
      entryFee: '200 ETB / 400 ETB for foreign visitors',
      openingHours: '08:30 AM - 05:00 PM Daily (Accessible by boat)',
      bestTime: 'Year-round (Morning boat rides offer calm waters)',
      activities: JSON.stringify(['Boat Cruise', 'Ancient Manuscript Viewing', 'Forest Canopy Nature Walk', 'Coffee Trail Tour']),
      highlights: JSON.stringify(['Centuries-old colorful mural wall paintings', 'Imperial crown collection museum', 'Sacred quiet forest ambiance']),
      featuredImage: 'https://images.unsplash.com/photo-1548625361-195fe5787e91?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'
      ]),
      rating: 4.9,
      reviewCount: 42,
      isFeatured: true,
      isApproved: true,
    },
    {
      title: 'Bahir Dar Lakefront Promenade & Port',
      slug: 'bahir-dar-lakefront-promenade',
      description: 'The scenic palm-lined waterfront of Bahir Dar is the vibrant social heart of the city. Flanked by blooming jacaranda trees and stylish lakeside fish restaurants, it provides the main departure harbor for Lake Tana boat excursions. In the late afternoon, enjoy fresh fried Nile perch, sunset strolls, and watching local fishermen navigate traditional papyrus "Tankwa" boats.',
      shortDesc: 'Palm-lined boulevard along Lake Tana with outdoor fish restaurants, boat docks, and sunset vistas.',
      categoryId: categories['culture'],
      location: 'Lake Tana Shoreline, Downtown Bahir Dar',
      address: 'Lakefront Ave, Kebele 04, Bahir Dar',
      latitude: 11.5942,
      longitude: 37.3875,
      entryFee: 'Free public access',
      openingHours: 'Open 24/7 (Restaurants 07:00 AM - 11:00 PM)',
      bestTime: 'Late afternoon & Golden Hour sunset',
      activities: JSON.stringify(['Sunset Walking', 'Lakeside Dining', 'Tankwa Boat Watching', 'Street Photography']),
      highlights: JSON.stringify(['Fresh grilled Tilapia & Nile Perch', 'Panoramic views of Lake Tana horizon', 'Live cultural music in evening cafes']),
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
      ]),
      rating: 4.7,
      reviewCount: 29,
      isFeatured: true,
      isApproved: true,
    },
    {
      title: 'Bezawit Hilltop & Imperial Palace Viewpoint',
      slug: 'bezawit-palace-viewpoint',
      description: 'Perched on a high hill 5 km southeast of the city center, Bezawit was chosen by Emperor Haile Selassie for his royal countryside palace. While the interior palace is preserved as a national site, the surrounding hilltop offers the single best panoramic viewpoint in the region: look out where Lake Tana gently narrows and gives birth to the legendary Blue Nile River.',
      shortDesc: 'Iconic panoramic viewpoint where the Blue Nile flows out of Lake Tana with royal palace grounds.',
      categoryId: categories['history'],
      location: 'Bezawit Hill, 5km South-East of Center',
      address: 'Bezawit Road, Bahir Dar',
      latitude: 11.5628,
      longitude: 37.4039,
      entryFee: '50 ETB Viewpoint Access',
      openingHours: '08:00 AM - 06:00 PM',
      bestTime: 'Sunset or early morning for crystal-clear vistas',
      activities: JSON.stringify(['Panoramic Photography', 'Birding', 'Historical Tour', 'River Source Spotting']),
      highlights: JSON.stringify(['360-degree viewpoint of Bahir Dar city & Lake Tana', 'Nile River headwaters confluence', 'Cool breezy hilltop climate']),
      featuredImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
      ]),
      rating: 4.8,
      reviewCount: 25,
      isFeatured: true,
      isApproved: true,
    },
    {
      title: 'Azwa Maryam Monastery',
      slug: 'azwa-maryam-monastery',
      description: 'Nestled on the Zege Peninsula a short shaded forest walk from Ura Kidane Mehret, Azwa Maryam is a charming thatched-roof monastery known for its warm hospitality and exquisite 18th-century paintings. Monks here display precious ceremonial crowns, brass crosses, and historic illuminated parchment Gospels.',
      shortDesc: 'Charming thatched-roof sanctuary on Zege Peninsula featuring royal crowns and vibrant murals.',
      categoryId: categories['religious'],
      location: 'Zege Peninsula, Lake Tana',
      address: 'Zege Peninsula Coastal Trail',
      latitude: 11.6881,
      longitude: 37.3395,
      entryFee: '150 ETB / 300 ETB',
      openingHours: '08:30 AM - 05:00 PM',
      bestTime: 'Morning combined with Zege walking tour',
      activities: JSON.stringify(['Monastery Artifact Viewing', 'Coffee Grove Walking', 'Cultural Exchange with Monks']),
      highlights: JSON.stringify(['Traditional conical grass-thatched architecture', 'Quiet meditative atmosphere', 'Ancient brass processional crosses']),
      featuredImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1548625361-195fe5787e91?auto=format&fit=crop&w=1000&q=80'
      ]),
      rating: 4.7,
      reviewCount: 19,
      isFeatured: false,
      isApproved: true,
    },
    {
      title: 'Lake Tana Pelican & Hippo Sanctuary (Nile Outlet)',
      slug: 'lake-tana-hippo-sanctuary',
      description: 'Where Lake Tana gracefully empties into the Blue Nile River channel, you find calm, papyrus-fringed waters that serve as a natural sanctuary for pods of wild hippopotamus, white pelicans, African fish eagles, and kingfishers. Taking an eco-boat at sunrise allows close, respectful wildlife encounters.',
      shortDesc: 'Scenic boat route where the Nile leaves Lake Tana, famous for wild hippo pods and rare waterbirds.',
      categoryId: categories['adventure'],
      location: 'Blue Nile River Outflow Channel, Lake Tana',
      address: 'Waterfront Boat Station No. 2',
      latitude: 11.6033,
      longitude: 37.3986,
      entryFee: 'Included in boat tour package (approx. 800 - 1500 ETB/boat)',
      openingHours: '06:00 AM - 06:00 PM',
      bestTime: 'Early Morning (06:30 AM - 08:30 AM) when hippos are active',
      activities: JSON.stringify(['Hippo Safari', 'Birdwatching', 'Papyrus Boat Photography', 'Sunrise Cruise']),
      highlights: JSON.stringify(['Watching wild hippopotamuses surface', 'Flocks of majestic Great White Pelicans', 'Peaceful glassy water reflections']),
      featuredImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
      ]),
      rating: 4.8,
      reviewCount: 31,
      isFeatured: true,
      isApproved: true,
    },
  ];

  const createdAttractions: Record<string, string> = {};
  for (const item of attractionsData) {
    const created = await prisma.attraction.create({ data: item });
    createdAttractions[item.slug] = created.id;
  }

  // 5. Create Businesses (Hotels, Restaurants, Experiences)
  const businessesData = [
    {
      name: 'Kuriftu Resort & Spa Bahir Dar',
      type: 'HOTEL',
      description: 'Luxury lakeside eco-resort featuring stone-and-timber bungalows, an infinity swimming pool overlooking Lake Tana, world-class organic spa treatments, and gourmet Ethiopian and international dining.',
      address: 'Lakefront Boulevard, Kebele 02',
      location: 'Lake Tana Waterfront, Bahir Dar',
      latitude: 11.5991,
      longitude: 37.3820,
      priceRange: '$$$$',
      rating: 4.9,
      phone: '+251 58 226 5000',
      email: 'reservations@kurifturesorts.com',
      website: 'https://kurifturesorts.com',
      facilities: JSON.stringify(['Infinity Pool', 'Spa & Wellness Center', 'Lakeside Restaurant', 'Free High-speed Wi-Fi', 'Private Boat Dock', 'Airport Shuttle']),
      openingHours: '24/7 Front Desk',
      featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80']),
      status: 'APPROVED',
      userId: businessUser.id,
    },
    {
      name: 'Avanti Blue Nile Hotel',
      type: 'HOTEL',
      description: 'Contemporary 4-star hotel situated in central Bahir Dar with scenic garden terraces, conference facilities, spacious modern suites, and panoramic rooftop views of the city and lake.',
      address: 'Near Giorgis Roundabout, Bahir Dar',
      location: 'Central Bahir Dar',
      latitude: 11.5885,
      longitude: 37.3842,
      priceRange: '$$$',
      rating: 4.6,
      phone: '+251 58 220 2200',
      email: 'info@avantibluenile.com',
      website: 'https://avantibluenile.com',
      facilities: JSON.stringify(['Swimming Pool', 'Fitness Gym', 'Conference Rooms', 'Buffet Breakfast', 'Bar & Lounge']),
      openingHours: '24/7 Front Desk',
      featuredImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
      gallery: JSON.stringify([]),
      status: 'APPROVED',
      userId: businessUser.id,
    },
    {
      name: 'Desset Cultural Restaurant & Grill',
      type: 'RESTAURANT',
      description: 'Bahir Dar’s most celebrated cultural dining venue. Enjoy freshly grilled Lake Tana Tilapia ("Asa"), sizzling Shekla Tibs, and authentic vegetarian fast food platters accompanied by nightly Eskista cultural dance performances.',
      address: 'Lakeside Marine Road, Bahir Dar',
      location: 'Lake Tana Waterfront',
      latitude: 11.5931,
      longitude: 37.3892,
      priceRange: '$$',
      rating: 4.8,
      phone: '+251 91 876 5432',
      email: 'contact@dessetcultural.com',
      cuisineType: 'Ethiopian Traditional & Fresh Lake Fish',
      openingHours: '10:00 AM - 11:30 PM Daily',
      facilities: JSON.stringify(['Live Cultural Music', 'Outdoor Garden Seating', 'Tej (Honey Wine) Bar', 'Fresh Catch BBQ']),
      featuredImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
      gallery: JSON.stringify([]),
      status: 'APPROVED',
      userId: businessUser.id,
    },
    {
      name: 'Lake Tana Eco-Cruise & Boat Guides Association',
      type: 'EXPERIENCE',
      description: 'Licensed professional boat captain association offering customized motorized boat charters to the island monasteries, Nile river outlet hippo tours, and sunset champagne cruises.',
      address: 'Port Station 1, Bahir Dar Jetty',
      location: 'Lake Tana Main Harbor',
      latitude: 11.5955,
      longitude: 37.3860,
      priceRange: '$$',
      rating: 4.9,
      phone: '+251 92 111 2233',
      email: 'tana.cruises@bahirdar.travel',
      facilities: JSON.stringify(['Life Jackets Provided', 'English-speaking Captains', 'Custom Itinerary Booking']),
      openingHours: '06:00 AM - 06:30 PM Daily',
      featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      gallery: JSON.stringify([]),
      status: 'APPROVED',
      userId: businessUser.id,
    }
  ];

  for (const b of businessesData) {
    await prisma.business.create({ data: b });
  }

  // 6. Create Events
  const eventsData = [
    {
      title: 'Timkat (Epiphany) Celebration at Lake Tana',
      slug: 'timkat-epiphany-celebration',
      description: 'Ethiopia’s most famous Orthodox festival celebrated with immense splendor in Bahir Dar. Thousands clad in pristine white traditional Shamma attire accompany the holy Tabots to the water’s edge with rhythmic chanting, drumming, and vibrant priestly processions.',
      category: 'Religious & Cultural',
      location: 'Lake Tana Waterfront & Jan Meda Bahir Dar',
      venue: 'Bahir Dar Central Plaza & Lakefront Shore',
      startDate: new Date('2027-01-19T06:00:00.000Z'),
      endDate: new Date('2027-01-20T18:00:00.000Z'),
      price: 'Free Public Event',
      organizer: 'Bahir Dar Diocese & Amhara Tourism Bureau',
      featuredImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80',
      status: 'APPROVED',
    },
    {
      title: 'Blue Nile International Fish & Cultural Festival',
      slug: 'blue-nile-fish-festival',
      description: 'Annual weeklong gastronomic and cultural festival celebrating the aquatic heritage of Lake Tana. Features live cooking contests with master Ethiopian chefs, traditional Tankwa boat races, and artisan handicraft fairs.',
      category: 'Food & Festival',
      location: 'Bahir Dar Cultural Center & Lakefront Park',
      venue: 'Waterfront Amphitheater',
      startDate: new Date('2026-11-12T09:00:00.000Z'),
      endDate: new Date('2026-11-15T22:00:00.000Z'),
      price: 'Free (Food tastings for purchase)',
      organizer: 'Lake Tana Hospitality Union',
      featuredImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
      status: 'APPROVED',
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.create({ data: ev });
  }

  // 7. Create Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Blue Nile Falls was an unforgettable highlight of our trip! Hiking across the Portuguese bridge and feeling the mist spray on our faces was truly magical. Make sure to wear sturdy walking shoes.',
      status: 'APPROVED',
      userId: touristUser.id,
      attractionId: createdAttractions['blue-nile-falls-tis-abay'],
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'The wall murals at Ura Kidane Mehret are mindblowing. Our boat captain took us early in the morning when the water was still like glass. Highly recommend combining it with the walk through the Zege coffee forest.',
      status: 'APPROVED',
      userId: touristUser.id,
      attractionId: createdAttractions['ura-kidane-mehret-monastery'],
    },
  });

  // 8. Create Favorites
  await prisma.favorite.create({
    data: {
      userId: touristUser.id,
      attractionId: createdAttractions['blue-nile-falls-tis-abay'],
    },
  });

  await prisma.favorite.create({
    data: {
      userId: touristUser.id,
      attractionId: createdAttractions['ura-kidane-mehret-monastery'],
    },
  });

  // 9. Create Sample Itinerary
  const itinerary = await prisma.itinerary.create({
    data: {
      title: 'Classic 3-Day Bahir Dar Highlights',
      description: 'The definitive exploration covering the lakefront, ancient island monasteries, and the thundering Blue Nile Falls.',
      durationDays: 3,
      startDate: new Date(),
      userId: touristUser.id,
    },
  });

  await prisma.itineraryItem.create({
    data: {
      dayNumber: 1,
      orderIndex: 0,
      timeSlot: 'Morning',
      notes: 'Arrival, stroll along the palm-lined lakefront promenade, and watch papyrus Tankwa boats.',
      itineraryId: itinerary.id,
      attractionId: createdAttractions['bahir-dar-lakefront-promenade'],
    },
  });

  await prisma.itineraryItem.create({
    data: {
      dayNumber: 1,
      orderIndex: 1,
      timeSlot: 'Afternoon',
      notes: 'Drive up to Bezawit Hilltop for sunset views over where the Nile departs Lake Tana.',
      itineraryId: itinerary.id,
      attractionId: createdAttractions['bezawit-palace-viewpoint'],
    },
  });

  await prisma.itineraryItem.create({
    data: {
      dayNumber: 2,
      orderIndex: 0,
      timeSlot: 'Full Day',
      notes: 'Private boat excursion across Lake Tana to Zege Peninsula; explore Ura Kidane Mehret murals.',
      itineraryId: itinerary.id,
      attractionId: createdAttractions['ura-kidane-mehret-monastery'],
    },
  });

  await prisma.itineraryItem.create({
    data: {
      dayNumber: 3,
      orderIndex: 0,
      timeSlot: 'Morning',
      notes: 'Excursion to Tis Abay (Blue Nile Falls). Hike across the 17th-century Portuguese stone bridge.',
      itineraryId: itinerary.id,
      attractionId: createdAttractions['blue-nile-falls-tis-abay'],
    },
  });

  console.log('Database seeded successfully with Bahir Dar tourism data!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
