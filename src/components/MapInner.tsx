'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  title: string;
  type: 'attraction' | 'hotel' | 'restaurant' | 'event';
  category?: string;
  latitude: number;
  longitude: number;
  image?: string;
  rating?: number;
  price?: string;
  url: string;
  address?: string;
}

interface MapInnerProps {
  items: MapMarkerItem[];
  center?: [number, number];
  zoom?: number;
}

// Custom Leaflet DivIcon helpers
function createCustomIcon(type: 'attraction' | 'hotel' | 'restaurant' | 'event') {
  const colors = {
    attraction: 'bg-sky-600 border-white',
    hotel: 'bg-purple-600 border-white',
    restaurant: 'bg-amber-600 border-white',
    event: 'bg-rose-600 border-white',
  };

  const icons = {
    attraction: '📍',
    hotel: '🏨',
    restaurant: '🍽️',
    event: '🎉',
  };

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full ${colors[type]} text-white text-xs font-bold shadow-lg border-2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform">${icons[type]}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function MapInner({
  items,
  center = [11.5942, 37.3875], // Bahir Dar Coordinates
  zoom = 12,
}: MapInnerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[450px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-sm">
        Loading Bahir Dar Map...
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[450px] rounded-2xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((item) => (
        <Marker
          key={`${item.type}-${item.id}`}
          position={[item.latitude, item.longitude]}
          icon={createCustomIcon(item.type)}
        >
          <Popup className="custom-popup">
            <div className="p-1 max-w-[220px] font-sans">
              {item.image && (
                <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  {item.category || item.type}
                </span>
                {item.rating && (
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {item.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
                {item.title}
              </h4>
              {item.address && (
                <p className="text-[11px] text-slate-500 mb-2 truncate">
                  {item.address}
                </p>
              )}
              <Link
                href={item.url}
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
              >
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
