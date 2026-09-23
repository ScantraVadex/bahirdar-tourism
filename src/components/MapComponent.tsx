'use client';

import dynamic from 'next/dynamic';
import type { MapMarkerItem } from './MapInner';

const DynamicMap = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
      <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500">Loading Bahir Dar Map...</span>
    </div>
  ),
});

interface MapComponentProps {
  items: MapMarkerItem[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapComponent({
  items,
  center,
  zoom,
  className = 'h-[500px] w-full',
}: MapComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <DynamicMap items={items} center={center} zoom={zoom} />
    </div>
  );
}
