export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'AT_HUB' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION';

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  location: string;
  timestamp: string; // ISO
  note?: string;
  lat?: number;
  lng?: number;
}

export interface QuoteRequest {
  name: string;
  email: string;
  origin: string;
  destination: string;
  weightKg: number;
  mode: 'air' | 'sea' | 'road';
  notes?: string;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  features: string[];
  description?: string;
  icon?: string; // name of an icon key (lucide) or emoji fallback
  category?: 'relocation' | 'dispatch';
  tier?: 'standard' | 'premium';
  outcomes?: string[]; // measurable or value-focused outcomes
  useCases?: string[]; // concrete scenarios / buyer triggers
  differentiators?: string[]; // why choose this offering
  idealCustomers?: string[]; // target segments
  kpis?: string[]; // optional performance indicators (non-binding)
  slaNotes?: string; // short narrative on service level / latency expectations
  ctaLabel?: string; // custom CTA override
}

export interface Testimonial {
  author: string;
  role: string;
  quote: string;
}
