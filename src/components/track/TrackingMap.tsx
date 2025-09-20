"use client";
import dynamic from 'next/dynamic';
import { TrackingEvent } from '@/types';

// Dynamic imports (cast to any to bypass TS prop inference issues with react-leaflet + next/dynamic)
const MapContainer: any = dynamic(async () => (await import('react-leaflet')).MapContainer, { ssr: false });
const TileLayer: any = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
// Removed Polyline, Marker, Popup for simplified map

interface Props { events: TrackingEvent[] }

export function TrackingMap({ events }: Props) {
  // Static center (continental US focus). Ignoring events per new requirement.
  const center: [number, number] = [39.5, -98.35];
  return (
    <div className="mt-10 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <MapContainer center={center} zoom={6} style={{ height: 380, width: '100%' }} scrollWheelZoom={false} attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
}

// formatStatus no longer needed after simplification
