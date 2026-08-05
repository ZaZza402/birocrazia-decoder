import { searchAteco, type AtecoEntry } from "@/lib/ateco-data";
import { getCuratedAtecoMatches } from "@/lib/tools/ateco/curated-jobs";

function dedupeByCode(entries: AtecoEntry[]): AtecoEntry[] {
  const map = new Map<string, AtecoEntry>();
  for (const entry of entries) {
    if (!map.has(entry.code)) map.set(entry.code, entry);
  }
  return Array.from(map.values());
}

export function searchAtecoWithCuratedDictionary(
  query: string,
  limit = 12,
): AtecoEntry[] {
  if (!query.trim()) {
    return searchAteco("").slice(0, limit);
  }

  const curated = getCuratedAtecoMatches(query);
  const fallback = searchAteco(query);

  return dedupeByCode([...curated, ...fallback]).slice(0, limit);
}
