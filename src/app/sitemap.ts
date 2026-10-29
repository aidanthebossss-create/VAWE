import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const lastModified = new Date('2026-04-27');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://vawes.site/',
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
