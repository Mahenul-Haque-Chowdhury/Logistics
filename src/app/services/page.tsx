import { services } from '@/lib/data';
import Link from 'next/link';
import { Ship, Boxes, Truck, Headset, MoveRight, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Operational US logistics solutions: vehicle relocation programs & operator dispatch support.'
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Ship, Boxes, Truck, Headset, MoveRight };

export default function ServicesPage() {
  const relocation = services.filter(s => s.category === 'relocation');
  const dispatch = services.filter(s => s.category === 'dispatch');

  const renderGroup = (label: string, items: typeof services) => (
    <section key={label} className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight font-heading">{label}</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(s => {
          const Icon = (s.icon && iconMap[s.icon]) || Ship;
          return (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/40 p-6 shadow-soft overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500/50">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-brand-500/5 to-brand-700/5 transition-opacity" />
              <div className="flex items-start gap-4">
                <span className="inline-flex p-2 rounded-md bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-inset ring-brand-500/20">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-lg tracking-tight">{s.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">{s.summary}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                {s.features.slice(0,3).map(f => <li key={f} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-500" />{f}</li>)}
              </ul>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );

  return (
    <main className="container mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight font-heading">Logistics Service Pillars</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">Two integrated solution pillars: precision vehicle relocation programs and operator dispatch enablement. Explore offerings engineered to reduce friction, improve visibility, and accelerate execution.</p>
      </div>
      {renderGroup('Vehicle Relocation Programs', relocation)}
      {renderGroup('Operator & Dispatch Enablement', dispatch)}
    </main>
  );
}
