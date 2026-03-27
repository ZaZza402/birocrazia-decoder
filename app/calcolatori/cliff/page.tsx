import CliffTracker from "@/components/CliffTracker";

export default function CliffPage() {
  return (
    <>
      <CliffTracker />
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              La Tax Cliff del Forfettario: €85.000 e €100.000
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Per i titolari di Partita IVA in regime forfettario esistono due
              soglie critiche di ricavo annuo. La prima è{" "}
              <strong>€85.000</strong>: superarla comporta l&#8217;obbligo di
              transitare al regime ordinario a partire dal{" "}
              <strong>1° gennaio dell&#8217;anno successivo</strong>. La seconda
              è <strong>€100.000</strong>: superarla durante l&#8217;anno
              provoca un&#8217;uscita immediata dal forfettario, con
              applicazione dell&#8217;IVA sulle fatture emesse dopo il
              superamento della soglia.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Perché si chiama &#8220;cliff&#8221; (scogliera)?
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Il regime forfettario prevede un&#8217;aliquota sostitutiva fissa
              del 15% (o 5% per le startup). Il regime ordinario, invece,
              applica l&#8217;IRPEF progressiva: 23% fino a €28.000, 35% fino a
              €50.000, 43% oltre. La transizione brusca da un regime vantaggioso
              a uno molto più oneroso crea un &#8220;salto&#8221; di pressione
              fiscale che può rendere controproducente aumentare i ricavi oltre
              la soglia, almeno nell&#8217;immediato.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Gestire la soglia in modo proattivo
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Se prevedi di avvicinarti a €85.000, pianifica con anticipo:
              alcune strategie includono il rinvio dell&#8217;incasso di
              compensi a gennaio (principio di cassa), la valutazione di costi
              deducibili nel regime ordinario (dipendenti, attrezzature, auto) e
              l&#8217;analisi del netto effettivo post-transizione. Questo
              strumento mostra in tempo reale quanto ti manca alla soglia e il
              tuo tasso di avanzamento mensile.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
