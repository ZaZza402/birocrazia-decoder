import type { CassaType } from "@/lib/forfettario-utils";
import {
  INPS_GESTIONE_SEPARATA_RATE,
  TAX_YEAR,
} from "@/lib/tax-constants-2026";

export const GIORNALE_PROFILE_KEY = `bur0_giornale_profile_${TAX_YEAR}`;
export const GIORNALE_ENTRIES_KEY = `bur0_giornale_${TAX_YEAR}`;
// Same key CliffTracker reads — one-way sync from giornale into cliff
const CLIFF_KEY = `bur0_cliff_${TAX_YEAR}`;

export interface GiornaleProfile {
  isNewBusiness: boolean;
  cassaType: CassaType;
  customCassaRate?: number;
  atecoCoefficient: number;
  atecoCode: string;
  previousYearINPS: number;
}

export interface GiornaleEntry {
  id: string;
  date: string; // ISO date "YYYY-MM-DD"
  amount: number;
  label: string;
}

export type GiornaleData = Record<number, GiornaleEntry[]>;

export const DEFAULT_PROFILE: GiornaleProfile = {
  isNewBusiness: false,
  cassaType: "gestione_separata",
  atecoCoefficient: 0.67,
  atecoCode: "62.10.00",
  previousYearINPS: 0,
};

export function readProfile(): GiornaleProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(GIORNALE_PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return {
      ...DEFAULT_PROFILE,
      ...(JSON.parse(raw) as Partial<GiornaleProfile>),
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: GiornaleProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GIORNALE_PROFILE_KEY, JSON.stringify(profile));
}

export function readEntries(): GiornaleData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GIORNALE_ENTRIES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const data: GiornaleData = {};
    for (const [k, v] of Object.entries(parsed)) {
      const m = Number(k);
      if (m >= 1 && m <= 12 && Array.isArray(v)) data[m] = v as GiornaleEntry[];
    }
    return data;
  } catch {
    return {};
  }
}

export function saveEntries(data: GiornaleData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GIORNALE_ENTRIES_KEY, JSON.stringify(data));
}

export function syncMonthToCliff(
  month: number,
  entries: GiornaleEntry[],
): void {
  if (typeof window === "undefined") return;
  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  try {
    const raw = localStorage.getItem(CLIFF_KEY);
    const cliff: Record<number, number> = raw
      ? (JSON.parse(raw) as Record<number, number>)
      : {};
    cliff[month] = total;
    localStorage.setItem(CLIFF_KEY, JSON.stringify(cliff));
  } catch {
    localStorage.setItem(CLIFF_KEY, JSON.stringify({ [month]: total }));
  }
}

// Flat per-entry reserve estimate — not accounting for INPS deductibility (shown in monthly summary)
export function computeSafeToSpend(
  amount: number,
  profile: GiornaleProfile,
): { safeToSpend: number; toReserve: number; reservePct: number } {
  const taxRate = profile.isNewBusiness ? 0.05 : 0.15;
  let inpsRate: number;
  switch (profile.cassaType) {
    case "artigiani":
      inpsRate = 0.24;
      break;
    case "commercianti":
      inpsRate = 0.2448;
      break;
    case "custom":
      inpsRate = (profile.customCassaRate ?? 0) / 100;
      break;
    default:
      inpsRate = INPS_GESTIONE_SEPARATA_RATE;
  }
  const reservePct = profile.atecoCoefficient * (taxRate + inpsRate);
  const toReserve = Math.round(amount * reservePct);
  const safeToSpend = Math.round(amount - toReserve);
  return { safeToSpend, toReserve, reservePct };
}

export function getMonthTotal(entries: GiornaleEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}
