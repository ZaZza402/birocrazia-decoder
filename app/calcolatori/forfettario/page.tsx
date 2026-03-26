import ForfettarioCalculator from "@/components/ForfettarioCalculator";
import type { CassaType } from "@/lib/forfettario-utils";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ForfettarioPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const p = await searchParams;

  const rev = parseFloat(str(p.rev) ?? "");
  const spese = parseFloat(str(p.spese) ?? "");
  const inps = parseFloat(str(p.inps) ?? "");

  const cassaRaw = str(p.cassa);
  const validCassas: CassaType[] = [
    "gestione_separata",
    "artigiani_commercianti",
    "custom",
  ];
  const cassa = validCassas.includes(cassaRaw as CassaType)
    ? (cassaRaw as CassaType)
    : undefined;

  const tipoRaw = str(p.tipo);
  const clientType =
    tipoRaw === "b2b" || tipoRaw === "b2c" ? tipoRaw : undefined;

  const hasParams = Object.keys(p).length > 0;

  return (
    <ForfettarioCalculator
      initialInputs={
        hasParams
          ? {
              atecoCode: str(p.ateco),
              cassaType: cassa,
              isNewBusiness: str(p.startup) === "1",
              expectedRevenue: isNaN(rev)
                ? undefined
                : Math.max(20000, Math.min(120000, rev)),
              realExpenses: isNaN(spese) ? undefined : Math.max(0, spese),
              previousYearINPS: isNaN(inps) ? undefined : Math.max(0, inps),
              clientType,
            }
          : undefined
      }
    />
  );
}
