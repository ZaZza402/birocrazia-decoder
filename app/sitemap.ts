import type { MetadataRoute } from "next";
import { SCENARIOS } from "@/lib/scenarios";

const BASE = "https://bur0.click";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/calcolatori/forfettario`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/calcolatori/ateco`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/calcolatori/cliff`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/calcolatori/acconto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/calcolatori/ricevuta`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/calcolatori/fattura`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...SCENARIOS.map((s) => ({
      url: `${BASE}/calcolatori/forfettario/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
