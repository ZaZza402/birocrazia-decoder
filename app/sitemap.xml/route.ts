import { ATECO_DATA, getAtecoSlug } from "@/lib/ateco-data";
import { SCENARIOS } from "@/lib/scenarios";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.bur0.click";

const STATIC_PAGES: Array<{
  path: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}> = [
  { path: "/", lastmod: "2026-03-27", changefreq: "weekly", priority: "1.0" },
  {
    path: "/calcolatori/forfettario",
    lastmod: "2026-03-27",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/calcolatori/ateco",
    lastmod: "2026-03-27",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/calcolatori/cliff",
    lastmod: "2026-03-27",
    changefreq: "monthly",
    priority: "0.85",
  },
  {
    path: "/calcolatori/giornale",
    lastmod: "2026-08-05",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/calcolatori/acconto",
    lastmod: "2026-03-27",
    changefreq: "monthly",
    priority: "0.85",
  },
  {
    path: "/calcolatori/ricevuta",
    lastmod: "2026-03-27",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/calcolatori/fattura",
    lastmod: "2026-03-27",
    changefreq: "monthly",
    priority: "0.85",
  },
];

function urlEntry(
  path: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildXml(): string {
  const staticEntries = STATIC_PAGES.map((p) =>
    urlEntry(p.path, p.lastmod, p.changefreq, p.priority),
  );

  const scenarioEntries = SCENARIOS.map((s) =>
    urlEntry(
      `/calcolatori/forfettario/${s.slug}`,
      "2026-03-27",
      "monthly",
      "0.8",
    ),
  );

  const atecoEntries = ATECO_DATA.map((e) =>
    urlEntry(
      `/calcolatori/ateco/${getAtecoSlug(e)}`,
      "2026-08-25",
      "monthly",
      "0.6",
    ),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...scenarioEntries, ...atecoEntries].join("\n")}
</urlset>`;
}

export async function GET() {
  return new Response(buildXml(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Vary: "Accept-Encoding",
    },
  });
}
