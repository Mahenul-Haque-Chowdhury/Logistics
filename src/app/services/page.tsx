import { services } from '@/lib/data';
import { PageHeader } from '@/components/sections/PageHeader';
import { ServicesExplorer } from '@/components/sections/ServicesExplorer';
import type { Metadata } from 'next';
import { ShieldCheck, Gauge, Network } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Operational US logistics solutions: vehicle relocation programs & operator dispatch support.'
};

// iconMap no longer needed on this page; ServiceCard handles icons via ServicesExplorer

export default function ServicesPage() {
  return (
    <main className="container mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        eyebrow="Services"
        title="Operational Logistics, Built For Reliability"
        description={<>Explore two integrated pillars—Vehicle Relocation Programs and Operator Dispatch Enablement—designed to remove friction, improve visibility, and accelerate execution.</>}
        align="left"
      />

      {/* Value props strip */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="surface p-4 rounded-lg flex items-start gap-3">
          <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><ShieldCheck className="w-4 h-4" /></span>
          <div>
            <p className="text-sm font-medium tracking-tight">Reliable by Design</p>
            <p className="text-[12px] text-muted-foreground">Unified SOPs, vetted partners, and clear SLAs.</p>
          </div>
        </div>
        <div className="surface p-4 rounded-lg flex items-start gap-3">
          <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><Gauge className="w-4 h-4" /></span>
          <div>
            <p className="text-sm font-medium tracking-tight">Instant Estimates</p>
            <p className="text-[12px] text-muted-foreground">Tiered logic + distance intelligence.</p>
          </div>
        </div>
        <div className="surface p-4 rounded-lg flex items-start gap-3">
          <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><Network className="w-4 h-4" /></span>
          <div>
            <p className="text-sm font-medium tracking-tight">Nationwide Coverage</p>
            <p className="text-[12px] text-muted-foreground">Consistent process across the lower 48.</p>
          </div>
        </div>
      </div>

  {/* Global services explorer */}
  <ServicesExplorer services={services} showControls={false} />

      {/* Bottom CTA */}
      <section className="mt-16 surface-elevated p-8 rounded-xl text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(42,137,255,0.15),transparent_70%)]" />
        <h2 className="font-heading font-semibold text-2xl md:text-3xl tracking-tight">Have a program in mind?</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We’ll tailor the right mix—relocation and operator support—to your goals and SLAs.</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <a href="/quote" className="btn-primary">Get an Estimate</a>
          <a href="/contact" className="btn-outline">Talk To Us</a>
        </div>
      </section>
    </main>
  );
}
