import type { AtecoEntry } from "@/lib/ateco-data";

export const ATECO_RULESET_YEAR = 2026;

export type AtecoMacroCategory =
  | "commerce_hospitality"
  | "it_media"
  | "professional_services"
  | "construction_impianti"
  | "personal_services";

export const ATECO_MACRO_COEFFICIENTS: Record<AtecoMacroCategory, number> = {
  commerce_hospitality: 0.4,
  it_media: 0.67,
  professional_services: 0.78,
  construction_impianti: 0.86,
  personal_services: 0.78,
};

const COEFFICIENT_WHITELIST = new Set<number>([
  ATECO_MACRO_COEFFICIENTS.commerce_hospitality,
  ATECO_MACRO_COEFFICIENTS.it_media,
  ATECO_MACRO_COEFFICIENTS.professional_services,
  ATECO_MACRO_COEFFICIENTS.construction_impianti,
]);

function extractAtecoDivision(code: string): string {
  const normalized = code.replace(/\s/g, "");
  const [division] = normalized.split(".");
  return division;
}

function resolveByDivision(code: string): AtecoMacroCategory | null {
  const division = extractAtecoDivision(code);

  if (["45", "46", "47", "55", "56", "79"].includes(division)) {
    return "commerce_hospitality";
  }

  if (["58", "59", "60", "61", "62", "63", "90"].includes(division)) {
    return "it_media";
  }

  if (["41", "42", "43"].includes(division)) {
    return "construction_impianti";
  }

  if (
    ["69", "70", "71", "72", "73", "74", "75", "85", "86", "88", "96"].includes(
      division,
    )
  ) {
    return "professional_services";
  }

  return null;
}

export function resolveAtecoMacroCategory(
  entry: AtecoEntry,
): AtecoMacroCategory {
  const byDivision = resolveByDivision(entry.code);
  if (byDivision) return byDivision;

  const sector = entry.sector.toLowerCase();

  if (
    sector.includes("commerc") ||
    sector.includes("ristor") ||
    sector.includes("ospital") ||
    sector.includes("turism")
  ) {
    return "commerce_hospitality";
  }

  if (
    sector.includes("it") ||
    sector.includes("software") ||
    sector.includes("media") ||
    sector.includes("editor") ||
    sector.includes("video") ||
    sector.includes("cinema")
  ) {
    return "it_media";
  }

  if (sector.includes("costru") || sector.includes("impiant")) {
    return "construction_impianti";
  }

  if (
    sector.includes("cura della persona") ||
    sector.includes("sanit") ||
    sector.includes("architett") ||
    sector.includes("ingegner") ||
    sector.includes("legali") ||
    sector.includes("contabil") ||
    sector.includes("profession") ||
    sector.includes("comunic") ||
    sector.includes("marketing") ||
    sector.includes("design") ||
    sector.includes("formaz")
  ) {
    return "professional_services";
  }

  return "personal_services";
}

export function resolveAtecoCoefficient(entry: AtecoEntry): number {
  if (COEFFICIENT_WHITELIST.has(entry.coefficient)) {
    return entry.coefficient;
  }

  const macroCategory = resolveAtecoMacroCategory(entry);
  return ATECO_MACRO_COEFFICIENTS[macroCategory] ?? entry.coefficient;
}
