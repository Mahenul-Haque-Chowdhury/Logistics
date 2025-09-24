export const metadata = { title: 'Privacy Notice' };
import { PageHeader } from '@/components/sections/PageHeader';
import { MiniNetwork } from '@/components/sections/MiniNetwork';

export default function PrivacyPage() {
  return (
    <main className="container py-16 max-w-5xl px-6">
      <div className="relative mb-10">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl ring-1 ring-border/50">
          <MiniNetwork className="h-48" density={18} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <PageHeader eyebrow="Policy" title="Privacy Notice" description={<span>How we handle, store, and protect submitted and derived data across our logistics interfaces.</span>} align="left" />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-sm -mt-3 text-neutral-500 dark:text-neutral-400">Last updated {new Date().getFullYear()}</p>
      <p>This Privacy Notice explains how we collect, use, and protect information when you interact with our logistics estimation tools, forms, and services.</p>
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Contact Data:</strong> Name, email, phone (if provided).</li>
        <li><strong>Operational Inputs:</strong> ZIP codes, service selections, vehicle counts.</li>
        <li><strong>Technical Data:</strong> Browser type, approximate region (derived from standard HTTP metadata).</li>
        <li><strong>Stored Preferences:</strong> Locally saved quotes (stored only in your browser).</li>
      </ul>
      <h2>How We Use Information</h2>
      <ul>
        <li>Generate provisional logistics estimates.</li>
        <li>Respond to quote or service inquiries.</li>
        <li>Improve model accuracy and route heuristics (aggregated & anonymized where feasible).</li>
        <li>Maintain security and prevent misuse.</li>
      </ul>
      <h2>Local Storage</h2>
      <p>Saved quotes are stored only in your local browser storage and are not transmitted unless you explicitly submit them.</p>
      <h2>Sharing</h2>
      <p>We do not sell personal data. Limited sharing may occur with trusted infrastructure or compliance providers strictly to deliver the Services.</p>
      <h2>Retention</h2>
      <p>Contact submissions retained only as long as needed for follow-up, legal, or audit requirements.</p>
      <h2>Your Choices</h2>
      <ul>
        <li>You may request deletion of submitted contact data (subject to legal holds).</li>
        <li>You can clear saved quotes anytime via your browser storage settings.</li>
        <li>You may opt out of non-essential communications by replying STOP or using provided links.</li>
      </ul>
      <h2>Security</h2>
      <p>We employ reasonable administrative, technical, and organizational safeguards. No system is 100% secure.</p>
      <h2>Children</h2>
      <p>Services are not directed to children under 13 and we do not knowingly collect their data.</p>
      <h2>Changes</h2>
      <p>Updates to this Notice will be posted here with a new effective date.</p>
      <h2>Contact</h2>
      <p>For privacy questions use our <a href="/contact">Contact page</a>.</p>
      </div>
    </main>
  );
}
