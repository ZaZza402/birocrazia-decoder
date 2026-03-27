import { NextResponse } from "next/server";
import { SCENARIOS } from "@/lib/scenarios";

const BASE = "https://bur0.click";

export const dynamic = "force-static";

export function GET() {
  const now = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: `${BASE}/`, priority: "1.0", changefreq: "weekly" },
    {
      loc: `${BASE}/calcolatori/forfettario`,
      priority: "0.9",
      changefreq: "weekly",
    },
    { loc: `${BASE}/calcolatori/ateco`, priority: "0.9", changefreq: "weekly" },
    {
      loc: `${BASE}/calcolatori/cliff`,
      priority: "0.85",
      changefreq: "weekly",
    },
    {
      loc: `${BASE}/calcolatori/acconto`,
      priority: "0.85",
      changefreq: "monthly",
    },
    {
      loc: `${BASE}/calcolatori/ricevuta`,
      priority: "0.7",
      changefreq: "monthly",
    },
    {
      loc: `${BASE}/calcolatori/fattura`,
      priority: "0.85",
      changefreq: "monthly",
    },
    ...SCENARIOS.map((s) => ({
      loc: `${BASE}/calcolatori/forfettario/${s.slug}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
