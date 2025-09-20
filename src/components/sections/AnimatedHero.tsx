"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.9,
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,0.61,0.36,1] } }
};

// Small count up hook (lightweight instead of extra dependency)
function useCountUp(value: number, durationMs = 900) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min(1, (now - start) / durationMs);
      setCurrent(Math.floor(value * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);
  return current;
}

interface Stat { label: string; value: string; numeric?: number; }

const stats: Stat[] = [
  { label: "Shipments / week", value: "1200+", numeric: 1200 },
  { label: "On-time rate", value: "98%", numeric: 98 },
  { label: "States Served", value: "48", numeric: 48 }
];

export function AnimatedHero() {
  function StatItem({ stat }: { stat: Stat }) {
    const numeric = stat.numeric ?? parseInt(stat.value.replace(/[^0-9]/g, ''), 10);
    const showPlus = stat.value.endsWith('+');
    const showPercent = stat.value.endsWith('%');
    const counter = useCountUp(numeric);
    return (
      <div className="will-change-transform">
        <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{stat.label}</dt>
        <dd className="text-2xl font-semibold font-heading flex items-baseline justify-center sm:justify-start">
          <span>{counter}</span>{showPlus && '+'}{showPercent && '%'}
        </dd>
      </div>
    );
  }
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-brand-500/15 via-brand-200/10 to-transparent" />
  <div className="container max-w-6xl pt-16 pb-24 md:pt-28 md:pb-40">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={container}
          className="max-w-4xl space-y-8 md:space-y-10"
        >
          <motion.h1 variants={item} className="font-heading text-[2.75rem] md:text-6xl font-semibold tracking-tight leading-tight">
            End-to-End <span className="text-brand-600">Logistics</span> & Supply Chain Excellence
          </motion.h1>
          <motion.p variants={item} className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
            Fast, reliable, and transparent last-mile delivery, dispatch coordination, and vehicle relocation
            powered by real-time tracking and data-driven optimization across the United States.
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center sm:justify-start">
            <Link href="/quote" className="btn-primary w-full sm:w-auto text-center justify-center">Get a Quote</Link>
            <Link href="/services" className="inline-flex items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors w-full sm:w-auto">View Services</Link>
          </motion.div>
          <motion.dl variants={item} className="grid grid-cols-3 gap-8 pt-6 max-w-md text-center sm:text-left">
            {stats.map(s => <StatItem key={s.label} stat={s} />)}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
