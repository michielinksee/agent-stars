import type { MetadataRoute } from "next";
import { fetchRankings } from "@/lib/kansei";
import { listErrorCards } from "@/lib/error-cards";

const BASE = "https://agent-stars.com";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/wiki/errors`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ja/wiki/errors`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/ja`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/ja/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const { services } = await fetchRankings(500).catch(() => ({ services: [], total: 0 }));

  const servicePages: MetadataRoute.Sitemap = services.flatMap((s) => [
    {
      url: `${BASE}/service/${encodeURIComponent(s.id)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/ja/service/${encodeURIComponent(s.id)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]);

  // Error cards: read from wiki/errors/*.md (canonical Markdown in this repository).
  const errorPages: MetadataRoute.Sitemap = listErrorCards().flatMap((c) => {
    const lastModified = c.last_verified ? new Date(c.last_verified) : now;
    return [
      { url: `${BASE}/wiki/errors/${encodeURIComponent(c.error_key)}`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
      { url: `${BASE}/ja/wiki/errors/${encodeURIComponent(c.error_key)}`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
    ];
  });

  return [...staticPages, ...servicePages, ...errorPages];
}
