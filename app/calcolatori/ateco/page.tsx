import AtecoFinder from "@/components/AtecoFinder";

export default function AtecoPage() {
  return (
    <>
      <AtecoFinder />
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              Cos&#8217;è il codice ATECO e perché è importante per il
              Forfettario
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Il codice ATECO (Attività Economiche) identifica la categoria di
              attività svolta da un&#8217;impresa o un professionista. In
              Italia, la classificazione ATECO deriva dalla nomenclatura europea
              NACE ed è aggiornata periodicamente dall&#8217;ISTAT. Per chi è in
              regime forfettario, il codice ATECO è determinante perché a ogni
              codice corrisponde un <strong>coefficiente di redditività</strong>{" "}
              con cui si calcola la base imponibile.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Come funziona il coefficiente di redditività
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Il coefficiente viene moltiplicato per i ricavi lordi per ottenere
              il reddito imponibile forfettario. I coefficienti principali sono:
            </p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>
                <strong>86%</strong> — Commercio al dettaglio (es. ATECO 47.xx)
              </li>
              <li>
                <strong>78%</strong> — Professioni tecniche, informatiche,
                scientifiche (es. sviluppatori, ingegneri, architetti)
              </li>
              <li>
                <strong>67%</strong> — Professioni sanitarie, insegnamento,
                attività professionali generali
              </li>
              <li>
                <strong>40%</strong> — Commercio all&#8217;ingrosso e al
                dettaglio, intermediari
              </li>
            </ul>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Più basso è il coefficiente, minore è la quota tassata: un
              coefficiente del 67% significa che il 33% del fatturato è
              considerato spesa forfettaria non imponibile.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Come trovare il codice ATECO corretto
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Cerca la tua attività nella barra qui sopra: il motore di ricerca
              confronta la descrizione che inserisci con la tabella ufficiale
              ATECO 2025. Una volta trovato il codice, potrai usare il
              simulatore forfettario per stimare le tue tasse con il
              coefficiente esatto. In caso di dubbio su quale codice usare, ti
              consigliamo di consultare un commercialista o il tuo CAF: è la
              Camera di Commercio che attribuisce il codice principale al
              momento dell&#8217;apertura della Partita IVA.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
