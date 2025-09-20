"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'consent.v1';

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  function acceptAll() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ t: Date.now(), marketing: false })); } catch {}
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6">
      <div className="max-w-4xl mx-auto rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 backdrop-blur p-4 sm:p-5 shadow-xl text-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs sm:text-sm">
          We use functional cookies & local storage to operate the quote estimator and remember preferences. See our <Link href="/privacy" className="underline decoration-dotted underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400">Privacy Notice</Link> for details.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={acceptAll} className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-brand-600/50">Accept</button>
          <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 text-neutral-700 dark:text-neutral-200 text-xs sm:text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400/30">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
