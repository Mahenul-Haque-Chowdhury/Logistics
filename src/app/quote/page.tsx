"use client";
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Calculator, Zap, ShieldCheck, CarFront, Fuel, Gauge, Truck, Database } from 'lucide-react';

/* --------------------------------- Config --------------------------------- */
const serviceTypes = [
  { value: 'last-mile', label: 'Last-Mile Delivery' },
  { value: 'dispatch', label: 'Dispatch Operations' },
  { value: 'vehicle-relocation', label: 'Vehicle Relocation' }
];

const vehicleTiers = [
  { min: 0, max: 600, open: 1.60, enclosed: 2.09, label: '1-600 miles' },
  { min: 601, max: 1100, open: 0.85, enclosed: 1.20, label: '601-1100 miles' },
  { min: 1101, max: Infinity, open: 0.70, enclosed: 1.10, label: '1100+ miles' }
];

const schema = z.object({
  fullName: z.string().min(2,'Too short').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9+()\-\s]{7,20}$/,'Invalid phone').optional().or(z.literal('')),
  pickupZip: z.string().regex(/^[0-9]{5}$/,'5-digit ZIP'),
  dropoffZip: z.string().regex(/^[0-9]{5}$/,'5-digit ZIP'),
  vehicles: z.coerce.number().int().positive().max(200),
  distanceMiles: z.coerce.number().positive().max(4000),
  serviceType: z.enum(['last-mile','dispatch','vehicle-relocation']),
  transportMode: z.enum(['open','enclosed']).optional(),
  speed: z.enum(['standard','expedited']),
  notes: z.string().max(400).optional().or(z.literal(''))
}).refine(d => d.serviceType !== 'vehicle-relocation' || !!d.transportMode, { message: 'Select transport mode', path: ['transportMode'] });

type FormValues = z.infer<typeof schema>;

/* --------------------------- Utility / Computations -------------------------- */
function baseRate(service: FormValues['serviceType'], distance: number, transportMode?: string) {
  if (service === 'vehicle-relocation') {
    const tier = vehicleTiers.find(t => distance >= t.min && distance <= t.max) || vehicleTiers[vehicleTiers.length - 1];
    return transportMode === 'enclosed' ? tier.enclosed : tier.open;
  }
  switch (service) {
    case 'last-mile': return 2.2;
    case 'dispatch': return 1.4;
    default: return 2.5;
  }
}

interface SavedQuoteEntry {
  id: string; ts: number; pickupZip: string; dropoffZip: string; serviceType: FormValues['serviceType']; transportMode?: FormValues['transportMode']; speed: FormValues['speed']; vehicles: number; distanceMiles: number; total: number; perMile: number; offline?: boolean;
}

const quoteSignals = [
  { icon: Zap, title: 'Instant Calc', desc: 'Real-time recalculation with each field change.' },
  { icon: Database, title: 'Distance Intelligence', desc: 'ZIP → geo + routed miles with caching.' },
  { icon: Fuel, title: 'Fuel Surcharge', desc: 'Transparent additive component (configurable %).' },
  { icon: CarFront, title: 'Multi-Vehicle Scaling', desc: 'Tiered vehicle factor for operational realism.' }
];

/* --------------------------------- Component -------------------------------- */
export default function QuotePage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { serviceType: 'last-mile', speed: 'standard', vehicles: 1, distanceMiles: 100, transportMode: 'open' }
  });
  const values = watch();

  const [autoDistance, setAutoDistance] = useState(true);
  const [distanceStatus, setDistanceStatus] = useState<'idle'|'calculating'|'error'|'done'>('idle');
  const lastPairRef = useRef('');
  const memCache = useRef<Record<string, number>>({});

  const [manualRequested, setManualRequested] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualModal, setManualModal] = useState<null | 'missing' | 'requested'>(null);
  const [saveModal, setSaveModal] = useState<null | { type: 'missing-contact' } | { type: 'error'; message: string } | { type: 'saved' }>(null);

  const [savedQuotes, setSavedQuotes] = useState<SavedQuoteEntry[]>([]);

  /* --------------------------- Saved quotes persistence -------------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedQuotesV1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedQuotes(parsed as SavedQuoteEntry[]);
      }
    } catch {}
  }, []);

  function persistQuotes(next: SavedQuoteEntry[]) {
    setSavedQuotes(next);
    try { localStorage.setItem('savedQuotesV1', JSON.stringify(next.slice(0,50))); } catch {}
  }
  function addSavedQuote(entry: SavedQuoteEntry) { persistQuotes([entry, ...savedQuotes].slice(0,50)); }
  function deleteSavedQuote(id: string) { persistQuotes(savedQuotes.filter(q => q.id !== id)); }

  /* --------------------------- Manual quote request -------------------------- */
  async function requestManualQuote() {
    if (!values.email || !values.fullName || !values.phone) { setManualModal('missing'); return; }
    if (manualRequested || manualLoading) return;
    try {
      setManualLoading(true);
      await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, estimate, manualReview: true }) });
      setManualRequested(true); setManualModal('requested');
    } catch { setManualModal('missing'); } finally { setManualLoading(false); }
  }

  /* ----------------------------- Distance auto calc ---------------------------- */
  const pickupZip = values.pickupZip; const dropoffZip = values.dropoffZip;
  useEffect(() => {
    const isFive = (z: string) => /^\d{5}$/.test(z||'');
    const pairKey = pickupZip + '-' + dropoffZip;
    if (!autoDistance || !isFive(pickupZip) || !isFive(dropoffZip)) { setDistanceStatus('idle'); return; }
    if (lastPairRef.current === pairKey) return;
    if (memCache.current[pairKey]) {
      setValue('distanceMiles', memCache.current[pairKey], { shouldDirty: true, shouldValidate: true });
      setDistanceStatus('done'); lastPairRef.current = pairKey; return;
    }
    try {
      const stored = localStorage.getItem('zipDistanceCache');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed[pairKey] === 'number') {
          memCache.current[pairKey] = parsed[pairKey];
            setValue('distanceMiles', parsed[pairKey], { shouldDirty: true, shouldValidate: true });
          setDistanceStatus('done'); lastPairRef.current = pairKey; return;
        }
      }
    } catch {}
    let cancelled = false; setDistanceStatus('calculating'); const controller = new AbortController();
    async function fetchZip(z: string): Promise<{ lat: number; lon: number }> {
      const res = await fetch(`https://api.zippopotam.us/us/${z}`, { signal: controller.signal });
      if (!res.ok) throw new Error('zip fetch fail');
      const data = await res.json(); const place = data.places?.[0];
      return { lat: parseFloat(place.latitude), lon: parseFloat(place.longitude) };
    }
    (async () => {
      try {
        const [a,b] = await Promise.all([fetchZip(pickupZip), fetchZip(dropoffZip)]);
        if (cancelled) return; let miles: number | null = null;
        try {
          const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`, { signal: controller.signal });
          if (routeRes.ok) {
            const routeJson: { routes?: Array<{ distance?: number }> } = await routeRes.json();
            const distMeters = routeJson.routes?.[0]?.distance;
            if (typeof distMeters === 'number') miles = Math.max(1, Math.round(distMeters / 1609.344));
          }
        } catch {}
        if (miles == null) {
          const R = 3958.8; const toRad = (d:number)=>d*Math.PI/180;
          const dLat = toRad(b.lat - a.lat); const dLon = toRad(b.lon - a.lon); const lat1 = toRad(a.lat); const lat2 = toRad(b.lat);
          const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2; const greatCircle = 2*R*Math.asin(Math.sqrt(h));
          miles = Math.max(1, Math.round(greatCircle * 1.15));
        }
        setValue('distanceMiles', miles, { shouldDirty: true, shouldValidate: true }); lastPairRef.current = pairKey; setDistanceStatus('done'); memCache.current[pairKey] = miles;
        try {
          const existing = JSON.parse(localStorage.getItem('zipDistanceCache')||'{}');
          existing[pairKey] = miles; localStorage.setItem('zipDistanceCache', JSON.stringify(existing));
        } catch {}
      } catch { if (!cancelled) setDistanceStatus('error'); }
    })();
    return () => { cancelled = true; controller.abort(); };
  }, [pickupZip, dropoffZip, autoDistance, setValue]);

  /* --------------------------------- Estimation math -------------------------------- */
  const estimate = useMemo(() => {
    try {
      const parsed = schema.safeParse({ ...values, vehicles: Number(values.vehicles), distanceMiles: Number(values.distanceMiles) });
      if (!parsed.success) return null; const v = parsed.data;
      const tierRate = baseRate(v.serviceType, v.distanceMiles, v.transportMode);
      const speedMultiplier = v.speed === 'expedited' ? 1.25 : 1;
      const vehicleFactor = 1 + (v.vehicles - 1) * 0.55;
      const appliedPerMile = tierRate * speedMultiplier * vehicleFactor;
      const raw = v.distanceMiles * appliedPerMile; const fuelSurcharge = raw * 0.09; const total = raw + fuelSurcharge;
      return { subtotal: raw, fuelSurcharge, total, perMile: total / v.distanceMiles, tierRate, appliedPerMile, vehicleFactor, speedMultiplier };
    } catch { return null; }
  }, [values]);

  /* --------------------------------- Save handler -------------------------------- */
  async function onSubmit(form: FormValues) {
    if (!form.email || !form.fullName || !form.phone) { setSaveModal({ type: 'missing-contact' }); return; }
    const legacyPayload = { name: form.fullName, email: form.email, origin: form.pickupZip, destination: form.dropoffZip, weightKg: Math.max(1, Math.round(form.vehicles * 600)), mode: 'road', notes: form.notes || undefined };
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(legacyPayload) });
      let json: { ok?: boolean; error?: string } | null = null; try { json = await res.json(); } catch { json = { error: 'Malformed response' }; }
      if (res.ok && json?.ok && estimate) {
        addSavedQuote({ id: crypto.randomUUID(), ts: Date.now(), pickupZip: form.pickupZip, dropoffZip: form.dropoffZip, serviceType: form.serviceType, transportMode: form.transportMode, speed: form.speed, vehicles: form.vehicles, distanceMiles: form.distanceMiles, total: estimate.total, perMile: estimate.perMile });
        setSaveModal({ type: 'saved' }); reset({ ...form, notes: '' });
      } else { setSaveModal({ type: 'error', message: json?.error || `HTTP ${res.status}` }); }
    } catch {
      if (estimate) {
        addSavedQuote({ id: crypto.randomUUID(), ts: Date.now(), pickupZip: form.pickupZip, dropoffZip: form.dropoffZip, serviceType: form.serviceType, transportMode: form.transportMode, speed: form.speed, vehicles: form.vehicles, distanceMiles: form.distanceMiles, total: estimate.total, perMile: estimate.perMile, offline: true });
        setSaveModal({ type: 'saved' });
      } else setSaveModal({ type: 'error', message: 'Network error saving quote' });
    }
  }

  /* --------------------------------- Rendering -------------------------------- */
  return (
  <main className="container mx-auto max-w-6xl px-6 py-20">
    <PageHeader
      eyebrow="Instant Estimate"
      title="Logistics Pricing In Real Time"
      description={<>Generate a ballpark estimate using ZIP pairs, distance intelligence, and service tier logic. Adjust fields and the quote recalculates instantly.</>}
      align="left"
    />
  <div className="mt-14 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="surface p-5 rounded-xl space-y-4 relative overflow-hidden">
            <span className="absolute -top-10 -right-10 w-40 h-40 bg-brand-600/5 rounded-full blur-2xl" />
            <h2 className="font-heading font-medium tracking-tight flex items-center gap-2 text-sm"><Calculator className="w-4 h-4 text-brand-600" /> Estimate Overview</h2>
            <ul className="text-[11px] space-y-1 text-muted-foreground">
              <li><span className="text-foreground">Scope:</span> Lower 48 States</li>
              <li><span className="text-foreground">Speed:</span> Standard / Expedited</li>
              <li><span className="text-foreground">Dynamic:</span> Field changes auto‑recalculate</li>
            </ul>
            {estimate && (
              <div className="rounded-lg bg-gradient-to-br from-brand-600/10 to-brand-600/0 ring-1 ring-inset ring-brand-600/30 p-4 space-y-2 text-[11px]">
                {values.serviceType === 'vehicle-relocation' && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground">
                    <span>Tier Rate</span><span className="text-right font-medium text-foreground">${estimate.tierRate.toFixed(2)}/mi</span>
                    <span>Speed Mult</span><span className="text-right">{estimate.speedMultiplier.toFixed(2)}x</span>
                    <span>Vehicle Factor</span><span className="text-right">{estimate.vehicleFactor.toFixed(2)}x</span>
                    <span>Adj Per-Mile</span><span className="text-right font-medium">${estimate.appliedPerMile.toFixed(2)}/mi</span>
                  </div>
                )}
                <div className="flex justify-between pt-1"><span className="text-muted-foreground">Subtotal</span><span>${estimate.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fuel (9%)</span><span>${estimate.fuelSurcharge.toFixed(2)}</span></div>
                <div className="h-px bg-border/60" />
                <div className="flex justify-between font-medium text-foreground"><span>Total</span><span>${estimate.total.toFixed(2)}</span></div>
                <div className="text-muted-foreground pt-1">≈ ${estimate.perMile.toFixed(2)} / mi</div>
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {quoteSignals.map(s => (
              <div key={s.title} className="surface p-4 rounded-lg flex items-start gap-3 relative overflow-hidden">
                <span className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-brand-600/5 to-transparent" />
                <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20"><s.icon className="w-4 h-4" /></span>
                <div className="space-y-1">
                  <h3 className="text-xs font-medium tracking-tight">{s.title}</h3>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="surface p-6 rounded-xl space-y-8 relative overflow-hidden">
            <span className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(42,137,255,0.14),transparent_70%)]" />
            <h2 className="font-heading font-medium tracking-tight text-sm flex items-center gap-2"><Truck className="w-4 h-4 text-brand-600" /> Route & Load Details</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Full Name" error={errors.fullName?.message}><input {...register('fullName')} className={inputCls} /></Field>
              <Field label="Email" error={errors.email?.message}><input type="email" {...register('email')} className={inputCls} /></Field>
              <Field label="Phone" error={errors.phone?.message}><input type="tel" {...register('phone')} className={inputCls} /></Field>
            </div>
            <div className="grid md:grid-cols-4 gap-5">
              <Field label="Pickup ZIP" error={errors.pickupZip?.message}><input {...register('pickupZip')} className={inputCls} /></Field>
              <Field label="Dropoff ZIP" error={errors.dropoffZip?.message}><input {...register('dropoffZip')} className={inputCls} /></Field>
              <Field label="Distance (mi)" error={errors.distanceMiles?.message}>
                <div className="flex gap-2 items-start">
                  <input type="number" step="1" {...register('distanceMiles', { valueAsNumber: true })} className={inputCls} />
                  <button type="button" onClick={() => { setAutoDistance(a => !a); if (autoDistance) setDistanceStatus('idle'); else lastPairRef.current=''; }} className={`px-2 py-1 rounded-md text-[10px] font-medium border transition ${autoDistance ? 'bg-brand-600 text-white border-brand-600' : 'bg-white/60 dark:bg-neutral-800 border-border text-foreground'}`}>{autoDistance ? 'Auto' : 'Manual'}</button>
                </div>
                <div className="min-h-[14px] pt-1 text-[10px] font-medium text-muted-foreground">
                  {autoDistance && distanceStatus === 'calculating' && <span className="animate-pulse">Calculating…</span>}
                  {autoDistance && distanceStatus === 'done' && <span className="text-emerald-600 dark:text-emerald-400">Auto-filled</span>}
                  {autoDistance && distanceStatus === 'error' && <span className="text-red-500">Lookup failed</span>}
                </div>
              </Field>
              <Field label="Vehicles" error={errors.vehicles?.message}><input type="number" step="1" {...register('vehicles', { valueAsNumber: true })} className={inputCls} /></Field>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Service Type" error={errors.serviceType?.message}>
                <select {...register('serviceType')} className={inputCls}>
                  {serviceTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </Field>
              {values.serviceType === 'vehicle-relocation' && (
                <Field label="Transport Mode" error={errors.transportMode?.message}>
                  <select {...register('transportMode')} className={inputCls}>
                    <option value="open">Open Transport</option>
                    <option value="enclosed">Enclosed Transport</option>
                  </select>
                </Field>
              )}
              <Field label="Speed" error={errors.speed?.message}>
                <select {...register('speed')} className={inputCls}>
                  <option value="standard">Standard</option>
                  <option value="expedited">Expedited</option>
                </select>
              </Field>
              <Field label="Notes (Optional)" error={errors.notes?.message}><input {...register('notes')} className={inputCls} /></Field>
            </div>
          </div>

          {values.serviceType === 'vehicle-relocation' && (
            <div className="surface p-6 rounded-xl space-y-3">
              <h2 className="text-sm font-medium tracking-tight flex items-center gap-2"><Gauge className="w-4 h-4 text-brand-600" /> Per-Mile Rate Tiers</h2>
              <div className="overflow-hidden rounded-md border border-border/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-600 text-white text-xs uppercase tracking-wide">
                      <th className="text-left px-4 py-3 font-semibold">Distance</th>
                      <th className="text-right px-4 py-3 font-semibold">Open</th>
                      <th className="text-right px-4 py-3 font-semibold">Enclosed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleTiers.map(t => (
                      <tr key={t.label} className="text-xs border-t border-border/60">
                        <td className="px-4 py-2 font-medium">{t.label}</td>
                        <td className="px-4 py-2 text-right">${t.open.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">${t.enclosed.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions & Save */}
          <div className="surface p-6 rounded-xl space-y-5">
            <h2 className="text-sm font-medium tracking-tight flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-600" /> Finalize & Persist</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button type="submit" disabled={isSubmitting || !estimate} className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">Save Quote</button>
              <button type="button" onClick={requestManualQuote} disabled={manualRequested || manualLoading} className="btn-outline w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {manualLoading ? 'Requesting…' : manualRequested ? 'Requested' : 'Manual Review'}
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">Saved quotes persist locally. Manual review sends a request to our API if contact details are present.</p>
          </div>

          {savedQuotes.length > 0 && (
            <div className="surface p-6 rounded-xl space-y-4">
              <h2 className="text-sm font-medium tracking-tight flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-600" /> Saved Quotes</h2>
              <div className="overflow-x-auto rounded-md border border-border/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs bg-accent/40 text-muted-foreground">
                      <th className="px-3 py-2 text-left font-medium">When</th>
                      <th className="px-3 py-2 text-left font-medium">Route</th>
                      <th className="px-3 py-2 text-left font-medium">Service</th>
                      <th className="px-3 py-2 text-right font-medium">Miles</th>
                      <th className="px-3 py-2 text-right font-medium">Total</th>
                      <th className="px-3 py-2 text-right font-medium">$/mi</th>
                      <th className="px-3 py-2 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedQuotes.map(q => (
                      <tr key={q.id} className="text-xs border-t border-border/60">
                        <td className="px-3 py-2 whitespace-nowrap">{new Date(q.ts).toLocaleDateString()}<span className="block text-[10px] text-muted-foreground">{new Date(q.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></td>
                        <td className="px-3 py-2">{q.pickupZip} → {q.dropoffZip}</td>
                        <td className="px-3 py-2 capitalize">{q.serviceType.replace('-', ' ')}{q.transportMode ? ` / ${q.transportMode}` : ''}</td>
                        <td className="px-3 py-2 text-right">{q.distanceMiles}</td>
                        <td className="px-3 py-2 text-right font-medium">${q.total.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">${q.perMile.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">
                          <button onClick={() => deleteSavedQuote(q.id)} className="text-[10px] px-2 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Modals */}
      {manualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setManualModal(null)} />
          <div className="relative w-full max-w-sm rounded-lg shadow-xl border border-white/10 bg-white/90 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-100 backdrop-blur p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            {manualModal === 'missing' && (<>
              <h3 className="text-lg font-semibold tracking-tight">Contact Details Required</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Please enter full name, email and phone so we can prepare an accurate manual quote.</p>
              <div className="flex justify-end gap-3 pt-2"><button onClick={() => setManualModal(null)} className="px-4 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent transition">Close</button></div>
            </>)}
            {manualModal === 'requested' && (<>
              <h3 className="text-lg font-semibold tracking-tight text-brand-600 dark:text-brand-400">Manual Review Requested</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Manual review requested – our team will follow up shortly.</p>
              <div className="flex justify-end gap-3 pt-2"><button onClick={() => setManualModal(null)} className="px-4 py-2 text-sm rounded-md bg-brand-600 hover:bg-brand-500 text-white font-medium transition">Got it</button></div>
            </>)}
          </div>
        </div>
      )}
      {saveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSaveModal(null)} />
          <div className="relative w-full max-w-sm rounded-lg shadow-xl border border-white/10 bg-white/90 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-100 backdrop-blur p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            {saveModal.type === 'missing-contact' && (<>
              <h3 className="text-lg font-semibold tracking-tight">Contact Required</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Please enter full name, email and phone so we can save this quote.</p>
              <div className="flex justify-end pt-2"><button onClick={() => setSaveModal(null)} className="px-4 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent transition">Close</button></div>
            </>)}
            {saveModal.type === 'error' && (<>
              <h3 className="text-lg font-semibold tracking-tight text-red-600 dark:text-red-400">Save Failed</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{saveModal.message}</p>
              <div className="flex justify-end pt-2 gap-2"><button onClick={() => setSaveModal(null)} className="px-4 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent transition">Dismiss</button></div>
            </>)}
            {saveModal.type === 'saved' && (<>
              <h3 className="text-lg font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">Quote Saved</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Your quote has been added to the Saved Quotes section.</p>
              <div className="flex justify-end pt-2 gap-2"><button onClick={() => setSaveModal(null)} className="px-4 py-2 text-sm rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition">Close</button></div>
            </>)}
          </div>
        </div>
      )}
    </main>
  );
}

/* --------------------------------- Subcomponents -------------------------------- */
const inputCls = "w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-[10px] font-medium text-red-500">{error}</p>}
    </div>
  );
}

