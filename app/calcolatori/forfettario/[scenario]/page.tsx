import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ForfettarioCalculator from "@/components/ForfettarioCalculator";
import { SCENARIOS } from "@/lib/scenarios";
import { formatCurrency } from "@/lib/forfettario-utils";
import { ATECO_BY_CODE, getAtecoSlug } from "@/lib/ateco-data";

type Params = Promise<{ scenario: string }>;

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ scenario: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { scenario: slug } = await params;
  const scenario = SCENARIOS.find((s) => s.slug === slug);
  if (!scenario) return {};

  return {
    title: `${scenario.title} | BurZero`,
    description: scenario.description,
    alternates: {
      canonical: `/calcolatori/forfettario/${scenario.slug}`,
    },
    openGraph: {
      title: `${scenario.title} | BurZero`,
      description: scenario.description,
      url: `https://www.bur0.click/calcolatori/forfettario/${scenario.slug}`,
      type: "website",
    },
  };
}

export default async function ScenarioPage({ params }: { params: Params }) {
  const { scenario: slug } = await params;
  const scenario = SCENARIOS.find((s) => s.slug === slug);

  if (!scenario) notFound();

  const atecoEntry = ATECO_BY_CODE[scenario.atecoCode];
  const cassaLabel =
    scenario.inputs.cassaType === "gestione_separata"
      ? "Gestione Separata INPS"
      : scenario.inputs.cassaType === "artigiani"
        ? "INPS Artigiani"
        : scenario.inputs.cassaType === "commercianti"
          ? "INPS Commercianti"
          : "Cassa professionale o aliquota personalizzata";
  const clientLabel =
    scenario.inputs.clientType === "b2c" ? "privati (B2C)" : "aziende (B2B)";

  return (
    <>
      <ForfettarioCalculator
        scenarioLabel={`${scenario.profession} - ${formatCurrency(scenario.inputs.expectedRevenue)}/anno`}
        initialInputs={{
          atecoCode: scenario.atecoCode,
          cassaType: scenario.inputs.cassaType,
          isNewBusiness: scenario.inputs.isNewBusiness,
          expectedRevenue: scenario.inputs.expectedRevenue,
          realExpenses: scenario.inputs.realExpenses,
          previousYearINPS: scenario.inputs.previousYearINPS,
          clientType: scenario.inputs.clientType,
        }}
      />

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl space-y-8 px-6 py-14">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-editorial text-zinc-600">
              Scenario {scenario.profession}
            </p>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950">
              Tasse e netto con{" "}
              {formatCurrency(scenario.inputs.expectedRevenue)} di fatturato
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Questa simulazione parte da un fatturato annuo di{" "}
              <strong>{formatCurrency(scenario.inputs.expectedRevenue)}</strong>{" "}
              e confronta il Regime Forfettario con il Regime Ordinario per{" "}
              {scenario.profession.toLowerCase()}. Il risultato è una stima
              orientativa: verifica sempre la tua posizione con un
              professionista.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-px bg-zinc-200 sm:grid-cols-2">
            <div className="bg-stone-50 p-4">
              <dt className="text-xs uppercase tracking-editorial text-zinc-500">
                Codice ATECO
              </dt>
              <dd className="mt-1 font-mono text-sm font-bold text-zinc-950">
                {scenario.atecoCode}
              </dd>
            </div>
            <div className="bg-stone-50 p-4">
              <dt className="text-xs uppercase tracking-editorial text-zinc-500">
                Coefficiente
              </dt>
              <dd className="mt-1 text-sm font-bold text-zinc-950">
                {scenario.inputs.atecoCoefficient * 100}%
              </dd>
            </div>
            <div className="bg-stone-50 p-4">
              <dt className="text-xs uppercase tracking-editorial text-zinc-500">
                Previdenza
              </dt>
              <dd className="mt-1 text-sm font-bold text-zinc-950">
                {cassaLabel}
              </dd>
            </div>
            <div className="bg-stone-50 p-4">
              <dt className="text-xs uppercase tracking-editorial text-zinc-500">
                Clientela stimata
              </dt>
              <dd className="mt-1 text-sm font-bold text-zinc-950">
                {clientLabel}
              </dd>
            </div>
          </dl>

          <div className="space-y-3 text-sm leading-relaxed text-zinc-600">
            <p>
              La simulazione considera anche{" "}
              {formatCurrency(scenario.inputs.realExpenses)} di spese reali
              annue. Nel Forfettario queste spese non riducono il reddito
              imponibile, ma incidono comunque sul denaro che resta;
              nell&apos;Ordinario vengono invece considerate nel confronto.
            </p>
            <p>
              Il coefficiente indica la quota del fatturato che forma il reddito
              imponibile nel Forfettario. Non sostituisce la verifica del codice
              ATECO effettivamente applicabile alla tua attività.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 border-t border-stone-200 pt-6 text-sm font-bold">
            {atecoEntry && (
              <Link
                href={`/calcolatori/ateco/${getAtecoSlug(atecoEntry)}`}
                className="text-red-600 transition-colors hover:text-red-700"
              >
                Verifica il codice ATECO {scenario.atecoCode}
              </Link>
            )}
            <Link
              href="/calcolatori/forfettario"
              className="text-zinc-700 transition-colors hover:text-zinc-950"
            >
              Crea una simulazione personalizzata
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
