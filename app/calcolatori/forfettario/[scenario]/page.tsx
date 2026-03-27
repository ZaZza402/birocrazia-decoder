import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ForfettarioCalculator from "@/components/ForfettarioCalculator";
import { SCENARIOS } from "@/lib/scenarios";
import { formatCurrency } from "@/lib/forfettario-utils";

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
    title: `${scenario.title} | Bur0`,
    description: scenario.description,
    alternates: {
      canonical: `/calcolatori/forfettario/${scenario.slug}`,
    },
    openGraph: {
      title: `${scenario.title} | Bur0`,
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

  return (
    <ForfettarioCalculator
      scenarioLabel={`${scenario.profession} — ${formatCurrency(scenario.inputs.expectedRevenue)}/anno`}
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
  );
}
