import Link from 'next/link';
import { ArrowRight, Ship, Boxes, Truck, Headset, MoveRight } from 'lucide-react';

const iconMap = { Ship, Boxes, Truck, Headset, MoveRight } as const;
type IconName = keyof typeof iconMap;

interface Props {
  title: string;
  summary: string;
  icon?: IconName;
  href: string;
  outcomes?: string[];
  tier?: string;
}

export function ServiceCard({ title, summary, icon = 'Truck', href, outcomes = [], tier }: Props) {
  const IconComp = iconMap[icon] ?? Truck;
  return (
    <Link href={href} className="group surface relative p-6 flex flex-col gap-4 focus-ring transition" aria-label={`Learn more about ${title}`}>
      <div className="flex items-start gap-4">
        <span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-600/20">
          <IconComp className="w-5 h-5" />
        </span>
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-semibold text-lg tracking-tight">{title}</h3>
            {tier && (
              <span className={`badge ${tier === 'premium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300' : 'badge-outline'}`}>{tier.toUpperCase()}</span>
            )}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">{summary}</p>
        </div>
      </div>
      {outcomes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 -mt-1">
          {outcomes.slice(0,2).map(o => (
            <span key={o} className="badge-accent">{o}</span>
          ))}
        </div>
      )}
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
        Learn More <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
