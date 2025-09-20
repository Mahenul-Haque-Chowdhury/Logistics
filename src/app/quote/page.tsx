"use client";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";

// New service types aligned with site
const serviceTypes = [
  { value: 'last-mile', label: 'Last-Mile Delivery' },
  { value: 'dispatch', label: 'Dispatch Operations' },
  { value: 'vehicle-relocation', label: 'Vehicle Relocation' }
];

// Tiered pricing for vehicle relocation (open/enclosed)
const vehicleTiers = [
  { min: 0,   max: 600,  open: 1.60, enclosed: 2.09, label: '1-600 miles' },
  { min: 601, max: 1100, open: 0.85, enclosed: 1.20, label: '601-1100 miles' },
  { min: 1101, max: Infinity, open: 0.70, enclosed: 1.10, label: '1100+ miles' }
];

// Split minimal pricing fields vs contact fields; contact optional for instant estimate
const schema = z.object({
  fullName: z.string().min(2,'Too short').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9+()\-\s]{7,20}$/,'Invalid phone').optional().or(z.literal('')),
  pickupZip: z.string().regex(/^\d{5}$/,'5-digit ZIP'),
  dropoffZip: z.string().regex(/^\d{5}$/,'5-digit ZIP'),
  vehicles: z.coerce.number().int().positive().max(200),
  distanceMiles: z.coerce.number().positive().max(4000),
  serviceType: z.enum(['last-mile','dispatch','vehicle-relocation']),
  transportMode: z.enum(['open','enclosed']).optional(),
  speed: z.enum(['standard','expedited']),
  notes: z.string().max(400).optional().or(z.literal(''))
}).refine(d => d.serviceType !== 'vehicle-relocation' || !!d.transportMode, { message: 'Select transport mode', path: ['transportMode'] });

type FormValues = z.infer<typeof schema>;

function baseRate(service: FormValues['serviceType'], distance: number, transportMode?: string) {
  if (service === 'vehicle-relocation') {
    const tier = vehicleTiers.find(t => distance >= t.min && distance <= t.max) || vehicleTiers[vehicleTiers.length - 1];
    return transportMode === 'enclosed' ? tier.enclosed : tier.open;
  }
  switch(service) {
    case 'last-mile': return 2.2;
    case 'dispatch': return 1.4;
    default: return 2.5;
  }
}

export default function QuotePage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { serviceType: 'last-mile', speed: 'standard', vehicles: 1, distanceMiles: 100, transportMode: 'open' }
  });

  const values = watch();
  // removed unused submittedRef state (was previously reference id)
  const [autoDistance, setAutoDistance] = useState(true);
  const [distanceStatus, setDistanceStatus] = useState<'idle'|'calculating'|'error'|'done'>('idle');
  const [manualRequested, setManualRequested] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualModal, setManualModal] = useState<null | 'missing' | 'requested'>(null);
  const [saveModal, setSaveModal] = useState<null | { type: 'missing-contact' } | { type: 'error'; message: string } | { type: 'saved' }>(null);
  const lastPairRef = useRef<string>('');
  const memCache = useRef<Record<string, number>>({});
  interface SavedQuoteEntry {
    id: string;
    ts: number;
    pickupZip: string;
    dropoffZip: string;
    serviceType: FormValues['serviceType'];
    transportMode?: FormValues['transportMode'];
    speed: FormValues['speed'];
    vehicles: number;
    distanceMiles: number;
    total: number;
    perMile: number;
    offline?: boolean;
  }
  const [savedQuotes, setSavedQuotes] = useState<SavedQuoteEntry[]>([]);

  // Load saved quotes on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('savedQuotesV1') : null;
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedQuotes(parsed as SavedQuoteEntry[]);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  function persistQuotes(next: SavedQuoteEntry[]) {
    setSavedQuotes(next);
    try { if (typeof window !== 'undefined') localStorage.setItem('savedQuotesV1', JSON.stringify(next.slice(0,50))); } catch {}
  }

  function addSavedQuote(entry: SavedQuoteEntry) {
    const next = [entry, ...savedQuotes].slice(0,50);
    persistQuotes(next);
  }

  function deleteSavedQuote(id: string) {
    const next = savedQuotes.filter(q => q.id !== id);
    persistQuotes(next);
  }

  // Manual quote request action
  async function requestManualQuote() {
    if (!values.email || !values.fullName || !values.phone) {
      setManualModal('missing');
      return;
    }
    if (manualRequested || manualLoading) return;
    try {
      setManualLoading(true);
      const payload = { ...values, estimate, manualReview: true };
      await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setManualRequested(true);
      setManualModal('requested');
    } catch {
      setManualModal('missing'); // fallback to show user something
    } finally {
      setManualLoading(false);
    }
  }

  // Auto distance calculation using ZIP -> lat/lon (Zippopotam.us) + OSRM route for real driving distance
  const pickupZip = values.pickupZip;
  const dropoffZip = values.dropoffZip;
  useEffect(() => {
    const isFive = (z: string) => /^\d{5}$/.test(z || '');
    const pairKey = pickupZip + '-' + dropoffZip;
    if (!autoDistance || !isFive(pickupZip) || !isFive(dropoffZip)) {
      setDistanceStatus('idle');
      return;
    }
    if (lastPairRef.current === pairKey) return; // already calculated this session

    // Check caches (memory then localStorage)
    if (memCache.current[pairKey]) {
      setValue('distanceMiles', memCache.current[pairKey], { shouldDirty: true, shouldValidate: true });
      setDistanceStatus('done');
      lastPairRef.current = pairKey;
      return;
    }
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('zipDistanceCache') : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed[pairKey] === 'number') {
          memCache.current[pairKey] = parsed[pairKey];
          setValue('distanceMiles', parsed[pairKey], { shouldDirty: true, shouldValidate: true });
          setDistanceStatus('done');
          lastPairRef.current = pairKey;
          return;
        }
      }
    } catch {}
    let cancelled = false;
    setDistanceStatus('calculating');
    const controller = new AbortController();

    async function fetchZip(z: string): Promise<{ lat: number; lon: number }> {
      const res = await fetch(`https://api.zippopotam.us/us/${z}`, { signal: controller.signal });
      if (!res.ok) throw new Error('zip fetch fail');
      const data = await res.json();
      const place = data.places?.[0];
      return { lat: parseFloat(place.latitude), lon: parseFloat(place.longitude) };
    }

    (async () => {
      try {
        const [a, b] = await Promise.all([fetchZip(pickupZip), fetchZip(dropoffZip)]);
        if (cancelled) return;
        // Request route from OSRM (public demo server) using lon,lat; fallback to great-circle if fails
        let miles: number | null = null;
        try {
          const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`, { signal: controller.signal });
          if (routeRes.ok) {
            const routeJson: { routes?: Array<{ distance?: number }> } = await routeRes.json();
            const distMeters = routeJson.routes?.[0]?.distance;
            if (typeof distMeters === 'number') miles = Math.max(1, Math.round(distMeters / 1609.344));
          }
        } catch {
          // ignore route failure, fallback below
        }
        if (miles == null) {
          // fallback great-circle
          const R = 3958.8; const toRad = (d: number) => d * Math.PI / 180;
          const dLat = toRad(b.lat - a.lat); const dLon = toRad(b.lon - a.lon); const lat1 = toRad(a.lat); const lat2 = toRad(b.lat);
          const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2; const greatCircle = 2 * R * Math.asin(Math.sqrt(h));
          miles = Math.max(1, Math.round(greatCircle * 1.15));
        }
        setValue('distanceMiles', miles, { shouldDirty: true, shouldValidate: true });
        lastPairRef.current = pairKey; setDistanceStatus('done');
        memCache.current[pairKey] = miles;
        try {
          const existing = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('zipDistanceCache')||'{}') : {};
          existing[pairKey] = miles;
          if (typeof window !== 'undefined') localStorage.setItem('zipDistanceCache', JSON.stringify(existing));
        } catch {}
      } catch {
        if (!cancelled) setDistanceStatus('error');
      }
    })();
    return () => { cancelled = true; controller.abort(); };
  }, [pickupZip, dropoffZip, autoDistance, setValue]);

  // Instant estimate calculation
  const estimate = useMemo(() => {
    try {
      const parsed = schema.safeParse({ ...values, vehicles: Number(values.vehicles), distanceMiles: Number(values.distanceMiles) });
      if(!parsed.success) return null;
      const v = parsed.data;
      const tierRate = baseRate(v.serviceType, v.distanceMiles, v.transportMode);
      const speedMultiplier = v.speed === 'expedited' ? 1.25 : 1; // tuned
      const vehicleFactor = 1 + (v.vehicles - 1) * 0.55;
      const appliedPerMile = tierRate * speedMultiplier * vehicleFactor;
      const raw = v.distanceMiles * appliedPerMile;
      const fuelSurcharge = raw * 0.09; // 9% placeholder
      const total = raw + fuelSurcharge;
      return {
        subtotal: raw,
        fuelSurcharge,
        total,
        perMile: total / v.distanceMiles,
        tierRate,
        appliedPerMile,
        vehicleFactor,
        speedMultiplier
      };
    } catch { return null; }
  }, [values]);

  async function onSubmit(form: FormValues) {
    // Enforce contact info at submit time only
    if (!form.email || !form.fullName || !form.phone) {
      setSaveModal({ type: 'missing-contact' });
      return;
    }
    // Map to legacy API schema (while backend still expects name/origin/destination/weightKg/mode)
    const legacyPayload = {
  name: form.fullName,
      email: form.email,
      origin: form.pickupZip,
      destination: form.dropoffZip,
      // Approximate weightKg from vehicles & distance as placeholder until backend updated
      weightKg: Math.max(1, Math.round(form.vehicles * 600)),
      mode: form.serviceType === 'vehicle-relocation' ? 'road' : 'road',
      notes: form.notes || undefined
    };
  // payload variable removed (unused previously)
    try {
      const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(legacyPayload) });
  let json: { ok?: boolean; error?: string } | null = null;
  try { json = await res.json(); } catch { json = { error: 'Malformed response' }; }
      if (res.ok && json?.ok) {
        if (estimate) {
          addSavedQuote({
            id: crypto.randomUUID(),
            ts: Date.now(),
            pickupZip: form.pickupZip,
            dropoffZip: form.dropoffZip,
            serviceType: form.serviceType,
            transportMode: form.transportMode,
            speed: form.speed,
            vehicles: form.vehicles,
            distanceMiles: form.distanceMiles,
            total: estimate.total,
            perMile: estimate.perMile
          });
        }
        setSaveModal({ type: 'saved' });
        reset({ ...form, notes: '' });
      } else {
        const msg = json?.error || `HTTP ${res.status}`;
        setSaveModal({ type: 'error', message: msg });
      }
    } catch {
      // Fallback: treat as locally saved (offline scenario) to avoid user losing data
      if (estimate) {
        addSavedQuote({
          id: crypto.randomUUID(),
          ts: Date.now(),
          pickupZip: form.pickupZip,
          dropoffZip: form.dropoffZip,
          serviceType: form.serviceType,
          transportMode: form.transportMode,
          speed: form.speed,
          vehicles: form.vehicles,
          distanceMiles: form.distanceMiles,
          total: estimate.total,
          perMile: estimate.perMile,
          offline: true
        });
        setSaveModal({ type: 'saved' });
      } else {
        setSaveModal({ type: 'error', message: 'Network error saving quote' });
      }
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-start md:items-center justify-center py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-neutral-50 dark:bg-neutral-950 transition-colors">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-20 dark:opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-200/60 via-neutral-100/70 to-neutral-50 dark:from-neutral-900/60 dark:via-neutral-950/80 dark:to-neutral-950 transition-colors" />
      </div>
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="backdrop-blur-sm bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-lg p-8 md:p-10 text-neutral-800 dark:text-neutral-100 transition-colors">
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
            <div className="md:w-64 space-y-4">
              <h1 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight">Instant Estimate with Zip Code</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">Get a real-time ballpark logistics estimate. Exact pricing may vary after operations review.</p>
              <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 pt-1">
                <li><span className="text-neutral-700 dark:text-neutral-200">Scope:</span> Lower 48 States</li>
                <li><span className="text-neutral-700 dark:text-neutral-200">Speed:</span> Standard or Expedited</li>
                <li><span className="text-neutral-700 dark:text-neutral-200">Update:</span> Adjust any field to recalc</li>
              </ul>
              {estimate && (
                <div className="mt-4 rounded-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 space-y-2 text-xs transition-colors">
                  {values.serviceType === 'vehicle-relocation' && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-neutral-600 dark:text-neutral-400">
                      <span>Tier Rate</span><span className="text-right font-medium text-neutral-700 dark:text-neutral-300">${estimate.tierRate.toFixed(2)}/mi</span>
                      <span>Speed Multiplier</span><span className="text-right">{estimate.speedMultiplier.toFixed(2)}x</span>
                      <span>Vehicle Factor</span><span className="text-right">{estimate.vehicleFactor.toFixed(2)}x</span>
                      <span>Adj Per-Mile</span><span className="text-right font-medium">${estimate.appliedPerMile.toFixed(2)}/mi</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1"><span className="text-neutral-500 dark:text-neutral-300">Subtotal</span><span>${estimate.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500 dark:text-neutral-300">Fuel (9%)</span><span>${estimate.fuelSurcharge.toFixed(2)}</span></div>
                  <div className="h-px bg-black/10 dark:bg-white/10" />
                  <div className="flex justify-between font-medium text-neutral-900 dark:text-neutral-100"><span>Total</span><span>${estimate.total.toFixed(2)}</span></div>
                  <div className="text-neutral-600 dark:text-neutral-400 pt-1">≈ ${estimate.perMile.toFixed(2)} / mile</div>
                  {/* Reference hidden per new requirement */}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-8">
              <div className="grid md:grid-cols-3 gap-5">
                <Field label="Full Name" error={errors.fullName?.message}>
                  <input {...register('fullName')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input type="email" {...register('email')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input type="tel" {...register('phone')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
              </div>
              <div className="grid md:grid-cols-4 gap-5">
                <Field label="Pickup ZIP" error={errors.pickupZip?.message}>
                  <input {...register('pickupZip')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
                <Field label="Dropoff ZIP" error={errors.dropoffZip?.message}>
                  <input {...register('dropoffZip')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
                <Field label="Distance (mi)" error={errors.distanceMiles?.message}>
                  <div className="flex gap-2 items-start">
                    <input type="number" step="1" {...register('distanceMiles', { valueAsNumber: true })} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                    <button type="button" onClick={() => { setAutoDistance(a => !a); if (autoDistance) { setDistanceStatus('idle'); } else { lastPairRef.current=''; } }} className={`px-2 py-1 rounded-md text-[10px] font-medium border transition ${autoDistance ? 'bg-brand-600 text-white border-brand-600' : 'bg-white/60 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200'}`}>{autoDistance ? 'Auto' : 'Manual'}</button>
                  </div>
                  <div className="min-h-[14px] pt-1 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                    {autoDistance && distanceStatus === 'calculating' && <span className="animate-pulse">Calculating…</span>}
                    {autoDistance && distanceStatus === 'done' && <span className="text-emerald-600 dark:text-emerald-400">Auto-filled</span>}
                    {autoDistance && distanceStatus === 'error' && <span className="text-red-500">Lookup failed</span>}
                  </div>
                </Field>
                <Field label="Vehicles" error={errors.vehicles?.message}>
                  <input type="number" step="1" {...register('vehicles', { valueAsNumber: true })} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <Field label="Service Type" error={errors.serviceType?.message}>
                  <select {...register('serviceType')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
                    {serviceTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
                {values.serviceType === 'vehicle-relocation' && (
                  <Field label="Transport Mode" error={errors.transportMode?.message}>
                    <select {...register('transportMode')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
                      <option value="open">Open Transport</option>
                      <option value="enclosed">Enclosed Transport</option>
                    </select>
                  </Field>
                )}
                <Field label="Speed" error={errors.speed?.message}>
                  <select {...register('speed')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
                    <option value="standard">Standard</option>
                    <option value="expedited">Expedited</option>
                  </select>
                </Field>
                <Field label="Notes (Optional)" error={errors.notes?.message}>
                  <input {...register('notes')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" />
                </Field>
              </div>
              {values.serviceType === 'vehicle-relocation' && (
                <div className="space-y-3">
                  <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-200 tracking-wide uppercase">Per-Mile Rate Tiers</h2>
                  <div className="overflow-hidden rounded-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/30">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs uppercase tracking-wide">
                          <th className="text-left px-4 py-3 font-semibold">Distance</th>
                          <th className="text-right px-4 py-3 font-semibold">Open</th>
                          <th className="text-right px-4 py-3 font-semibold">Enclosed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleTiers.map(t => {
                          const active = values.distanceMiles >= t.min && values.distanceMiles <= t.max;
                          return (
                            <tr key={t.label} className={"border-t border-black/5 dark:border-white/5 transition-colors " + (active ? 'bg-brand-50 dark:bg-brand-500/10 ring-1 ring-inset ring-brand-500' : '')}>
                              <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200">{t.label}</td>
                              <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-200">${t.open.toFixed(2)}/mile</td>
                              <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-200">${t.enclosed.toFixed(2)}/mile</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">Base tier rate adjusted by speed & multi-vehicle factors. Fuel surcharge added afterward.</p>
                </div>
              )}
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button disabled={isSubmitting} className="btn-primary w-full sm:w-auto justify-center h-11 px-6 text-sm font-medium">{isSubmitting ? 'Submitting...' : 'Save Quote'}</button>
                  <button
                    type="button"
                    onClick={requestManualQuote}
                    disabled={manualRequested || manualLoading}
                    className="w-full sm:w-auto h-11 px-4 sm:px-6 rounded-md border border-brand-600 text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-600/10 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
                  >{manualLoading ? 'Requesting...' : manualRequested ? 'Requested' : 'Manual Review Quote'}</button>
                </div>
                {manualRequested && (
                  <div className="text-xs sm:text-sm text-brand-600 dark:text-brand-400">
                    Manual review requested – our team will follow up.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-neutral-700 dark:text-neutral-300 mb-3">Saved Quotes</h2>
          {savedQuotes.length === 0 ? (
            <div className="rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 text-center text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              No saved quotes yet. Generate an estimate and click &quot;Save Quote&quot; to keep it here.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Route</th>
                    <th className="text-left font-medium px-3 py-2">Service</th>
                    <th className="text-right font-medium px-3 py-2">Vehicles</th>
                    <th className="text-right font-medium px-3 py-2">Miles</th>
                    <th className="text-right font-medium px-3 py-2">Total</th>
                    <th className="text-right font-medium px-3 py-2">$/mi</th>
                    <th className="text-right font-medium px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedQuotes.map(q => (
                    <tr key={q.id} className="border-t border-black/5 dark:border-white/5 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="px-3 py-2">{q.pickupZip} → {q.dropoffZip}</td>
                      <td className="px-3 py-2 capitalize">{q.serviceType.replace(/-/g,' ')}{q.transportMode ? ' ('+q.transportMode+')' : ''}</td>
                      <td className="px-3 py-2 text-right">{q.vehicles}</td>
                      <td className="px-3 py-2 text-right">{q.distanceMiles}</td>
                      <td className="px-3 py-2 text-right">${q.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">${q.perMile.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => deleteSavedQuote(q.id)} className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {manualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setManualModal(null)} />
          <div className="relative w-full max-w-sm rounded-lg shadow-xl border border-white/10 bg-white/90 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-100 backdrop-blur p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            {manualModal === 'missing' && (
              <>
                <h3 className="text-lg font-semibold tracking-tight">Contact Details Required</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Please enter full name, email and phone so we can prepare an accurate manual quote.</p>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setManualModal(null)} className="px-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">Close</button>
                </div>
              </>
            )}
            {manualModal === 'requested' && (
              <>
                <h3 className="text-lg font-semibold tracking-tight text-brand-600 dark:text-brand-400">Manual Review Requested</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Manual review requested – our team will follow up as soon as possible.</p>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setManualModal(null)} className="px-4 py-2 text-sm rounded-md bg-brand-600 hover:bg-brand-500 text-white font-medium transition">Got it</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {saveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSaveModal(null)} />
          <div className="relative w-full max-w-sm rounded-lg shadow-xl border border-white/10 bg-white/90 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-100 backdrop-blur p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            {saveModal.type === 'missing-contact' && (
              <>
                <h3 className="text-lg font-semibold tracking-tight">Contact Required</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Please enter full name, email and phone so we can save this quote.</p>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setSaveModal(null)} className="px-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">Close</button>
                </div>
              </>
            )}
            {saveModal.type === 'error' && (
              <>
                <h3 className="text-lg font-semibold tracking-tight text-red-600 dark:text-red-400">Save Failed</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{saveModal.message}</p>
                <div className="flex justify-end pt-2 gap-2">
                  <button onClick={() => setSaveModal(null)} className="px-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">Dismiss</button>
                </div>
              </>
            )}
            {saveModal.type === 'saved' && (
              <>
                <h3 className="text-lg font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">Quote Saved</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Your quote has been added to the Saved Quotes section below.</p>
                <div className="flex justify-end pt-2 gap-2">
                  <button onClick={() => setSaveModal(null)} className="px-4 py-2 text-sm rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// removed standalone placeholder; in-component function now handles manual requests

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wide font-medium text-neutral-300">{label}</label>
      {children}
      {error && <p className="text-[10px] font-medium text-red-400">{error}</p>}
    </div>
  );
}

