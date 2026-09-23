import Link from 'next/link';
import { Compass, Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-700 p-0.5 flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Bahir Dar Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight">Bahir Dar</span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Tourism Experience
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover the jewel of the Ethiopian northern circuit where Lake Tana meets the majestic Blue Nile River. Experience timeless monasteries, dramatic waterfalls, and vibrant Amhara culture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore Destinations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/attractions" className="hover:text-sky-400 transition-colors">
                  Top Attractions &amp; Falls
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-sky-400 transition-colors">
                  Lakeside Hotels &amp; Resorts
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="hover:text-sky-400 transition-colors">
                  Cultural Dining & Fresh Fish
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-sky-400 transition-colors">
                  Festivals & Epiphany (Timkat)
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Travel Planning
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/map" className="hover:text-sky-400 transition-colors">
                  Interactive GIS City Map
                </Link>
              </li>
              <li>
                <Link href="/travel-guide" className="hover:text-sky-400 transition-colors">
                  Complete Travel & Safety Guide
                </Link>
              </li>
              <li>
                <Link href="/dashboard/trips" className="hover:text-sky-400 transition-colors">
                  Personalized 3-Day Trip Planner
                </Link>
              </li>
              <li>
                <Link href="/dashboard/favorites" className="hover:text-sky-400 transition-colors">
                  Saved Favorite Places
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-sky-400 transition-colors">
                  Business Owner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Tourism Office */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Bahir Dar Tourism Office
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Lakefront Boulevard, Kebele 03, Bahir Dar, Amhara Region, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+251 58 220 0110 / +251 91 800 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@bahirdar.travel</span>
              </li>
              <li className="flex items-center gap-2.5 text-amber-300 font-medium">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Tourist Police Emergency: 991</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bahir Dar Tourism Experience Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Ethiopian Tourism
            </span>
            <Link href="/travel-guide#safety" className="hover:text-slate-300 transition-colors">
              Safety & Regulations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
