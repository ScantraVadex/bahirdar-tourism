# 🌊 Bahir Dar Tourism Experience - Full-Stack Web Platform

A modern, responsive full-stack tourism web application built with **Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, and SQLite/PostgreSQL**.

The platform is designed to promote tourism in **Bahir Dar, Ethiopia**, where Lake Tana meets the Blue Nile. It guides visitors through discovering ancient island monasteries, exploring majestic waterfalls, planning customized daily itineraries, bookmarking favorites, writing reviews, and viewing geographic sites on an interactive GIS map.

---

## 🚀 Key Features

### 🌍 1. Public Experience & Discovery
- **Homepage (`/`)**: Hero banner with Bahir Dar photography, search bar, popular attractions, category filters, cultural highlights, and featured festivals.
- **Attractions Catalog (`/attractions`)**: Interactive search, category filters (Nature, Culture, History, Religious, Adventure, Food), and rating tags.
- **Attraction Details (`/attractions/[id]`)**: Full overview, photo galleries, visiting fees & hours, interactive Leaflet location map, user reviews, and 1-click **Add to Favorites** and **Add to My Trip** actions.
- **Curated Experiences (`/experiences`)**: Lake Tana boat tours, Tis Abay gorge hikes, sunrise hippo safaris, and traditional coffee ceremonies.
- **Hotels & Accommodations (`/hotels`)**: Verified listings with amenities, price ranges, ratings, and direct contact details.
- **Dining & Cultural Restaurants (`/restaurants`)**: Lakeside fresh fish eateries, traditional injera restaurants, and cultural dance venues.
- **Upcoming Events (`/events`)**: Festivals including Timkat (Epiphany), Tana Regatta, and Fish Festivals.
- **Interactive City Map (`/map`)**: Full-page interactive map powered by Leaflet and OpenStreetMap showing markers for attractions, hotels, restaurants, and events.
- **Travel Guide (`/travel-guide`)**: Practical advice on weather seasons, airport transport, monastery etiquette, useful Amharic phrases, currency, and emergency numbers.

### 🎒 2. Tourist Hub & Trip Planner
- **Dashboard Overview (`/dashboard`)**: Summary of saved favorites, created trips, and written reviews.
- **Saved Favorites (`/dashboard/favorites`)**: Bookmark attractions with optimistic state updates.
- **Day-by-Day Trip Planner (`/dashboard/trips`)**: Create multi-day itineraries (e.g. 3-day Bahir Dar highlights) and organize destinations across Day 1, Day 2, and Day 3.
- **Review Center (`/dashboard/reviews`)**: Manage submitted ratings and community feedback.
- **User Profile (`/dashboard/profile`)**: Manage personal details and preferences.

### 🛡️ 3. Administrative Control Center
- **Analytics Dashboard (`/admin`)**: Metric cards for users, attractions, businesses, reviews, and events, paired with visual charts powered by **Recharts**.
- **Attraction Management (`/admin/attractions`)**: Complete CRUD form to create, edit, approve/hide, and delete attractions.
- **Category Management (`/admin/categories`)**: Manage tourism categories.
- **User Management (`/admin/users`)**: Search accounts, modify roles (`TOURIST`, `BUSINESS`, `ADMIN`), and toggle status.
- **Review Moderation (`/admin/reviews`)**: Approve or reject user-submitted reviews.
- **Events & Businesses Management (`/admin/events`, `/admin/businesses`)**: Manage festivals and hospitality listings.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & ORM**: Prisma ORM with SQLite (`file:./dev.db`) (can easily switch to PostgreSQL via `.env`)
- **Maps**: Leaflet & React Leaflet
- **Analytics & Charts**: Recharts
- **Icons**: Lucide React
- **Security & Auth**: Password hashing with `bcryptjs`, secure session cookies, and role-based access control (RBAC).

---

## ⚡ Quick Start Instructions

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **NPM**

### 2. Installation
```bash
# Navigate to project directory
cd tourism-app

# Install dependencies
npm install
```

### 3. Database Setup & Seeding
```bash
# Push schema to SQLite database
npx prisma db push

# Seed database with authentic Bahir Dar sample data
npx tsx src/lib/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts (For Examiner & Evaluation)

For fast demonstration, the login page (`/login`) includes **1-Click Quick Demo Login buttons**:

| Role | Email | Password | Access / Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bahirdar.travel` | `password123` | Full access to `/admin` dashboard and CRUD tools |
| **Tourist** | `tourist@bahirdar.travel` | `password123` | Access to `/dashboard`, Trip Planner, and Favorites |
| **Business** | `business@bahirdar.travel` | `password123` | Hospitality and listing owner access |

---

## 🧪 Examiner Complete Demonstration Flow

1. **Discover**: Open `http://localhost:3000` → Scroll through the Hero, Popular Attractions, and Why Visit Bahir Dar.
2. **Search & Filter**: Click **Attractions** in the navbar → Filter by "Religious" or search "Nile".
3. **Explore Details**: Click into **Blue Nile Falls (Tis Abay)** → View the image gallery, visiting fees, and interactive map marker.
4. **Sign In / Demo Login**: Click **Sign In** → Use the **Tourist Demo** button.
5. **Bookmark Favorite**: Click **Add to Favorites** on the attraction.
6. **Plan 3-Day Trip**: Click **Add to My Trip** → Select "Day 1" or visit `/dashboard/trips` to view the full Day 1/2/3 timeline.
7. **Submit a Review**: Select 5 stars, write feedback, and submit.
8. **Admin Control**: Sign out and click **Admin Demo** on `/login` → Visit `/admin` to view charts, moderate reviews, and add new attractions.

---

## 📁 Project Structure

```
tourism-app/
├── prisma/
│   ├── schema.prisma         # Database schema (User, Attraction, Category, Review, Favorite, Itinerary, etc.)
│   └── dev.db                # SQLite database (auto-created)
├── src/
│   ├── actions/              # Server Actions for mutations
│   │   ├── admin.ts          # Admin CRUD & moderation
│   │   ├── auth.ts           # Authentication & session actions
│   │   ├── favorites.ts      # Favorite toggle
│   │   ├── itinerary.ts      # Multi-day itinerary builder
│   │   └── reviews.ts        # Review submissions
│   ├── app/                  # Next.js App Router Pages
│   │   ├── admin/            # Admin dashboard and management pages
│   │   ├── attractions/      # Attractions catalog & details ([id])
│   │   ├── dashboard/        # Tourist dashboard (favorites, trips, reviews, profile)
│   │   ├── events/           # Events & festivals
│   │   ├── experiences/      # Curated tours
│   │   ├── hotels/           # Hotels & accommodation
│   │   ├── map/              # Full-page interactive map
│   │   ├── restaurants/      # Dining & fresh fish
│   │   ├── travel-guide/     # Travel guide & safety tips
│   │   ├── login/            # Sign in with 1-click demo buttons
│   │   ├── register/         # Registration
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AttractionCard.tsx
│   │   ├── RatingStars.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── AddToTripModal.tsx
│   │   ├── MapComponent.tsx  # Dynamic SSR-safe Leaflet map
│   │   ├── AdminCharts.tsx   # Recharts analytics
│   │   └── ...
│   └── lib/
│       ├── auth.ts           # Session & hashing helpers
│       ├── prisma.ts         # Singleton Prisma client
│       └── seed.ts           # Realistic Bahir Dar sample data seed
└── README.md
```
