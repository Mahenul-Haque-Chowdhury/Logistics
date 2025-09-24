import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { PageTransition } from "@/components/layout/PageTransition";
import { BRAND_NAME } from '@/lib/brand';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} | Modern Logistics Solutions`,
    template: `%s | ${BRAND_NAME}`
  },
  description: "US logistics solutions: last-mile delivery, dispatch operations, vehicle relocation, tracking.",
  keywords: ["logistics","last-mile","dispatch","vehicle relocation","delivery"],
  icons: { icon: "/favicon.ico" },
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
  <body className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} font-sans min-h-screen flex flex-col overflow-x-hidden`}> 
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-white dark:bg-neutral-900 text-sm font-medium px-4 py-2 rounded-md shadow focus:ring-2 focus:ring-brand-500">Skip to content</a>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          (function(){
            if (typeof window === 'undefined') return;
            // Fix Leaflet's default icon paths when bundling with Next.js
            try {
              var L = window.L;
              if (L && L.Icon && !L.Icon.prototype._getIconUrlPatched) {
                L.Icon.Default.mergeOptions({
                  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
                });
                L.Icon.prototype._getIconUrlPatched = true;
              }
            } catch(e) { /* silent */ }
          })();
        `}} />
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: BRAND_NAME,
          url: 'https://example.com',
          logo: 'https://example.com/logo.png',
          sameAs: [
            'https://www.linkedin.com/company/example'
          ],
          contactPoint: [{
            '@type': 'ContactPoint',
            telephone: '+1-000-000-0000',
            contactType: 'customer support',
            areaServed: 'US'
          }]
        }) }} />
        <ThemeProvider>
          <Navbar />
          <PageTransition>
            <div id="main" className="flex-1">{children}</div>
          </PageTransition>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
