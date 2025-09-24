export const metadata = { title: 'Terms of Use' };
import { PageHeader } from '@/components/sections/PageHeader';

export default function TermsPage() {
  return (
    <main className="container py-16 max-w-5xl px-6">
      <PageHeader eyebrow="Policy" title="Terms of Use" description={<span>Conditions governing access and usage of our estimation tools and logistics services.</span>} align="left" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-sm -mt-3 text-neutral-500 dark:text-neutral-400">Last updated {new Date().getFullYear()}</p>
  <p>These Terms of Use (&quot;Terms&quot;) govern your access to and use of our website, tools, quote calculator, and any related services (collectively, the &quot;Services&quot;). By accessing or using the Services you agree to these Terms.</p>
      <h2>1. Services Provided</h2>
      <p>We offer logistics estimation tools and operational coordination focused on last-mile delivery, dispatch operations, and vehicle relocation within the contiguous United States. All instant estimates are non-binding and subject to operational review.</p>
      <h2>2. Eligibility</h2>
      <p>You represent that you are at least 18 years old and have authority to enter into these Terms.</p>
      <h2>3. Quotes & Pricing</h2>
      <p>Instant estimates are algorithmic approximations. Binding pricing requires a manual confirmation or executed service agreement. We may adjust or reject any automated quote due to incomplete information, route constraints, capacity, compliance, or market conditions.</p>
      <h2>4. Acceptable Use</h2>
      <ul>
        <li>No scraping or automated bulk extraction without written permission.</li>
        <li>No reverse engineering, circumvention of technical limits, or security testing without authorization.</li>
        <li>No use that violates applicable federal, state, or local laws.</li>
      </ul>
      <h2>5. Data & Privacy</h2>
      <p>Your use is also governed by our <a href="/privacy">Privacy Notice</a>. Submitting contact information authorizes us to communicate regarding your inquiry.</p>
      <h2>6. Intellectual Property</h2>
      <p>All branding, UI components, copy, compiled code, and underlying logic are owned by us or our licensors. Temporary, revocable access is granted solely to evaluate or request logistics services.</p>
      <h2>7. Disclaimers</h2>
  <p>The Services are provided on an &quot;AS IS&quot; basis without warranties of any kind, express or implied. We disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
      <h2>8. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, we are not liable for indirect, incidental, consequential, special, or punitive damages, or lost profits, revenue, or data. Aggregate liability shall not exceed the lesser of (a) amounts you paid us in the past 3 months or (b) $500.</p>
      <h2>9. Termination</h2>
      <p>We may suspend or terminate access at any time for misuse, suspected fraud, or to protect the integrity of the Services.</p>
      <h2>10. Changes</h2>
      <p>We may update these Terms periodically. Continued use after updates constitutes acceptance.</p>
      <h2>11. Contact</h2>
      <p>Questions about these Terms can be sent via our <a href="/contact">Contact page</a>.</p>
      </div>
    </main>
  );
}
