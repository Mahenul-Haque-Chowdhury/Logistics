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
    <main className="container mx-auto max-w-5xl px-6 py-16">
      <nav className="text-xs mb-8 flex items-center gap-2 text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-brand-600 transition-colors">Services</Link>
        <span>/</span>
        <span className="text-neutral-700 dark:text-neutral-300">{svc.title}</span>
      </nav>
      <div className="flex items-start gap-4">
        {IconComp && <IconComp className="w-10 h-10 text-brand-600" />}
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-heading">{svc.title}</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">{svc.description || svc.summary}</p>
        </div>
      </div>
      <section className="mt-10 grid md:grid-cols-3 gap-6">
        {svc.features.map(f => (
          <div key={f} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950/40 shadow-soft">
            <p className="text-sm font-medium">{f}</p>
          </div>
        ))}
      </section>
      <div className="mt-12">
        <a href="/quote" className="btn-primary">Request a Quote</a>
      </div>
    </main>
  );
}
