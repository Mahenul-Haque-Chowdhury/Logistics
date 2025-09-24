"use client";
import { useState, useEffect } from 'react';
import { TrackingEvent } from '@/types';
import { TrackingMap } from '@/components/track/TrackingMap';
import { mockTrackingEvents } from '@/lib/data';
import { Loader2, Circle, PackageSearch, Map, Truck, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';

export default function TrackPage() {
  const [tn, setTn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<TrackingEvent[] | null>(null);
  const [demo, setDemo] = useState(true);

  // Initialize with demo events so the map + timeline are visible immediately
  useEffect(() => {
    setEvents(mockTrackingEvents('DEMO123'));
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!tn.trim()) return;
    setLoading(true); setError(null); setDemo(false);
    try {
      const res = await fetch(`/api/track?tn=${encodeURIComponent(tn.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Tracking failed');
  setEvents(json.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally { setLoading(false); }
  }
  return (
    <main className="container mx-auto max-w-6xl px-6 py-20">
      <PageHeader
        eyebrow="Tracking"
        title="Live Shipment Visibility"
        description={<>Enter a tracking number to view status progression, location context, and milestone timestamps. Demo data preloaded for preview.</>}
        align="left"
      />

      <div className="mt-2 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {processSteps.map(s => (
          <div key={s.title} className="surface p-3 rounded-lg flex flex-col gap-2.5 relative overflow-hidden">
            <span className="absolute -top-6 -right-6 w-16 h-16 bg-brand-600/5 rounded-full blur-xl" />
            <span className="inline-flex p-1.5 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/15 w-max"><s.icon className="w-4 h-4" /></span>
            <h3 className="text-xs font-medium tracking-tight">{s.title}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

  <form onSubmit={submit} className="mt-8 surface p-5 rounded-xl max-w-xl flex flex-col sm:flex-row gap-3">
        <input value={tn} onChange={e=>setTn(e.target.value)} placeholder="e.g. ABC123456" className="flex-1 rounded-md bg-transparent border border-border/60 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        <button disabled={loading} className="btn-primary min-w-[140px] inline-flex items-center justify-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />} Track</button>
      </form>
      {demo && !loading && !error && (
        <div className="mt-3 text-[11px] inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-brand-600/10 text-brand-700 dark:text-brand-300 ring-1 ring-brand-600/20">
          <span>Demo timeline loaded. Enter a number for a fresh simulation.</span>
        </div>
      )}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {loading && (
        <div className="mt-6 space-y-3 max-w-md">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="h-10 rounded-md bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
          ))}
        </div>
      )}
      {events && events.length > 0 && (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="surface p-4 rounded-lg h-[520px] flex flex-col relative overflow-hidden">
            <span className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(42,137,255,0.12),transparent_70%)]" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium tracking-tight">Route Overview</h3>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Map</span>
            </div>
            <div className="flex-1 rounded-md overflow-hidden">
              <TrackingMap />
            </div>
          </div>
          {!demo && !loading && (
            <div className="surface p-5 rounded-lg relative max-h-[520px] overflow-auto">
              <h3 className="text-sm font-medium tracking-tight mb-4 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Status Timeline</h3>
              <ol className="space-y-6">
                {events.slice().reverse().map((ev, idx) => {
                  const delivered = ev.status === 'DELIVERED';
                  return (
                    <li key={ev.id} className="relative pl-8">
                      <span className="absolute left-0 top-1.5">
                        {delivered ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-brand-600" />}
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium">{formatStatus(ev.status)}</span>
                        <span className="text-xs text-muted-foreground">{new Date(ev.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground/80">{ev.location}</p>
                      {ev.note && <p className="text-[11px] mt-1 text-muted-foreground italic">{ev.note}</p>}
                      {idx !== events.length - 1 && <span className="absolute left-[9px] top-6 bottom-[-18px] w-px bg-border/60" />}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function formatStatus(s: string) {
  return s.replace(/_/g,' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
}

const processSteps = [
  { icon: PackageSearch, title: 'Lookup', desc: 'Identify shipment & prepare route context.' },
  { icon: Map, title: 'Geolocate', desc: 'Normalize coordinates & route distance.' },
  { icon: Truck, title: 'In Transit', desc: 'Movement + waypoint event generation.' },
  { icon: Clock, title: 'Milestones', desc: 'Timestamp & classify progression events.' },
  { icon: RefreshCw, title: 'Updates', desc: 'Surface changes & exception states.' },
  { icon: CheckCircle, title: 'Delivered', desc: 'Final confirmation & closure log.' }
];
