import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="container mx-auto max-w-xl px-6 py-28 text-center">
      <h1 className="text-5xl font-heading font-bold tracking-tight">404</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">The page you are looking for could not be found.</p>
      <Link href="/" className="btn-primary inline-flex mt-8">Back to Home</Link>
    </main>
  );
}
