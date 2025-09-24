import Link from 'next/link';
import { ArrowRight, Ship, Boxes, Truck, Headset, MoveRight } from 'lucide-react';

const iconMap = { Ship, Boxes, Truck, Headset, MoveRight } as const;
type IconName = keyof typeof iconMap;

interface Props {
  title: string;
  summary: string;
  icon?: IconName;
  href: string;
}

export function ServiceCard({ title, summary, icon = 'Truck', href }: Props) {
  const IconComp = iconMap[icon] ?? Truck;
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 p-5 rounded-xl border border-border/60 bg-background/60 hover:bg-accent/40 hover:border-border focus-ring transition"
      aria-label={`Learn more about ${title}`}
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-600/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-600/20 shrink-0">
          <IconComp className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-lg tracking-tight group-hover:text-brand-600 transition-colors">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{summary}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
        Learn More <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
