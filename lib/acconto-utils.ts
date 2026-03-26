export const SOGLIA_ESENZIONE = 51.65; // no payment if below
export const SOGLIA_UNICA = 257.52; // single November payment if below

export interface AccontoResult {
  totale: number;
  primaRata: number; // 40% — June 30
  secondaRata: number; // 60% — November 30 (or full 100% if unica)
  unicaRata: boolean; // single November payment
  nessunPagamento: boolean; // exempt (< €51.65)
}

export function calcolaAcconto(tassaBase: number): AccontoResult {
  const totale = Math.max(0, Math.round(tassaBase * 100) / 100);

  if (totale < SOGLIA_ESENZIONE) {
    return {
      totale: 0,
      primaRata: 0,
      secondaRata: 0,
      unicaRata: false,
      nessunPagamento: true,
    };
  }

  if (totale <= SOGLIA_UNICA) {
    return {
      totale,
      primaRata: 0,
      secondaRata: totale,
      unicaRata: true,
      nessunPagamento: false,
    };
  }

  const primaRata = Math.round(totale * 0.4 * 100) / 100;
  const secondaRata = Math.round((totale - primaRata) * 100) / 100;

  return { totale, primaRata, secondaRata, unicaRata: false, nessunPagamento: false };
}
