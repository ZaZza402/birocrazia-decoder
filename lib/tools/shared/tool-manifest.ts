export interface ToolDefinition {
  id: string;
  route: string;
  pageFile: string;
  primaryComponent: string;
  sharedModules: string[];
}

// Central index for tool-level ownership and shared dependencies.
export const TOOL_MANIFEST: ToolDefinition[] = [
  {
    id: "forfettario",
    route: "/calcolatori/forfettario",
    pageFile: "app/calcolatori/forfettario/page.tsx",
    primaryComponent: "components/ForfettarioCalculator.tsx",
    sharedModules: [
      "lib/tools/shared/index.ts",
      "lib/tools/forfettario/index.ts",
    ],
  },
  {
    id: "ateco",
    route: "/calcolatori/ateco",
    pageFile: "app/calcolatori/ateco/page.tsx",
    primaryComponent: "components/AtecoFinder.tsx",
    sharedModules: ["lib/tools/ateco/index.ts", "lib/tools/shared/index.ts"],
  },
  {
    id: "cliff",
    route: "/calcolatori/cliff",
    pageFile: "app/calcolatori/cliff/page.tsx",
    primaryComponent: "components/CliffTracker.tsx",
    sharedModules: ["lib/tools/shared/index.ts"],
  },
  {
    id: "acconto",
    route: "/calcolatori/acconto",
    pageFile: "app/calcolatori/acconto/page.tsx",
    primaryComponent: "components/AccontoCalculator.tsx",
    sharedModules: ["lib/tools/shared/index.ts"],
  },
  {
    id: "fattura",
    route: "/calcolatori/fattura",
    pageFile: "app/calcolatori/fattura/page.tsx",
    primaryComponent: "components/FatturaGenerator.tsx",
    sharedModules: ["lib/tools/shared/index.ts"],
  },
  {
    id: "ricevuta",
    route: "/calcolatori/ricevuta",
    pageFile: "app/calcolatori/ricevuta/page.tsx",
    primaryComponent: "app/calcolatori/ricevuta/RicevutaPageClient.tsx",
    sharedModules: ["lib/tools/shared/index.ts"],
  },
];
