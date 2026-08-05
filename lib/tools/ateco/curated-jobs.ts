import { ATECO_BY_CODE, type AtecoEntry } from "@/lib/ateco-data";

export const CURATED_ATECO_JOBS: Record<string, string[]> = {
  avvocato: ["69.10.10"],
  idraulico: ["43.22.01"],
  elettricista: ["43.21.01"],
  influencer: ["73.11.03"],
  "e-commerce": ["47.91.10", "47.91.20"],
  sarto: ["74.11.20"],
  fotografo: ["74.20.19", "74.20.11"],
  copywriter: ["73.11.01"],
  designer: ["74.12.01", "74.12.09", "74.11.10"],
  consulente: ["70.20.09", "69.20.06", "69.20.04"],
};

const CURATED_QUERY_ALIASES: Record<string, string[]> = {
  avvocato: ["avvocato", "legale", "lawyer"],
  idraulico: ["idraulico", "termoidraulico"],
  elettricista: ["elettricista", "impianti elettrici"],
  influencer: ["influencer", "creator", "ugc", "content creator"],
  "e-commerce": ["e-commerce", "ecommerce", "shopify", "amazon fba"],
  sarto: ["sarto", "sartoria", "stilista"],
  fotografo: ["fotografo", "fotografia", "photographer"],
  copywriter: ["copywriter", "copy", "copy writing"],
  designer: ["designer", "ui", "ux", "grafico", "web designer"],
  consulente: ["consulente", "consultant", "advisor"],
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function getCuratedAtecoMatches(query: string): AtecoEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const matchedJobKeys = Object.entries(CURATED_QUERY_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => q.includes(alias)))
    .map(([jobKey]) => jobKey);

  const matchedCodes = matchedJobKeys.flatMap(
    (jobKey) => CURATED_ATECO_JOBS[jobKey] ?? [],
  );

  return matchedCodes
    .map((code) => ATECO_BY_CODE[code])
    .filter((entry): entry is AtecoEntry => Boolean(entry));
}
