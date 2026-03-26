import AccontoCalculator from "@/components/AccontoCalculator";

type SearchParams = Promise<{ tax?: string }>;

export default async function AccontoPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolved = await (searchParams ?? Promise.resolve({} as { tax?: string }));
  const initialTax = resolved.tax ? parseFloat(resolved.tax) : undefined;
  const validTax =
    initialTax !== undefined && isFinite(initialTax) && initialTax > 0
      ? initialTax
      : undefined;

  return <AccontoCalculator initialTax={validTax} />;
}
