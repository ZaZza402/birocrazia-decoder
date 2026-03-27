import type { CassaType } from "@/lib/forfettario-utils";

export interface Scenario {
  slug: string;
  profession: string;
  title: string;
  description: string;
  atecoCode: string;
  inputs: {
    expectedRevenue: number;
    atecoCoefficient: number;
    cassaType: CassaType;
    isNewBusiness: boolean;
    clientType: "b2b" | "b2c";
    realExpenses: number;
    previousYearINPS: number;
  };
}

export const SCENARIOS: Scenario[] = [
  // ── IT & SOFTWARE ──────────────────────────────────────────────────────
  {
    slug: "sviluppatore-software-50k",
    profession: "Sviluppatore Software",
    title: "Calcolo Tasse Forfettario — Sviluppatore Software €50.000",
    description:
      "Quanto paga di tasse uno sviluppatore software freelance con €50.000 di fatturato? Calcola il netto in Regime Forfettario con Gestione Separata INPS.",
    atecoCode: "62.10.00",
    inputs: {
      expectedRevenue: 50000,
      atecoCoefficient: 0.67,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 5000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "sviluppatore-software-75k",
    profession: "Sviluppatore Software (senior)",
    title: "Calcolo Tasse Forfettario — Sviluppatore Software €75.000",
    description:
      "Tasse e netto per uno sviluppatore software senior con €75.000 di fatturato. Simulazione Regime Forfettario vs Ordinario 2026.",
    atecoCode: "62.10.00",
    inputs: {
      expectedRevenue: 75000,
      atecoCoefficient: 0.67,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 5000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "consulente-it-60k",
    profession: "Consulente IT",
    title: "Calcolo Tasse Forfettario — Consulente IT €60.000",
    description:
      "Simulazione fiscale per un consulente IT freelance con €60.000 di fatturato. Forfettario vs Ordinario: qual è il regime più conveniente?",
    atecoCode: "62.20.10",
    inputs: {
      expectedRevenue: 60000,
      atecoCoefficient: 0.67,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 3000,
      previousYearINPS: 0,
    },
  },

  // ── DESIGN & COMUNICAZIONE ─────────────────────────────────────────────
  {
    slug: "graphic-designer-35k",
    profession: "Graphic Designer",
    title: "Calcolo Tasse Forfettario — Graphic Designer €35.000",
    description:
      "Tasse e netto per un graphic designer freelance con €35.000 di fatturato. Coefficiente 78%, Gestione Separata INPS, confronto Forfettario vs Ordinario.",
    atecoCode: "74.12.09",
    inputs: {
      expectedRevenue: 35000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 3000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "web-designer-40k",
    profession: "Web Designer / UX Designer",
    title: "Calcolo Tasse Forfettario — Web Designer €40.000",
    description:
      "Calcola il netto per un web designer o UX designer freelance con €40.000 di fatturato. Simulazione completa Forfettario vs Ordinario 2026.",
    atecoCode: "74.12.01",
    inputs: {
      expectedRevenue: 40000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 3000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "digital-marketing-45k",
    profession: "Digital Marketing Specialist",
    title: "Calcolo Tasse Forfettario — Digital Marketing €45.000",
    description:
      "Tasse e netto per un consulente digital marketing freelance con €45.000 di fatturato. Regime Forfettario 2026, coefficiente 78%.",
    atecoCode: "73.11.02",
    inputs: {
      expectedRevenue: 45000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 2000,
      previousYearINPS: 0,
    },
  },

  // ── PROFESSIONI LEGALI & CONTABILI ─────────────────────────────────────
  {
    slug: "commercialista-55k",
    profession: "Commercialista",
    title: "Calcolo Tasse Forfettario — Commercialista €55.000",
    description:
      "Simulazione fiscale per un commercialista freelance con €55.000 di fatturato. Confronto Regime Forfettario vs Ordinario, coefficiente 78%.",
    atecoCode: "69.20.01",
    inputs: {
      expectedRevenue: 55000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 5000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "avvocato-65k",
    profession: "Avvocato",
    title: "Calcolo Tasse Forfettario — Avvocato €65.000",
    description:
      "Quanto paga di tasse un avvocato freelance con €65.000 di fatturato? Regime Forfettario 2026, aliquota 15%, coefficiente 78%.",
    atecoCode: "69.10.10",
    inputs: {
      expectedRevenue: 65000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 5000,
      previousYearINPS: 0,
    },
  },

  // ── ARCHITETTURA & INGEGNERIA ──────────────────────────────────────────
  {
    slug: "architetto-48k",
    profession: "Architetto",
    title: "Calcolo Tasse Forfettario — Architetto €48.000",
    description:
      "Calcola tasse e netto per un architetto freelance con €48.000 di fatturato. Forfettario vs Ordinario 2026, coefficiente 78%.",
    atecoCode: "71.11.09",
    inputs: {
      expectedRevenue: 48000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 4000,
      previousYearINPS: 0,
    },
  },

  // ── SANITÀ & BENESSERE ─────────────────────────────────────────────────
  {
    slug: "fisioterapista-38k",
    profession: "Fisioterapista",
    title: "Calcolo Tasse Forfettario — Fisioterapista €38.000",
    description:
      "Tasse e netto per un fisioterapista con €38.000 di fatturato in Regime Forfettario 2026. Clientela privata B2C, coefficiente 78%.",
    atecoCode: "86.95.00",
    inputs: {
      expectedRevenue: 38000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2c",
      realExpenses: 3000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "personal-trainer-28k",
    profession: "Personal Trainer",
    title: "Calcolo Tasse Forfettario — Personal Trainer €28.000",
    description:
      "Simulazione fiscale per un personal trainer freelance con €28.000 di fatturato. Regime Forfettario 2026, aliquota 15%, Gestione Separata.",
    atecoCode: "85.51.09",
    inputs: {
      expectedRevenue: 28000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2c",
      realExpenses: 2000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "psicologo-35k",
    profession: "Psicologo / Psicoterapeuta",
    title: "Calcolo Tasse Forfettario — Psicologo €35.000",
    description:
      "Tasse e netto per uno psicologo o psicoterapeuta con €35.000 di fatturato in Regime Forfettario 2026.",
    atecoCode: "86.93.00",
    inputs: {
      expectedRevenue: 35000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2c",
      realExpenses: 2000,
      previousYearINPS: 0,
    },
  },

  // ── LINGUE & MEDIA ─────────────────────────────────────────────────────
  {
    slug: "traduttore-32k",
    profession: "Traduttore / Interprete",
    title: "Calcolo Tasse Forfettario — Traduttore €32.000",
    description:
      "Calcola il netto per un traduttore o interprete freelance con €32.000 di fatturato. Regime Forfettario 2026, coefficiente 78%.",
    atecoCode: "74.30.00",
    inputs: {
      expectedRevenue: 32000,
      atecoCoefficient: 0.78,
      cassaType: "gestione_separata",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 1000,
      previousYearINPS: 0,
    },
  },

  // ── COSTRUZIONI & IMPIANTI ─────────────────────────────────────────────
  {
    slug: "elettricista-50k",
    profession: "Elettricista",
    title: "Calcolo Tasse Forfettario — Elettricista €50.000",
    description:
      "Tasse e netto per un elettricista artigiano con €50.000 di fatturato. Coefficiente 86%, INPS Artigiani e Commercianti.",
    atecoCode: "43.21.01",
    inputs: {
      expectedRevenue: 50000,
      atecoCoefficient: 0.86,
      cassaType: "artigiani",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 8000,
      previousYearINPS: 0,
    },
  },
  {
    slug: "idraulico-48k",
    profession: "Idraulico / Termoidraulico",
    title: "Calcolo Tasse Forfettario \u2014 Idraulico \u20ac48.000",
    description:
      "Simulazione fiscale per un idraulico artigiano con \u20ac48.000 di fatturato. Regime Forfettario, coefficiente 86%, INPS Artigiani.",
    atecoCode: "43.22.01",
    inputs: {
      expectedRevenue: 48000,
      atecoCoefficient: 0.86,
      cassaType: "artigiani",
      isNewBusiness: false,
      clientType: "b2b",
      realExpenses: 8000,
      previousYearINPS: 0,
    },
  },
];
