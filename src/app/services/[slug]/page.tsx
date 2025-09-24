import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { services } from '@/lib/data';
import { Icons } from './service-icons';
import Link from 'next/link';

interface Params { slug: string }

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const svc = services.find(s => s.slug === slug);
  if (!svc) return { title: 'Service Not Found' };
  return { title: `${svc.title} | Services`, description: svc.summary };
}

export default async function ServiceDetail({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const svc = services.find(s => s.slug === slug);
  if (!svc) notFound();
  const IconComp = svc.icon && Icons[svc.icon as keyof typeof Icons];
  return (
    <main className="container mx-auto max-w-6xl px-6 pt-10 pb-24 md:py-16">
      <nav className="text-xs mb-8 flex items-center gap-2 text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-brand-600 transition-colors">Services</Link>
        <span>/</span>
        <span className="text-neutral-700 dark:text-neutral-300">{svc.title}</span>
      </nav>

      <header className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
        <div className="flex items-center gap-4">
          {IconComp && <span className="inline-flex p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20"><IconComp className="w-8 h-8" /></span>}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold tracking-tight font-heading">{svc.title}</h1>
              {svc.tier && (
                <span className={`text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full ring-1 ring-inset ${svc.tier === 'premium' ? 'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30' : 'bg-neutral-100 text-neutral-700 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-600'}`}>
                  {svc.tier.toUpperCase()}
                </span>
              )}
            </div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed text-base">{svc.description || svc.summary}</p>
            {svc.outcomes && (
              <div className="mt-5 flex flex-wrap gap-2">
                {svc.outcomes.slice(0,3).map(o => (
                  <span key={o} className="text-[10px] uppercase tracking-wide font-medium px-2 py-1 rounded-md bg-brand-500/5 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20">
                    {o}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

  <div className="mt-12 md:mt-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-14">
          <section>
            <h2 className="text-lg font-semibold mb-5 font-heading tracking-tight">Core Capabilities</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {svc.features.map(f => (
                <div key={f} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950/40 shadow-soft">
                  <p className="text-sm font-medium leading-snug">{f}</p>
                </div>
              ))}
            </div>
          </section>

            {svc.useCases && (
              <section>
                <h2 className="text-lg font-semibold mb-4 font-heading tracking-tight">Ideal Use Cases</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {svc.useCases.map(u => (
                    <li key={u} className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/40 text-sm font-medium leading-snug">
                      {u}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {svc.differentiators && (
              <section>
                <h2 className="text-lg font-semibold mb-4 font-heading tracking-tight">What Sets It Apart</h2>
                <div className="space-y-3">
                  {svc.differentiators.map(d => (
                    <div key={d} className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/40 text-sm leading-relaxed">
                      {d}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {svc.kpis && (
              <section>
                <h2 className="text-lg font-semibold mb-4 font-heading tracking-tight">Focus KPIs</h2>
                <div className="flex flex-wrap gap-2">
                  {svc.kpis.map(k => (
                    <span key={k} className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-medium tracking-wide text-neutral-700 dark:text-neutral-300">
                      {k}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {svc.slaNotes && (
              <section>
                <h2 className="text-lg font-semibold mb-3 font-heading tracking-tight">Service Level Notes</h2>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-2xl">
                  {svc.slaNotes}
                </p>
              </section>
            )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 h-max">
          <div className="surface p-6">
            <h3 className="font-heading font-semibold tracking-tight text-base mb-2">Engage This Service</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">Outline scope, timelines, and integration considerations with our team. We calibrate expectations early.</p>
            <div className="flex flex-col gap-3">
              <Link href="/quote" className="w-full inline-flex justify-center items-center h-10 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors focus-ring">
                {svc.ctaLabel || 'Request a Quote'}
              </Link>
              <Link href="/contact" className="w-full inline-flex justify-center items-center h-10 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus-ring">
                Talk to Us
              </Link>
            </div>
          </div>
          {svc.idealCustomers && (
            <div className="surface p-6">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-4">Ideal Profiles</h4>
              <ul className="space-y-2 text-sm">
                {svc.idealCustomers.map(c => (
                  <li key={c} className="flex gap-2 items-start">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
      {/* Mobile Sticky Bar */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 dark:bg-neutral-950/80 border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-3">
          <Link href="/quote" className="flex-1 inline-flex justify-center items-center h-11 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition">
            {svc.ctaLabel || 'Get Quote'}
          </Link>
          <Link href="/contact" className="inline-flex justify-center items-center h-11 px-4 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
            Talk
          </Link>
        </div>
      </div>
    </main>
  );
}
