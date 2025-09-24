import { PageHeader } from '@/components/sections/PageHeader';
import { Target, ShieldCheck, RefreshCw, Users2, Activity, HeartHandshake, Rocket, Compass, Sparkles, Clock, BarChart3, Brain } from 'lucide-react';

const values = [
  { icon: Target, title: 'Clarity First', desc: 'Plain pricing, clear ETAs, no surprises—ever.' },
  { icon: ShieldCheck, title: 'Reliability', desc: 'Commitments matter. We engineer for consistency.' },
  { icon: HeartHandshake, title: 'Proactive Care', desc: 'We communicate before you need to ask.' },
  { icon: Users2, title: 'Human Approach', desc: 'Tech accelerates; accountability stays human.' },
  { icon: RefreshCw, title: 'Continuous Improvement', desc: 'Every move feeds the improvement loop.' },
  { icon: Activity, title: 'Integrity', desc: 'If something slips, we own it—and fix it fast.' }
];

const differentiators = [
  { icon: Rocket, title: 'Instant, Honest Estimates', desc: 'Tiered logic & real routing—not vague ranges.' },
  { icon: Compass, title: 'Distance Intelligence', desc: 'True driving routes with cached geo lookups.' },
  { icon: Sparkles, title: 'Program Scalability', desc: 'Supports recurring + multi-location logistics.' },
  { icon: Brain, title: 'Transparent Cost Model', desc: 'No hidden surcharges. Clear input factors.' },
  { icon: Clock, title: 'Speed + Precision', desc: 'Fast quoting + operational realism combined.' },
  { icon: BarChart3, title: 'Customer-Led Roadmap', desc: 'We ship what reduces friction—not vanity.' }
];

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-6xl px-6 py-20">
      <PageHeader
        eyebrow="About Us"
        title="Logistics Execution Built For Reliability"
        description={<>
          We make vehicle relocation and specialized transport radically simpler, transparent, and reliably on‑time. What used to require phone tag and waiting hours for a quote now happens in seconds—with clarity you can trust.
        </>}
        align="left"
      />

      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-2xl tracking-tight flex items-center gap-2"><Target className="w-5 h-5 text-brand-600" /> Mission</h2>
          <p className="text-muted-foreground leading-relaxed">Deliver frictionless, data‑guided transport coordination that feels modern, human, and obsessively dependable—whether moving a single unit or scaling multi-state programs.</p>
        </div>
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-2xl tracking-tight flex items-center gap-2"><Compass className="w-5 h-5 text-brand-600" /> Vision</h2>
          <p className="text-muted-foreground leading-relaxed">A logistics experience where instant insight replaces guesswork, automation reduces noise, and every milestone is proactive—not reactive.</p>
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-heading font-semibold text-2xl tracking-tight">Core Values</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(v => (
            <li key={v.title} className="surface p-5 flex flex-col gap-3 relative overflow-hidden">
              <span className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-brand-600/5 blur-xl" />
              <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-600/20 w-max"><v.icon className="w-5 h-5" /></span>
              <h3 className="font-medium tracking-tight">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24">
        <h2 className="font-heading font-semibold text-2xl tracking-tight">What Makes Us Different</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map(d => (
            <div key={d.title} className="surface p-5 flex flex-col gap-3 relative overflow-hidden">
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-brand-600/5 to-transparent" />
              <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-600/20 w-max"><d.icon className="w-5 h-5" /></span>
              <h3 className="font-medium tracking-tight">{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-heading font-semibold text-2xl tracking-tight">Near-Term Goals</h2>
        <ul className="mt-6 space-y-4 text-sm text-muted-foreground max-w-2xl">
          <li><span className="font-medium text-foreground">1.</span> Real-time milestone tracking & notifications.</li>
          <li><span className="font-medium text-foreground">2.</span> Expanded optimization for multi-vehicle batching.</li>
          <li><span className="font-medium text-foreground">3.</span> Secure customer dashboard with historical analytics.</li>
          <li><span className="font-medium text-foreground">4.</span> Published reliability metrics (rolling transparency).</li>
          <li><span className="font-medium text-foreground">5.</span> Carrier quality scoring & continuous improvement loop.</li>
        </ul>
      </section>

      <section className="mt-24 grid gap-10 md:grid-cols-2">
        <div className="surface p-6 rounded-xl">
          <h3 className="font-heading font-semibold text-lg tracking-tight">Vehicle Relocation Programs</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Offerings spanning individual unit moves, fleet rebalancing, enclosed protection, fastlane priority, exotic concierge handling, and nationwide coverage consistency.</p>
          <ul className="mt-4 grid text-[11px] gap-1 text-muted-foreground">
            {['Individual Transport','Fleet Rebalancing','Enclosed Protection','Priority FastLane','Exotic Concierge','National Coverage'].map(i => <li key={i}>• {i}</li>)}
          </ul>
        </div>
        <div className="surface p-6 rounded-xl">
          <h3 className="font-heading font-semibold text-lg tracking-tight">Operator & Dispatch Enablement</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Support stack: always-on dispatch desk, live visibility suite, risk-free pilot onboarding, billing & settlement hub, performance scoring, and regulatory assistance.</p>
          <ul className="mt-4 grid text-[11px] gap-1 text-muted-foreground">
            {['Dispatch Desk','Visibility Suite','Pilot Program','Billing Hub','Performance Scoring','Regulatory Support'].map(i => <li key={i}>• {i}</li>)}
          </ul>
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-heading font-semibold text-2xl tracking-tight">Our Promise</h2>
        <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">Every relocation—single unit or fleet—is a trust decision. You deserve accurate expectations, proactive updates, and operators who sweat operational detail so you don’t have to. Excellence isn’t a slogan; it’s a measurable standard we surface.</p>
      </section>

      <section className="mt-24">
        <h2 className="font-heading font-semibold text-2xl tracking-tight">Impact Metrics (Coming Soon)</h2>
        <p className="mt-4 text-sm text-muted-foreground">On-time delivery rate • Avg response time • Route accuracy delta • Customer satisfaction index</p>
      </section>

      <section className="mt-28 surface-elevated text-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(42,137,255,0.15),transparent_70%)]" />
        <h2 className="font-heading font-semibold text-2xl md:text-3xl tracking-tight">Ready To Move With Confidence?</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">Get an instant estimate—then let our team turn it into proactive execution.</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href="/quote" className="btn-primary px-6">Instant Estimate</a>
          <a href="/contact" className="btn-outline">Talk To Us</a>
        </div>
      </section>
    </main>
  );
}
