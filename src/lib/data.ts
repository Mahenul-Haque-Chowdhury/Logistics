import { TrackingEvent, Service, Testimonial } from '@/types';

export const services: Service[] = [
  // Vehicle Relocation Pillar (renamed set derived from provided concepts)
  {
    slug: 'single-unit-transport',
    title: 'Individual Vehicle Transport',
    summary: 'Secure, streamlined movement for a single vehicle door-to-door.',
    description: 'End-to-end coordination for personal, auction, or dealership moves with condition capture and reliable ETAs.',
    icon: 'Truck',
    category: 'relocation',
    features: ['Door-to-Door Handling', 'Condition Documentation', 'Live Status Points', 'Verified Carriers']
  },
  {
    slug: 'fleet-shift',
    title: 'Fleet Shift & Rebalancing',
    summary: 'Coordinated multi-location repositioning for enterprise or rental fleets.',
    description: 'Programmatic scheduling, batching logic, and utilization analytics reduce idle time and empty miles across your footprint.',
    icon: 'MoveRight',
    category: 'relocation',
    features: ['Batch Routing', 'Location Prioritization', 'Utilization Insights', 'Centralized Updates']
  },
  {
    slug: 'premium-enclosed',
    title: 'Protected Enclosed Transport',
    summary: 'Weather-shielded movement for luxury, rare, or high-value units.',
    description: 'Vetted enclosed carriers, soft‑strap securement, and tight chain-of-custody for specialty and collectible vehicles.',
    icon: 'Boxes',
    category: 'relocation',
    features: ['Enclosed Trailers', 'Soft Strap Securement', 'Low Clearance Handling', 'Photo Chain-of-Custody']
  },
  {
    slug: 'priority-fastlane',
    title: 'Priority FastLane Moves',
    summary: 'Accelerated routing for time-sensitive transport windows.',
    description: 'Reserved capacity + proactive milestone messaging to meet compressed delivery schedules without guesswork.',
    icon: 'Ship',
    category: 'relocation',
    features: ['Expedited Scheduling', 'Proactive ETA Alerts', 'Capacity Reservation', 'Escalation Path']
  },
  {
    slug: 'specialty-exotic',
    title: 'Specialty & Exotic Concierge',
    summary: 'White-glove coordination for exotic, custom, or specialty builds.',
    description: 'Enhanced protective handling, confidentiality options, and pre-move planning ensure risk mitigation for unique assets.',
    icon: 'Boxes',
    category: 'relocation',
    features: ['Dedicated Handling', 'Confidential Routing', 'Enhanced Protection', 'Route Risk Review']
  },
  {
    slug: 'national-network',
    title: 'National Coverage Network',
    summary: 'Continental U.S. reach with consistent process + visibility.',
    description: 'Unified standards across regions with centralized coordination and integrated tracking for predictable performance.',
    icon: 'MoveRight',
    category: 'relocation',
    features: ['Continental Coverage', 'Unified Standards', 'Central Dispatch', 'Tracking Layer']
  },
  // Dispatch / Operator Support Pillar
  {
    slug: 'independent-operator-desk',
    title: 'Operator Dispatch Desk',
    summary: 'Day & night dispatch orchestration for independent operators.',
    description: 'Load sourcing, scheduling, and exception handling so operators maximize hours-of-service productivity while we manage complexity.',
    icon: 'Headset',
    category: 'dispatch',
    features: ['Load Sourcing', '24/7 Coordination', 'Exception Handling', 'Carrier Vetting']
  },
  {
    slug: 'live-visibility-suite',
    title: 'Live Visibility Suite',
    summary: 'Real-time milestone + movement intelligence across active loads.',
    description: 'Telematics ingestion and geo-event triggers improve transparency, reduce manual check calls, and surface early-risk signals.',
    icon: 'Truck',
    category: 'dispatch',
    features: ['Geo Events', 'Exception Flags', 'Device Integrations', 'Latency Reduction']
  },
  {
    slug: 'zero-risk-intro',
    title: 'Zero-Risk Pilot Program',
    summary: 'Short trial window to prove value before scaling partnership.',
    description: 'Structured evaluation period with KPI baselines, weekly performance briefs, and no long-term obligation.',
    icon: 'Ship',
    category: 'dispatch',
    features: ['Defined KPIs', 'Weekly Reviews', 'No Obligation', 'Fast Onboarding']
  },
  {
    slug: 'financial-docs-hub',
    title: 'Billing & Settlement Hub',
    summary: 'Streamlined financial packet prep and invoice accuracy control.',
    description: 'Automated document collation, validation checkpoints, and discrepancy flagging accelerate cash cycles.',
    icon: 'Boxes',
    category: 'dispatch',
    features: ['Invoice QA', 'Document Assembly', 'Dispute Reduction', 'Faster Turnaround']
  },
  {
    slug: 'carrier-standing-score',
    title: 'Performance & Compliance Scoring',
    summary: 'Continuous monitoring of safety, service, and rating indicators.',
    description: 'Composite scoring framework highlights risk trends, enabling proactive remediation and partner optimization.',
    icon: 'Headset',
    category: 'dispatch',
    features: ['Safety Signals', 'On-Time Metrics', 'Trend Dashboards', 'Score Weighting']
  },
  {
    slug: 'regulatory-support-suite',
    title: 'Regulatory Support Suite',
    summary: 'Hands-on assistance with filings, credentials, and audits.',
    description: 'Structured workflow for DOT, IFTA, and record management lowers admin burden and compliance gaps.',
    icon: 'MoveRight',
    category: 'dispatch',
    features: ['IFTA Prep', 'DOT Filing Aid', 'Record Controls', 'Renewal Tracking']
  }
];

export function mockTrackingEvents(trackingNumber: string): TrackingEvent[] {
  const base = Date.now();
  return [
    { id: trackingNumber + '-1', status: 'PENDING', location: 'Order Created', lat: 40.7128, lng: -74.006, timestamp: new Date(base - 1000*60*60*24).toISOString() },
    { id: trackingNumber + '-2', status: 'IN_TRANSIT', location: 'Origin Facility', lat: 39.9526, lng: -75.1652, timestamp: new Date(base - 1000*60*60*18).toISOString() },
    { id: trackingNumber + '-3', status: 'AT_HUB', location: 'Regional Hub', lat: 41.2033, lng: -77.1945, timestamp: new Date(base - 1000*60*60*8).toISOString() },
    { id: trackingNumber + '-4', status: 'OUT_FOR_DELIVERY', location: 'Destination City', lat: 40.4406, lng: -79.9959, timestamp: new Date(base - 1000*60*60*2).toISOString() },
    { id: trackingNumber + '-5', status: 'DELIVERED', location: 'Customer Address', lat: 39.2904, lng: -76.6122, timestamp: new Date(base - 1000*60*30).toISOString() },
  ];
}

export const testimonials: Testimonial[] = [
  { author: 'Alex Rivera', role: 'Supply Chain Director', quote: 'Visibility and reliability improved our on-time performance dramatically.' },
  { author: 'Dana Lee', role: 'E-commerce Ops Lead', quote: 'Seamless integration and consistent delivery speed. Highly recommend.' },
  { author: 'Martin Chen', role: 'Logistics Manager', quote: 'Their tracking transparency reduced our support tickets by 40%.' }
];
