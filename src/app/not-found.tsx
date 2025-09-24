import Link from 'next/link';
import { PageHeader } from '@/components/sections/PageHeader';
export default function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-28 text-center">
      <PageHeader eyebrow="Error" title="Page Not Found" description={<span>The page you were looking for does not exist or has moved. Try heading back to the homepage.</span>} align="center" />
      <div className="flex justify-center">
        <Link href="/" className="btn-primary inline-flex">Back to Home</Link>
      </div>
    </main>
  );
}
