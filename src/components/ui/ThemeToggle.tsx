"use client";
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = theme === 'system' ? systemTheme : theme;
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
    >
      {mounted && current === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">
        {mounted && current === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
