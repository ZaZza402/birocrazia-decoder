import { Metadata } from "next";
import RicevutaPageClient from "./RicevutaPageClient";

export const metadata: Metadata = {
  title: "Generatore Ricevute Prestazione Occasionale 2026 | Bur0",
  description:
    "Crea ricevute perfette per prestazioni occasionali. Calcolo automatico ritenuta 20%, alert marca da bollo, monitoraggio limite €5.000. PDF professionale in 3 click.",
  keywords:
    "ricevuta prestazione occasionale, calcolo ritenuta d'acconto, marca da bollo ricevuta, limite 5000 euro prestazioni, generatore ricevute pdf, ricevuta professionale, prestazione occasionale 2026, calcolo netto lordo prestazione, ritenuta 20%, ricevuta fiscale",
  openGraph: {
    title: "Generatore Ricevute Prestazione Occasionale | Bur0",
    description:
      "Smetti di usare template Word rotti. Crea ricevute fiscalmente perfette con calcolo automatico della ritenuta e monitoraggio dei limiti.",
    url: "https://www.bur0.click/calcolatori/ricevuta",
    type: "website",
  },
};

export default function RicevutaPage() {
  return (
    <>
      <RicevutaPageClient />
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              Prestazione occasionale: cos&#8217;è e come funziona la ricevuta
            </h2>
            <p className="text-stone-600 leading-relaxed">
              La <strong>prestazione occasionale</strong> (art. 2222 c.c.)
              consente di svolgere attività lavorativa autonoma saltuaria senza
              aprire una Partita IVA, a patto di non superare{" "}
              <strong>€5.000 lordi annui</strong> per committente. Il lavoratore
              emette una ricevuta (non una fattura) e il committente applica una{" "}
              <strong>ritenuta d&#8217;acconto del 20%</strong>, che versa
              all&#8217;Erario per suo conto. Il lavoratore intasca il netto e
              in sede di dichiarazione dei redditi può recuperare la ritenuta
              come credito.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              La marca da bollo: quando è obbligatoria
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Occorre applicare una <strong>marca da bollo da €2,00</strong>{" "}
              sulla ricevuta quando il compenso lordo supera{" "}
              <strong>€77,47</strong>. La marca deve essere apposta sulla copia
              originale consegnata al committente. In caso di ricevuta digitale,
              la marca da bollo telematica equivalente deve essere acquistata
              presso un tabaccaio autorizzato e il numero seriale indicato sul
              documento.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Limite €5.000 e contributi INPS
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Il limite di €5.000 si calcola per singolo committente nel corso
              dell&#8217;anno solare. Se lavori per più committenti, ogni
              rapporto ha il proprio contatore. Superata la soglia complessiva
              di €5.000 (o quella del singolo committente che supera i redditi
              da lavoro autonomo occasionale), scattano gli obblighi
              contributivi INPS: il committente deve iscrivere il lavoratore
              alla Gestione Separata per i compensi eccedenti. Questo
              calcolatore ti avvisa quando ti avvicini al limite.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
