import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface ServicePreviewCardProps {
  title: string;
  blurb: string;
  href: string;
  media: ReactNode; // SVG / illustration
  tags?: string[];
}

export function ServicePreviewCard({ title, blurb, href, media, tags = [] }: ServicePreviewCardProps) {
  return (
    <Link href={href} className="group relative rounded-xl overflow-hidden ring-1 ring-border/60 bg-gradient-to-br from-white/80 via-white/60 to-white/30 dark:from-neutral-900/80 dark:via-neutral-900/60 dark:to-neutral-900/30 backdrop-blur-sm p-6 flex flex-col gap-5 focus-ring transition">
      <div className="relative h-32 -mx-2 -mt-2 mb-2 overflow-hidden rounded-lg flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(42,137,255,0.18),transparent_70%)]">
        <div className="w-full h-full opacity-70 group-hover:opacity-90 transition transform group-hover:scale-[1.03]">
          {media}
        </div>
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.05)_100%)]" />
      </div>
      <div className="space-y-2">
        <h3 className="font-heading font-semibold text-lg tracking-tight flex items-center gap-2">{title}
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600/15 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition"><ArrowRight className="w-3 h-3" /></span>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{blurb}</p>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {tags.slice(0,3).map(t => <span key={t} className="badge-accent text-[11px]">{t}</span>)}
        </div>
      )}
      <span className="sr-only">View service: {title}</span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(42,137,255,0.15),transparent_70%)]" />
    </Link>
  );
}
