"use client";
import { useState, useEffect } from 'react';
import { TrackingEvent } from '@/types';
import { TrackingMap } from '@/components/track/TrackingMap';
import { mockTrackingEvents } from '@/lib/data';
import { Loader2, Circle, CheckCircle2 } from 'lucide-react';

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
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight font-heading">Track Shipment</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl">Enter your tracking number to view real-time milestone history.</p>
      <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl">
        <input value={tn} onChange={e=>setTn(e.target.value)} placeholder="e.g. ABC123456" className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm" />
        <button disabled={loading} className="btn-primary min-w-[140px] inline-flex items-center justify-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />} Track</button>
      </form>
      {demo && !loading && !error && (
        <div className="mt-6 text-xs inline-flex items-center gap-2 bg-blue-50 dark:bg-neutral-800/60 border border-blue-200 dark:border-neutral-700 text-blue-700 dark:text-neutral-300 px-3 py-2 rounded-md">
          <span>This is a demo route. Enter a tracking number to fetch a fresh simulated timeline.</span>
        </div>
      )}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {loading && (
        <div className="mt-10 space-y-4 max-w-md">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="h-12 rounded-md bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
          ))}
        </div>
      )}
      {events && events.length > 0 && (
        <div className="mt-10 space-y-10">
          <div>
            <TrackingMap events={events} />
          </div>
          {!demo && !loading && (
            <div className="relative">
              <ol className="space-y-6">
                {events.slice().reverse().map((ev, idx) => {
                  const delivered = ev.status === 'DELIVERED';
                  return (
                    <li key={ev.id} className="relative pl-8">
                      <span className="absolute left-0 top-1.5">
                        {delivered ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-brand-600" />}
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium">{formatStatus(ev.status)}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{new Date(ev.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{ev.location}</p>
                      {ev.note && <p className="text-xs mt-1 text-neutral-500 italic">{ev.note}</p>}
                      {idx !== events.length - 1 && <span className="absolute left-[9px] top-6 bottom-[-18px] w-px bg-neutral-200 dark:bg-neutral-700" />}
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
