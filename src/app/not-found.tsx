import Link from 'next/link';
import { PageHeader } from '@/components/sections/PageHeader';
import { MiniNetwork } from '@/components/sections/MiniNetwork';
export default function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-28">
      <div className="relative mb-12 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl ring-1 ring-border/50">
          <MiniNetwork className="h-56" density={20} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <PageHeader eyebrow="Error" title="Page Not Found" description={<span>The page you were looking for does not exist or has moved. Try heading back to the homepage.</span>} align="center" />
      </div>
      <div className="flex justify-center">
        <Link href="/" className="btn-primary inline-flex">Back to Home</Link>
      </div>
    </main>
  );
}
