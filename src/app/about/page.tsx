export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        We exist to make vehicle relocation and specialized transport radically simpler, more transparent, and reliably on‑time. 
        What used to require phone tag, mystery pricing, and waiting hours for a quote now happens in seconds with clarity you can trust.
      </p>

      <section className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Our Mission</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Deliver frictionless, data‑guided transport coordination that feels modern, human, and obsessively dependable—whether you are moving one vehicle or coordinating a scaled program across states.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Our Vision</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            A logistics experience where instant insight replaces guesswork, automation removes repetitive follow‑ups, and every milestone is proactive—not reactive.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Core Values</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Clarity First</h3>
            <p className="mt-2 text-sm text-muted-foreground">Plain pricing, clear ETAs, no surprises—ever.</p>
          </li>
          <li className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Reliability</h3>
            <p className="mt-2 text-sm text-muted-foreground">Commitments matter. We engineer for consistency, not luck.</p>
          </li>
          <li className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Proactive Care</h3>
            <p className="mt-2 text-sm text-muted-foreground">We communicate before you have to ask. Silence is not status.</p>
          </li>
          <li className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Human Approach</h3>
            <p className="mt-2 text-sm text-muted-foreground">Technology accelerates us; it never replaces accountability.</p>
          </li>
          <li className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Continuous Improvement</h3>
            <p className="mt-2 text-sm text-muted-foreground">Every route, quote, and handoff is a learning loop.</p>
          </li>
          <li className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Integrity</h3>
            <p className="mt-2 text-sm text-muted-foreground">If something slips, we own it—and fix it fast.</p>
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">What Makes Us Different</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Instant, Honest Estimates</h3>
            <p className="mt-2 text-sm text-muted-foreground">Real inputs, tiered logic, and distance intelligence—not vague ranges.</p>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Distance Intelligence</h3>
            <p className="mt-2 text-sm text-muted-foreground">We calculate true driving routes with caching for speed & accuracy.</p>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Scalable for Programs</h3>
            <p className="mt-2 text-sm text-muted-foreground">Built to support recurring, multi‑location moves—not just one‑offs.</p>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Transparent Cost Model</h3>
            <p className="mt-2 text-sm text-muted-foreground">No hidden surcharges—each factor is explicit and explainable.</p>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Speed + Precision</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fast quoting without sacrificing operational realism.</p>
          </div>
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="font-medium">Customer-Led Roadmap</h3>
            <p className="mt-2 text-sm text-muted-foreground">We ship what reduces friction—not vanity features.</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Near-Term Goals</h2>
        <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">1.</span> Add real-time status tracking & milestone notifications.</li>
          <li><span className="font-medium text-foreground">2.</span> Expand optimization logic for multi-vehicle batching.</li>
          <li><span className="font-medium text-foreground">3.</span> Introduce secure customer dashboard with historical analytics.</li>
          <li><span className="font-medium text-foreground">4.</span> Publish reliability metrics with month-over-month transparency.</li>
          <li><span className="font-medium text-foreground">5.</span> Launch partner carrier quality scoring model.</li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Solution Pillars</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-medium text-lg">Vehicle Relocation Programs</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Structured offerings spanning individual unit moves, multi-site fleet rebalancing, protected enclosed transport, time-sensitive fastlane routing, specialty/exotic concierge handling, and nationwide coverage consistency.</p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li>• Individual Vehicle Transport</li>
              <li>• Fleet Shift & Rebalancing</li>
              <li>• Protected Enclosed Transport</li>
              <li>• Priority FastLane Moves</li>
              <li>• Specialty & Exotic Concierge</li>
              <li>• National Coverage Network</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-medium text-lg">Operator & Dispatch Enablement</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Support stack for independent operators and scaled fleets: always-on dispatch desk, live visibility suite, low-risk pilot onboarding, billing & settlement hub, performance & compliance scoring, and regulatory support.</p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li>• Operator Dispatch Desk</li>
              <li>• Live Visibility Suite</li>
              <li>• Zero-Risk Pilot Program</li>
              <li>• Billing & Settlement Hub</li>
              <li>• Performance & Compliance Scoring</li>
              <li>• Regulatory Support Suite</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Our Promise</h2>
        <p className="mt-4 text-muted-foreground max-w-3xl leading-relaxed">
          We treat every relocation—single unit or fleet—as a trust decision. You deserve accurate expectations, responsive updates, and professionals who sweat operational details so you do not have to. Excellence for us is not a slogan; it is a measurable standard we are willing to surface publicly.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Impact Metrics (Coming Soon)</h2>
        <p className="mt-4 text-sm text-muted-foreground">On-time delivery rate • Average response time • Route accuracy delta • Customer satisfaction index</p>
      </section>

      <section className="mt-20 rounded-xl border bg-gradient-to-br from-background to-muted p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Ready To Move With Confidence?</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Get an instant estimate in seconds—then let our team turn it into a seamless, proactive execution plan.</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href="/quote" className="inline-flex items-center rounded-md bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">Instant Estimate</a>
          <a href="/contact" className="inline-flex items-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-accent">Talk To Us</a>
        </div>
      </section>
    </main>
  );
}
