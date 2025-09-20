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
      <MapContainer center={center} zoom={5} style={{ height: 380, width: '100%' }} scrollWheelZoom={false} attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

// formatStatus no longer needed after simplification
