import type { MetadataRoute } from 'next';
import { tarotCards } from '@/features/cards';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tarotvutru.com';

  const cardPages = tarotCards.map((card) => ({
    url: `${baseUrl}/y-nghia-la-bai/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/boi-bai`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/boi-bai/3-la`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/boi-bai/yes-no`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/y-nghia-la-bai`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...cardPages,
  ];
}
