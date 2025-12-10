export type CassaType = "gestione_separata" | "artigiani_commercianti" | "custom";

export interface ForfettarioInputs {
  atecoCoefficient: number;
  cassaType: CassaType;
  customCassaRate?: number;
  isNewBusiness: boolean;
  expectedRevenue: number;
  previousYearINPS: number;
  realExpenses: number;
  clientType: "b2b" | "b2c";
}

export interface RegimeResult {
  grossRevenue: number;
  taxableBase: number;
  inpsContributes: number;
  taxAmount: number; // Imposta Sostitutiva or IRPEF
  addizionali?: number; // Only for Ordinario
  ivaAmount: number; // Only for Ordinario B2C analysis
  netIncome: number;
  effectiveTaxRate: number;
  warnings: string[];
}

export const ATECO_CODES = [
  { code: "62.01.00", description: "Sviluppo Software", coefficient: 0.67 },
  { code: "62.02.00", description: "Consulenza Informatica", coefficient: 0.67 },
  { code: "73.11.01", description: "Marketing & Agency", coefficient: 0.78 },
  { code: "74.10.21", description: "Web Design / Grafica", coefficient: 0.78 },
  { code: "69.10.10", description: "Attività Legali", coefficient: 0.78 },
  { code: "47.91.10", description: "E-commerce", coefficient: 0.40 },
  { code: "90.01.09", description: "Altre rappresentazioni artistiche", coefficient: 0.67 },
];

// CONSTANTS 2025 (Estimates based on current law)
const INPS_GS_RATE = 0.2607; // Gestione Separata ~26.07%
const INPS_ART_FIXED = 4515; // Minimal fixed for Artigiani (~4.5k)
const INPS_ART_MIN_INCOME = 18415; // Minimal income threshold
const INPS_ART_RATE_OVER = 0.24; // ~24% over threshold

const IRPEF_BRACKETS = [
  { limit: 28000, rate: 0.23 },
  { limit: 50000, rate: 0.35 },
  { limit: Infinity, rate: 0.43 },
];

export const formatCurrency = (val: number) => {
  const rounded = Math.round(val);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `€${formatted}`;
};

export const formatPercentage = (val: number) => `${val.toFixed(1)}%`;

// --- THE CORE LOGIC ---

export function compareRegimes(inputs: ForfettarioInputs): {
  forfettario: RegimeResult;
  ordinario: RegimeResult;
  difference: number;
  recommendation: string;
} {
  // 1. Calculate Forfettario Scenario
  // ---------------------------------
  let f_warnings: string[] = [];
  let f_gross = inputs.expectedRevenue;
  
  // THE 100K TRAP: If > 100k, you are NOT Forfettario anymore. Immediate exit.
  const isForcedOrdinario = inputs.expectedRevenue > 100000;
  
  // If > 85k but < 100k, you are technically Forfettario THIS year, but out NEXT year.
  if (inputs.expectedRevenue > 85000 && !isForcedOrdinario) {
    f_warnings.push("ATTENZIONE: Superando gli 85k uscirai dal regime l'anno prossimo.");
  }

  let f_taxable = f_gross * inputs.atecoCoefficient;
  let f_inps = 0;

  // INPS Calculation
  if (inputs.cassaType === "gestione_separata") {
    f_inps = f_taxable * INPS_GS_RATE;
  } else if (inputs.cassaType === "artigiani_commercianti") {
    // Note: Artigiani pay on REAL income in Forfettario too (Coefficient applies)
    if (f_taxable <= INPS_ART_MIN_INCOME) {
      f_inps = INPS_ART_FIXED;
    } else {
      f_inps = INPS_ART_FIXED + ((f_taxable - INPS_ART_MIN_INCOME) * INPS_ART_RATE_OVER);
    }
    // Artigiani in Forfettario can request 35% reduction
    f_inps = f_inps * 0.65; 
  } else if (inputs.cassaType === "custom" && inputs.customCassaRate) {
    f_inps = f_gross * (inputs.customCassaRate / 100); // Usually on Gross for professionals
  }

  // Tax Calculation (Sostitutiva)
  // Deduct PREVIOUS year INPS from Taxable Base (Cash basis)
  let f_taxable_net = Math.max(0, f_taxable - inputs.previousYearINPS);
  let f_tax = f_taxable_net * (inputs.isNewBusiness ? 0.05 : 0.15);

  let f_net = f_gross - f_inps - f_tax;
  
  // If forced ordinario, the "Forfettario" result is actually invalid/hypothetical
  if (isForcedOrdinario) {
    f_net = 0; // Invalid
    f_warnings.push("IMPOSSIBILE: Sopra i 100k il regime forfettario cessa immediatamente (retroattivo).");
  }


  // 2. Calculate Ordinario Scenario
  // -------------------------------
  let o_warnings: string[] = [];
  let o_gross = inputs.expectedRevenue;
  let o_iva = 0;

  // THE B2C TRAP:
  // If you are B2C and enter Ordinario, you either raise prices by 22% (lose clients) 
  // or absorb the VAT (lose money). We assume user keeps same "Gross Receipt" so they absorb VAT.
  if (inputs.clientType === "b2c") {
    // Determine the Net Revenue before VAT
    const netRevenue = o_gross / 1.22;
    o_iva = o_gross - netRevenue;
    o_gross = netRevenue; // The actual revenue for IRPEF
    o_warnings.push("B2C IMPACT: Poiché vendi a privati, il 22% del tuo incasso se ne va subito in IVA.");
  } else {
     // B2B: You add VAT on top, client pays. It's neutral for you (mostly).
     // We assume expectedRevenue is your FEE, excluding VAT.
  }

  // Costs are fully deductible in Ordinario
  let o_taxable = Math.max(0, o_gross - inputs.realExpenses);
  
  let o_inps = 0;
  // INPS Calculation (Ordinario follows similar rules but on Real Net usually)
  // Simplifying assumption: GS pays on (Revenue - Expenses)
  if (inputs.cassaType === "gestione_separata") {
    o_inps = o_taxable * INPS_GS_RATE;
  } else if (inputs.cassaType === "artigiani_commercianti") {
     if (o_taxable <= INPS_ART_MIN_INCOME) {
      o_inps = INPS_ART_FIXED;
    } else {
      o_inps = INPS_ART_FIXED + ((o_taxable - INPS_ART_MIN_INCOME) * INPS_ART_RATE_OVER);
    }
    // No 35% reduction in Ordinario!
  } else if (inputs.cassaType === "custom" && inputs.customCassaRate) {
    o_inps = inputs.expectedRevenue * (inputs.customCassaRate / 100); 
  }

  // IRPEF Base = Taxable - INPS - PreviousINPS
  let o_irpef_base = Math.max(0, o_taxable - o_inps - inputs.previousYearINPS);
  
  // Calculate IRPEF (Progressive)
  let o_irpef = 0;
  let remaining_base = o_irpef_base;
  
  let previous_limit = 0;
  for (const bracket of IRPEF_BRACKETS) {
    if (remaining_base <= 0) break;
    const tranche = Math.min(remaining_base, bracket.limit - previous_limit);
    o_irpef += tranche * bracket.rate;
    remaining_base -= tranche;
    previous_limit = bracket.limit;
  }

  // Addizionali (Approx 2.5% avg)
  let o_addizionali = o_irpef_base * 0.025;

  let o_net = o_gross - o_inps - o_irpef - o_addizionali;


  // 3. Comparison & Handling Edge Cases
  // -----------------------------------
  
  if (isForcedOrdinario) {
    // If >100k, you only have Ordinario option
    return {
      forfettario: { ...createEmptyResult(), warnings: f_warnings },
      ordinario: {
        grossRevenue: inputs.expectedRevenue, // Display total collected
        taxableBase: o_irpef_base,
        inpsContributes: o_inps,
        taxAmount: o_irpef,
        addizionali: o_addizionali,
        ivaAmount: o_iva,
        netIncome: o_net,
        effectiveTaxRate: ((inputs.expectedRevenue - o_net) / inputs.expectedRevenue) * 100,
        warnings: o_warnings
      },
      difference: 0, 
      recommendation: "SEI OBBLIGATO AL REGIME ORDINARIO (>100k)"
    };
  }

  const diff = f_net - o_net;
  
  // Recommendation Engine
  let reco = "";
  if (diff > 2000) reco = "RIMANI NEL FORFETTARIO";
  else if (diff > 0) reco = "FORFETTARIO CONVIENE ANCORA";
  else if (diff > -2000) reco = "VALUTA IL CAMBIO (Marginale)";
  else reco = "PASSA ALL'ORDINARIO (Spese Alte?)";

  return {
    forfettario: {
        grossRevenue: inputs.expectedRevenue,
        taxableBase: f_taxable,
        inpsContributes: f_inps,
        taxAmount: f_tax,
        netIncome: f_net,
        effectiveTaxRate: ((inputs.expectedRevenue - f_net) / inputs.expectedRevenue) * 100,
        warnings: f_warnings,
        ivaAmount: 0
    },
    ordinario: {
        grossRevenue: inputs.expectedRevenue,
        taxableBase: o_irpef_base,
        inpsContributes: o_inps,
        taxAmount: o_irpef,
        addizionali: o_addizionali,
        ivaAmount: o_iva,
        netIncome: o_net,
        effectiveTaxRate: ((inputs.expectedRevenue - o_net) / inputs.expectedRevenue) * 100,
        warnings: o_warnings
    },
    difference: diff,
    recommendation: reco
  };
}

function createEmptyResult(): RegimeResult {
    return { grossRevenue: 0, taxableBase: 0, inpsContributes: 0, taxAmount: 0, netIncome: 0, effectiveTaxRate: 0, warnings: [], ivaAmount: 0 };
}
