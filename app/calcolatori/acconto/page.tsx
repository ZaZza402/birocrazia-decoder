import AccontoCalculator from "@/components/AccontoCalculator";

type SearchParams = Promise<{ tax?: string }>;

export default async function AccontoPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolved = await (searchParams ??
    Promise.resolve({} as { tax?: string }));
  const initialTax = resolved.tax ? parseFloat(resolved.tax) : undefined;
  const validTax =
    initialTax !== undefined && isFinite(initialTax) && initialTax > 0
      ? initialTax
      : undefined;

  return (
    <>
      <AccontoCalculator initialTax={validTax} />
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              Acconto imposta sostitutiva: cos&#8217;è e quando si paga
            </h2>
            <p className="text-stone-600 leading-relaxed">
              I titolari di Partita IVA in regime forfettario non pagano
              l&#8217;IRPEF ma versano un&#8217;
              <strong>imposta sostitutiva</strong> del 15% (o 5% per le
              startup). Come per l&#8217;IRPEF, anche questa imposta prevede il
              pagamento di un acconto per l&#8217;anno in corso, determinato in
              base all&#8217;imposta dell&#8217;anno precedente. L&#8217;acconto
              si versa in <strong>due rate</strong>: la prima entro il{" "}
              <strong>30 giugno</strong> (o luglio con maggiorazione dello
              0,40%), la seconda entro il <strong>30 novembre</strong>.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Metodo storico vs metodo previsionale
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Con il <strong>metodo storico</strong>, l&#8217;acconto totale è
              pari al{" "}
              <strong>
                100% dell&#8217;imposta pagata l&#8217;anno precedente
              </strong>
              . Con il <strong>metodo previsionale</strong>, puoi stimare
              l&#8217;imposta dell&#8217;anno in corso e versare il 100% di
              quella: conveniente se prevedi ricavi inferiori all&#8217;anno
              prima. Attenzione: se sottostimi, potresti trovarti a pagare
              sanzioni e interessi a saldo.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Primo anno di attività: nessun acconto
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Nel primo anno di apertura della Partita IVA non è dovuto alcun
              acconto, poiché non esiste un&#8217;imposta di riferimento
              dell&#8217;anno precedente. Dal secondo anno in poi,
              l&#8217;obbligo scatta se l&#8217;imposta dovuta supera €51,65.
              Questo calcolatore ti aiuta a stimare le rate giuste inserendo
              l&#8217;imposta sostitutiva dell&#8217;anno scorso.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
