"use client";
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * PageTransition wraps routed page content providing:
 * - Smooth fade/slide between route changes
 * - Top loading bar (lightweight implementation) while route is changing
 * - Reduced motion support respecting user preference
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // routing flag removed (unused) – visibility & progress suffice
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReducedMotion(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Simulate a lightweight progress bar that always reaches 100%
  useEffect(() => {
    setVisible(true);
    setProgress(0);
    let raf: number;
    let start: number | null = null;
    const DURATION = 650; // ms to reach 100
    function step(ts: number) {
      if (start == null) start = ts;
      const elapsed = ts - start;
      // Ease-out cubic for smoother finish
      const t = Math.min(1, elapsed / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = eased * 100;
      setProgress(pct);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        // Hold briefly then fade out
        setTimeout(() => {
          setVisible(false);
        }, 180);
      }
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div
        aria-hidden={!visible}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-0.5 w-full bg-transparent"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 250ms ease' }}
      >
        <div
          className="h-full w-full origin-left"
          style={{
            transform: `scaleX(${progress / 100})`,
            transition: 'transform 90ms linear',
            background: 'linear-gradient(90deg,var(--brand,#2563eb),#0ea5e9)'
          }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
          transition={{ duration: reducedMotion ? 0.18 : 0.3, ease: [0.4,0.2,0.2,1] }}
          className="will-change-transform">
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
