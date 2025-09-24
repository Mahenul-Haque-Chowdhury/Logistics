"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const stats: { label: string; value: string }[] = [
  { label: 'Shipments / week', value: '1200+' },
  { label: 'On-time rate', value: '98%' },
  { label: 'States Served', value: '48' },
  { label: 'SLA Compliance', value: '99%' }
];

export function EnhancedHero() {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(42,137,255,0.25),transparent_70%)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
      </div>
      <div className="container max-w-7xl grid md:grid-cols-2 gap-14 items-center">
        <div className="space-y-8">
          <p className="eyebrow">Modern Supply Chain Execution</p>
          <h1 className="font-heading text-5xl md:text-6xl font-semibold leading-[1.05] max-w-[18ch]">
            End‑to‑End <span className="text-brand-600">Logistics</span> Performance.
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-[54ch]">
            Reliable last‑mile delivery, dispatch orchestration and vehicle relocation with transparent, real-time visibility across the United States.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote" className="btn-primary">Get a Quote</Link>
            <Link href="/services" className="btn-outline">Explore Services</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 content-start">
          {stats.map(s => (
            <div key={s.label} className="surface p-5 flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{s.label}</span>
              <span className="text-3xl font-heading font-semibold">{s.value}</span>
            </div>
          ))}
          <div className="col-span-2 surface-elevated p-6 h-40 flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
            Future live map / network visualization
          </div>
        </div>
      </div>
    </section>
  );
}
