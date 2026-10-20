import type { MetadataRoute } from "next";
import { fetchRankings } from "@/lib/kansei";

const BASE = "https://agent-stars.com";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/notes`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/ja/notes`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/notes-api`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
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

  return [...staticPages, ...servicePages];
}
