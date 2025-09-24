import { services } from '@/lib/data';
import { PageHeader } from '@/components/sections/PageHeader';
import { ServiceCard } from '@/components/sections/ServiceCard';
import type { Metadata } from 'next';
import { ShieldCheck, Gauge, Network } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Operational US logistics solutions: vehicle relocation programs & operator dispatch support.'
};

// Services page now renders categorized sections directly; explorer removed.

export default function ServicesPage() {
  return (
    <main className="container mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        eyebrow="Services"
        title="Operational Logistics, Built For Reliability"
        description={<>Explore two integrated pillars—Vehicle Relocation Programs and Operator Dispatch Enablement—designed to remove friction, improve visibility, and accelerate execution.</>}
        align="left"
      />

      {/* Value props (minimal) */}
      <div className="mt-10 grid gap-y-4 gap-x-8 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><ShieldCheck className="w-4 h-4" /></span>
          <div className="pt-0.5">
            <p className="text-sm font-medium tracking-tight">Reliable by Design</p>
            <p className="text-xs text-muted-foreground">Unified SOPs, vetted partners, clear SLAs.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><Gauge className="w-4 h-4" /></span>
          <div className="pt-0.5">
            <p className="text-sm font-medium tracking-tight">Instant Estimates</p>
            <p className="text-xs text-muted-foreground">Distance + logic—fast, transparent.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><Network className="w-4 h-4" /></span>
          <div className="pt-0.5">
            <p className="text-sm font-medium tracking-tight">Nationwide Coverage</p>
            <p className="text-xs text-muted-foreground">Consistent across the lower 48.</p>
          </div>
        </div>
      </div>

      {/* Categorized Services */}
      <div className="mt-16 space-y-20">
        {/* Vehicle Relocation */}
        <section>
          <header className="mb-8 max-w-2xl">
            <h2 className="font-heading font-semibold text-xl md:text-2xl tracking-tight">Vehicle Relocation</h2>
            <p className="mt-2 text-sm text-muted-foreground">Programmatic single unit, multi-unit, and specialty movement—protected, coordinated, and visibility-enabled.</p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.filter(s=>s.category==='relocation').map(s=>{
              const validIcons = ['Ship','Boxes','Truck','Headset','MoveRight'] as const;
              type IconName = (typeof validIcons)[number];
              const icon: IconName = (validIcons.includes((s.icon as unknown as IconName)) ? (s.icon as IconName) : 'Truck');
              return (
                <ServiceCard key={s.slug} title={s.title} summary={s.summary} icon={icon} href={`/services/${s.slug}`} />
              );
            })}
          </div>
        </section>
        {/* Operator Dispatch & Support */}
        <section>
          <header className="mb-8 max-w-2xl">
            <h2 className="font-heading font-semibold text-xl md:text-2xl tracking-tight">Operator Dispatch & Support</h2>
            <p className="mt-2 text-sm text-muted-foreground">Continuous coordination, compliance, visibility, and back-office acceleration layers for operators & carrier groups.</p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.filter(s=>s.category==='dispatch').map(s=>{
              const validIcons = ['Ship','Boxes','Truck','Headset','MoveRight'] as const;
              type IconName = (typeof validIcons)[number];
              const icon: IconName = (validIcons.includes((s.icon as unknown as IconName)) ? (s.icon as IconName) : 'Truck');
              return (
                <ServiceCard key={s.slug} title={s.title} summary={s.summary} icon={icon} href={`/services/${s.slug}`} />
              );
            })}
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <section className="mt-20 surface-elevated p-10 rounded-xl text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(42,137,255,0.15),transparent_70%)]" />
        <h2 className="font-heading font-semibold text-2xl md:text-3xl tracking-tight">Have a program in mind?</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">We’ll tailor the right mix—relocation and operator support—to your goals and SLAs.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/quote" className="btn-primary">Get an Estimate</a>
          <a href="/contact" className="btn-outline">Talk To Us</a>
        </div>
      </section>
    </main>
  );
}
