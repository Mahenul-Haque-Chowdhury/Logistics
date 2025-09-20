"use client";
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

type GenericComponent = ComponentType<Record<string, unknown>>;

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer as unknown as GenericComponent), { ssr: false }) as GenericComponent;
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer as unknown as GenericComponent), { ssr: false }) as GenericComponent;

export function TrackingMap() {
  const center: [number, number] = [39.5, -98.35];
  return (
    <div className="mt-10 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <MapContainer
        center={center}
        zoom={5}
        minZoom={2}
        maxZoom={18}
        style={{ height: 400, width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={false}
        preferCanvas={false}
      >
        {/* High DPI (retina) aware tile layer. `@2x` tiles sharpen appearance on retina screens */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Leaflet automatically requests @2x tiles when detectRetina is true.
          detectRetina
        />
        {/* Example alternative (commented) high-contrast layer if needed:
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          detectRetina
        /> */}
      </MapContainer>
      <style jsx global>{`
        /* Improve crispness for map tiles */
        .leaflet-container .leaflet-tile { image-rendering: auto; }
        @media (min-resolution: 2dppx) {
          .leaflet-container .leaflet-tile { image-rendering: -webkit-optimize-contrast; }
        }
      `}</style>
    </div>
  );
}

// formatStatus no longer needed after simplification
