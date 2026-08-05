import {
  ACCONTO_ESENZIONE,
  ACCONTO_PRIMA_RATA_SHARE,
  ACCONTO_SINGOLA_RATA_LIMIT,
} from "@/lib/tax-constants-2026";

export interface AccontoResult {
  totale: number;
  primaRata: number; // 40% - June 30
  secondaRata: number; // 60% - November 30 (or full 100% if unica)
  unicaRata: boolean; // single November payment
  nessunPagamento: boolean; // exempt (< €51.65)
  isFirstYear: boolean;
}

export interface AccontoOptions {
  activityYear?: number;
}

export function calcolaAcconto(
  tassaBase: number,
  options: AccontoOptions = {},
): AccontoResult {
  const activityYear = options.activityYear ?? 2;

  if (activityYear <= 1) {
    return {
      totale: 0,
      primaRata: 0,
      secondaRata: 0,
      unicaRata: false,
      nessunPagamento: true,
      isFirstYear: true,
    };
  }

  const totale = Math.max(0, Math.round(tassaBase * 100) / 100);

  if (totale < ACCONTO_ESENZIONE) {
    return {
      totale: 0,
      primaRata: 0,
      secondaRata: 0,
      unicaRata: false,
      nessunPagamento: true,
      isFirstYear: false,
    };
  }

  if (totale <= ACCONTO_SINGOLA_RATA_LIMIT) {
    return {
      totale,
      primaRata: 0,
      secondaRata: totale,
      unicaRata: true,
      nessunPagamento: false,
      isFirstYear: false,
    };
  }

  const primaRata = Math.round(totale * ACCONTO_PRIMA_RATA_SHARE * 100) / 100;
  const secondaRata = Math.round((totale - primaRata) * 100) / 100;

  return {
    totale,
    primaRata,
    secondaRata,
    unicaRata: false,
    nessunPagamento: false,
    isFirstYear: false,
  };
}
