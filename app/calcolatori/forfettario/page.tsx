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
    "artigiani",
    "commercianti",
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
    <>
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
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              Regime Forfettario 2026: come funziona il calcolo
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Il regime forfettario è un regime fiscale agevolato per i titolari
              di Partita IVA con ricavi o compensi fino a{" "}
              <strong>€85.000 annui</strong>. Sostituisce IRPEF, addizionali
              regionali e comunali con un&#8217;unica{" "}
              <strong>imposta sostitutiva del 15%</strong> (ridotta al{" "}
              <strong>5% per i primi cinque anni</strong> di attività, se si
              avvia un&#8217;impresa ex novo senza aver esercitato attività
              artistica, professionale o d&#8217;impresa nei tre anni
              precedenti).
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Come viene calcolata la base imponibile
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Non si tassano i ricavi lordi, ma un reddito imponibile calcolato
              moltiplicando i ricavi per il{" "}
              <strong>coefficiente di redditività</strong> del tuo codice ATECO.
              Ad esempio, un consulente IT (ATECO 62.01.09) ha coefficiente 78%:
              su €60.000 di fatturato l&#8217;imponibile è €46.800, con imposta
              sostitutiva al 15% pari a €7.020. Le spese reali non sono
              deducibili (salvo contributi INPS dell&#8217;anno precedente).
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              INPS: gestione separata, artigiani e commercianti
            </h3>
            <p className="text-stone-600 leading-relaxed">
              I contribuenti forfettari versano i contributi previdenziali sul
              reddito forfettizzato. La <strong>Gestione Separata INPS</strong>{" "}
              (professionisti senza cassa) applica un&#8217;aliquota intorno al
              26,23%. Artigiani e commercianti applicano aliquote leggermente
              diverse con un minimale contributivo anche a redditi bassi. I
              contributi INPS versati nell&#8217;anno precedente si deducono
              dall&#8217;imponibile (principio di cassa).
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              La tax cliff a €85.000 e l&#8217;uscita a €100.000
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Se i ricavi superano €85.000 in un anno, si esce dal forfettario
              dall&#8217;<strong>anno successivo</strong> e si passa al regime
              ordinario, con IRPEF progressiva (23%–43%) e deduzione analitica
              delle spese. Se si supera la soglia di{" "}
              <strong>€100.000 nello stesso anno</strong>, l&#8217;uscita è
              immediata: si transita al regime ordinario già dall&#8217;anno in
              corso, con obbligo di applicare IVA sulle fatture successive.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Forfettario vs Ordinario: quando conviene quale?
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Il forfettario conviene quando le spese reali sono basse
              (inferiori alla quota forfettizzata non imponibile) e i ricavi
              sono ben al di sotto di €85.000. Il regime ordinario diventa
              conveniente al crescere dei costi deducibili—spese per dipendenti,
              affitti professionali, ammortamenti—o quando si avvicina la soglia
              cliff. Il simulatore qui sopra calcola entrambe le opzioni con i
              tuoi dati reali.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
