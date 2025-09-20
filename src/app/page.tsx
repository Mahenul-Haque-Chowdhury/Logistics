import { AnimatedHero } from "@/components/sections/AnimatedHero";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <AnimatedHero />

      {/* Services Preview */}
      <section className="container max-w-6xl py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What We Deliver</h2>
            <p className="text-muted-foreground">Integrated multimodal solutions tailored for modern supply chains.</p>
          </div>
          <Link href="/services" className="inline-flex items-center text-sm font-medium text-brand-600 hover:underline">All Services →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Last-Mile Delivery', desc: 'Fast, trackable final-mile distribution network.' },
            { title: 'Dispatch Operations', desc: '24/7 coordination optimizing routes & utilization.' },
            { title: 'Vehicle Relocation', desc: 'Multi-state fleet & vehicle repositioning services.' }
          ].map(card => (
            <div key={card.title} className="card" data-animate="fade-in">
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-200/70 dark:border-neutral-800/70">
        <div className="container max-w-6xl py-20 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Industries Served</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {['E-commerce','Automotive','Pharmaceuticals','Retail','Manufacturing','Food & Beverage'].map(ind => (
              <div key={ind} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950/40">
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="container max-w-6xl py-24 md:py-28">
        <h2 className="text-3xl font-bold tracking-tight mb-12">Trusted by Supply Chain Leaders</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="card" data-animate="fade-in">
              <p className="text-sm italic">“Outstanding reliability and visibility across our regional distribution.”</p>
              <div className="mt-4 text-xs font-medium text-neutral-500">Operations Manager • Client {i}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 -z-10" />
        <div className="container max-w-5xl text-center text-white space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to streamline your logistics?</h2>
          <p className="text-white/80 max-w-2xl mx-auto">Get a tailored solution proposal in less than 24 hours. Our team is ready.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote" className="inline-flex items-center justify-center rounded-md bg-white text-brand-700 font-medium px-6 py-3 text-sm hover:bg-neutral-100 transition">Request a Quote</a>
            <a href="/contact" className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-medium hover:bg-white/10 transition">Talk to an Expert</a>
          </div>
        </div>
      </section>
    </>
  );
}
