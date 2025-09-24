"use client";
import { useMemo, useState } from 'react';
import { Service } from '@/types';
import { ServiceCard } from '@/components/sections/ServiceCard';

type Category = 'all' | 'relocation' | 'dispatch';

export function ServicesExplorer({ services, showControls = true }: { services: Service[]; showControls?: boolean }) {
  const [category, setCategory] = useState<Category>('all');

  const counts = useMemo(() => ({
    all: services.length,
    relocation: services.filter(s => s.category === 'relocation').length,
    dispatch: services.filter(s => s.category === 'dispatch').length,
  }), [services]);

  const filtered = useMemo(() => (
    category === 'all' ? services : services.filter(s => s.category === category)
  ), [services, category]);

  return (
    <section className="mt-6">
      {showControls && (
        <div className="inline-flex gap-1 rounded-lg border border-border/60 p-1 bg-background/60">
          <TabButton active={category==='all'} onClick={()=>setCategory('all')} label={`All (${counts.all})`} />
          <TabButton active={category==='relocation'} onClick={()=>setCategory('relocation')} label={`Relocation (${counts.relocation})`} />
          <TabButton active={category==='dispatch'} onClick={()=>setCategory('dispatch')} label={`Dispatch (${counts.dispatch})`} />
        </div>
      )}
      <div className="mt-2">
        {filtered.map((s) => {
          const validIcons = ['Ship', 'Boxes', 'Truck', 'Headset', 'MoveRight'] as const;
          type IconName = (typeof validIcons)[number];
          const icon: IconName = (validIcons.includes((s.icon as unknown as IconName)) ? (s.icon as IconName) : 'Truck');
          return (
            <ServiceCard
              key={s.slug}
              title={s.title}
              summary={s.summary}
              icon={icon}
              href={`/services/${s.slug}`}
            />
          );
        })}
      </div>
    </section>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md transition border ${active ? 'bg-brand-600 text-white border-brand-600' : 'bg-background border-transparent hover:bg-accent'}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
