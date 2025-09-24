"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { Sparkles, Star } from 'lucide-react';

type Category = 'all' | 'relocation' | 'dispatch';
type SortMode = 'default' | 'tier';

export function ServicesExplorer({ services, showControls = true }: { services: Service[]; showControls?: boolean }) {
  const [category, setCategory] = useState<Category>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const counts = useMemo(() => ({
    all: services.length,
    relocation: services.filter(s => s.category === 'relocation').length,
    dispatch: services.filter(s => s.category === 'dispatch').length,
  }), [services]);

  const filtered = useMemo(() => {
    let list = category === 'all' ? services : services.filter(s => s.category === category);
    if (sortMode === 'tier') {
      list = list.slice().sort((a,b) => (b.tier === 'premium' ? 1 : 0) - (a.tier === 'premium' ? 1 : 0));
    }
    return list;
  }, [services, category, sortMode]);

  const featured = useMemo(() => filtered.filter(s => s.tier === 'premium').slice(0, 1), [filtered]);

  return (
    <section className="mt-6">
      {/* Tabs + Sort */}
      {showControls && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex gap-1 rounded-lg border border-border/60 p-1 bg-background/60">
            <TabButton active={category==='all'} onClick={()=>setCategory('all')} label={`All (${counts.all})`} />
            <TabButton active={category==='relocation'} onClick={()=>setCategory('relocation')} label={`Relocation (${counts.relocation})`} />
            <TabButton active={category==='dispatch'} onClick={()=>setCategory('dispatch')} label={`Dispatch (${counts.dispatch})`} />
          </div>
          <div className="inline-flex gap-1 rounded-lg border border-border/60 p-1 bg-background/60">
            <TabButton active={sortMode==='default'} onClick={()=>setSortMode('default')} label="Default" />
            <TabButton active={sortMode==='tier'} onClick={()=>setSortMode('tier')} label="Tier First" />
          </div>
        </div>
      )}

      {/* Featured highlight */}
      {featured.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-brand-600/30 bg-gradient-to-br from-brand-600/15 via-transparent to-transparent">
          <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <span className="inline-flex items-center gap-2 text-brand-700 dark:text-brand-300 text-xs font-medium uppercase tracking-wide"><Star className="w-4 h-4" /> Featured</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold tracking-tight text-lg">{featured[0].title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{featured[0].summary}</p>
            </div>
            <Link href={`/services/${featured[0].slug}`} className="btn-primary text-sm inline-flex items-center gap-2">
              Explore <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
              outcomes={s.outcomes}
              tier={s.tier}
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
