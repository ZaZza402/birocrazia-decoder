import type { MetadataRoute } from "next";
import { SCENARIOS } from "@/lib/scenarios";

const BASE = "https://bur0.click";
const NOW = new Date().toISOString().split("T")[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/calcolatori/forfettario`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/calcolatori/ateco`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/calcolatori/cliff`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE}/calcolatori/acconto`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/calcolatori/ricevuta`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/termini`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const scenarioRoutes: MetadataRoute.Sitemap = SCENARIOS.map((s) => ({
    url: `${BASE}/calcolatori/forfettario/${s.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...scenarioRoutes];
}
