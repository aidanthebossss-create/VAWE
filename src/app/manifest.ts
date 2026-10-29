import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VAWES — Web Design & Development Studio',
    short_name: 'VAWES',
    description:
      'South African web design and development studio. Fast, modern websites that convert.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#11426D',
    lang: 'en-ZA',
    categories: ['business', 'productivity', 'web design'],
    icons: [
      { src: '/logo/vawes-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo/vawes-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo/vawes-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
