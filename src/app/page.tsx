import { EnhancedHero } from "@/components/sections/EnhancedHero";
import React from 'react';
import Link from 'next/link';
import { ServicePreviewCard } from '@/components/sections/ServicePreviewCard';
import { TestimonialCard } from '@/components/sections/TestimonialCard';
import { Package, Headset, Car, ShoppingCart, CarFront, Pill, Store, Factory, UtensilsCrossed } from 'lucide-react';

const industries: { label: string; icon: React.ReactNode }[] = [
  { label: 'E-commerce', icon: <ShoppingCart className="w-5 h-5" /> },
  { label: 'Automotive', icon: <CarFront className="w-5 h-5" /> },
  { label: 'Pharmaceuticals', icon: <Pill className="w-5 h-5" /> },
  { label: 'Retail', icon: <Store className="w-5 h-5" /> },
  { label: 'Manufacturing', icon: <Factory className="w-5 h-5" /> },
  { label: 'Food & Beverage', icon: <UtensilsCrossed className="w-5 h-5" /> },
];

const testimonials: { quote: string; name: string; role: string; highlight?: string }[] = [
  { quote: 'Outstanding reliability and visibility across our regional distribution lanes.', name: 'Elena P.', role: 'Operations Manager', highlight: 'reliability' },
  { quote: 'Their dispatch coordination cut our exception handling time in half.', name: 'Marcus T.', role: 'Director of Logistics', highlight: 'half' },
  { quote: 'Vehicle repositioning accuracy improved our fleet utilization KPIs.', name: 'Priya R.', role: 'Fleet Strategy Lead', highlight: 'utilization' },
];

export default function Home() {
  return (
    <>
  <EnhancedHero />

      {/* Services Preview (What We Deliver) */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(42,137,255,0.12),transparent_70%)]" />
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What We Deliver</h2>
              <p className="text-muted-foreground">Integrated multimodal execution built for speed, reliability, and measurable outcomes.</p>
            </div>
            <Link href="/services" className="inline-flex items-center text-sm font-medium text-brand-600 hover:underline">All Services →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ServicePreviewCard
              title="Last-Mile Delivery"
              blurb="Fast, trackable final-mile distribution network with SLA-focused routing and geo verification."
              href="/services/last-mile-delivery"
              tags={["tracking","scan","POD"]}
              media={<svg viewBox="0 0 120 80" className="w-full h-full"><rect x="4" y="34" width="72" height="36" rx="6" fill="url(#grad1)"/><rect x="14" y="44" width="20" height="12" rx="2" fill="#fff" opacity="0.9"/><circle cx="28" cy="70" r="6" fill="#1d4ed8"/><circle cx="56" cy="70" r="6" fill="#1d4ed8"/><path d="M76 48h20l18 14v8H76V48Z" fill="#1d4ed8" opacity="0.8"/><defs><linearGradient id="grad1" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#2563eb"/><stop offset="100%" stopColor="#1e3a8a"/></linearGradient></defs></svg>}
            />
            <ServicePreviewCard
              title="Dispatch Operations"
              blurb="24/7 centralized coordination: load planning, exception handling, and utilization optimization."
              href="/services/dispatch-operations"
              tags={["24/7","routing","alerts"]}
              media={<svg viewBox="0 0 120 80" className="w-full h-full"><rect x="4" y="8" width="34" height="24" rx="3" fill="#1d4ed8" opacity="0.85"/><rect x="44" y="8" width="34" height="24" rx="3" fill="#3b82f6" opacity="0.85"/><rect x="84" y="8" width="32" height="24" rx="3" fill="#1e3a8a" opacity="0.85"/><rect x="10" y="40" width="96" height="30" rx="5" fill="url(#grad2)"/><circle cx="30" cy="55" r="6" fill="#fff" opacity="0.9"/><rect x="44" y="48" width="40" height="5" rx="2" fill="#fff" opacity="0.7"/><rect x="44" y="56" width="32" height="5" rx="2" fill="#fff" opacity="0.6"/><defs><linearGradient id="grad2" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#2563eb"/></linearGradient></defs></svg>}
            />
            <ServicePreviewCard
              title="Vehicle Relocation"
              blurb="Multi-state fleet repositioning with capacity orchestration and milestone visibility."
              href="/services/vehicle-relocation"
              tags={["multi-state","fleet","SLA"]}
              media={<svg viewBox="0 0 120 80" className="w-full h-full"><rect x="6" y="42" width="108" height="24" rx="6" fill="#1e3a8a"/><rect x="16" y="30" width="28" height="18" rx="4" fill="#2563eb"/><rect x="54" y="26" width="28" height="22" rx="4" fill="#1d4ed8"/><rect x="92" y="34" width="18" height="14" rx="3" fill="#3b82f6"/><circle cx="32" cy="66" r="7" fill="#0f172a"/><circle cx="32" cy="66" r="4" fill="#fff"/><circle cx="74" cy="66" r="7" fill="#0f172a"/><circle cx="74" cy="66" r="4" fill="#fff"/><circle cx="102" cy="66" r="6" fill="#0f172a"/><circle cx="102" cy="66" r="3" fill="#fff"/></svg>}
            />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="relative border-y border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/60 dark:bg-neutral-900/50">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_30%,rgba(42,137,255,0.15),transparent_70%)]" />
        <div className="container max-w-6xl py-20 md:py-24 relative">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Industries Served</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {industries.map(ind => (
              <div key={ind.label} className="group relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950/40 hover:border-brand-500/50 transition">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 opacity-[0.07] group-hover:opacity-10 transition text-brand-600">
                  {ind.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20">{ind.icon}</span>
                  <span className="font-medium tracking-tight">{ind.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container max-w-6xl py-24 md:py-28">
        <h2 className="text-3xl font-bold tracking-tight mb-12">Trusted By Supply Chain Leaders</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <TestimonialCard key={t.name} quote={t.quote} name={t.name} role={t.role} highlight={t.highlight} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 -z-10" />
        <div className="container max-w-5xl text-center text-white space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to streamline your logistics?</h2>
          <p className="text-white/80 max-w-2xl mx-auto">Get a tailored solution proposal in less than 24 hours. Our team is ready.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote" className="inline-flex items-center justify-center rounded-md bg-white text-brand-700 font-medium px-6 py-3 text-sm hover:bg-neutral-100 transition focus-ring">Request a Quote</a>
            <a href="/contact" className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-medium hover:bg-white/10 transition focus-ring">Talk to an Expert</a>
          </div>
        </div>
      </section>
    </>
  );
}
