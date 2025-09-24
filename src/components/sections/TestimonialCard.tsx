import { ReactNode } from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarSeed?: string;
  highlight?: string; // substring to emphasize
}

function avatarGradient(seed: string) {
  const h = Math.abs(Array.from(seed).reduce((a,c)=>a + c.charCodeAt(0),0)) % 360;
  return `linear-gradient(135deg,hsl(${h} 70% 55%),hsl(${(h+40)%360} 70% 45%))`;
}

export function TestimonialCard({ quote, name, role, avatarSeed = name, highlight }: TestimonialCardProps) {
  const parts = highlight && quote.includes(highlight)
    ? quote.split(highlight)
    : null;
  return (
    <div className="surface p-6 rounded-xl flex flex-col gap-5 relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full ring-2 ring-white/10 flex items-center justify-center text-sm font-medium text-white"
          style={{ background: avatarGradient(avatarSeed) }}>{name[0] ?? '?'}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">{name}</div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{role}</div>
        </div>
      </div>
      <blockquote className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {parts ? (<>
          {parts[0]}<mark className="bg-brand-600/15 text-brand-700 dark:text-brand-300 rounded px-1 py-0.5 font-medium">{highlight}</mark>{parts[1]}
        </>) : quote}
      </blockquote>
    </div>
  );
}
