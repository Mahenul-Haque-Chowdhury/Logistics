import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 dark:border-neutral-800/70 mt-28 text-sm">
      <div className="container py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="font-heading text-xl font-semibold">
            <span className="text-brand-600">Logi</span>Site
          </Link>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-sm text-sm leading-relaxed">US-based logistics partner specializing in last-mile delivery, dispatch operations, and vehicle relocation with real-time visibility.</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">Headquarters: 1234 Logistics Parkway, Dallas, TX 75201 USA</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold uppercase tracking-wide text-xs">Company</h3>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li><Link href="/about" className="hover:text-brand-600">About</Link></li>
            <li><Link href="/terms" className="hover:text-brand-600">Terms of Use</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-600">Privacy Notice</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold uppercase tracking-wide text-xs">Services</h3>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li>Last-Mile Delivery</li>
            <li>Dispatch Operations</li>
            <li>Vehicle Relocation</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold uppercase tracking-wide text-xs">Support</h3>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li><Link href="/contact" className="hover:text-brand-600">Contact</Link></li>
            <li><Link href="/track" className="hover:text-brand-600">Track Shipment</Link></li>
            <li><Link href="/quote" className="hover:text-brand-600">Request Quote</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} LogiSite. All rights reserved. Made for the US market.
      </div>
    </footer>
  );
}
