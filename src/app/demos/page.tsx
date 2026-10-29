import type { Metadata } from 'next';
import DemoHub from '@/components/DemoHub';

// Unlisted, private staging hub for client demos. It must never be indexed
// or surfaced in search — `robots: noindex` overrides the site-wide
// `index: true` set in the root layout. It is also intentionally absent from
// the nav, the sitemap, and robots.txt (listing it there would advertise the
// path). Share the URL — https://vawes.site/demos/ — directly with clients.
export const metadata: Metadata = {
  title: 'Client Demos',
  description: 'Private staging area for VAWES client website demos.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: '/demos',
  },
};

export default function DemosPage() {
  return <DemoHub />;
}
