import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Termini e Condizioni | Bur0",
  description: "Termini di Utilizzo - Strumento di Simulazione Fiscale",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              Termini e Condizioni di Utilizzo
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                1. Scopo del Servizio
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                <strong>Bur0</strong> è uno strumento di{" "}
                <strong>simulazione e stima</strong> fiscale. I risultati
                forniti (incluso il report PDF) sono basati sulla normativa
                vigente al momento dell'aggiornamento, ma hanno valore{" "}
                <strong>puramente indicativo</strong>.
              </p>
              <p className="text-slate-700 leading-relaxed">
                L'obiettivo è fornire un'anteprima delle differenze tra Regime
                Forfettario e Regime Ordinario, ma non sostituisce la consulenza
                professionale.
              </p>
            </section>

            <section className="mb-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">
                      2. Limitazione di Responsabilità (IMPORTANTE)
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      L'utente riconosce e accetta esplicitamente che:
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 ml-4">
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Bur0 non sostituisce</strong> il parere di un
                    commercialista, di un consulente fiscale o di un CAF (Centro
                    di Assistenza Fiscale).
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700 leading-relaxed">
                    L'autore{" "}
                    <strong>non si assume alcuna responsabilità</strong> per
                    sanzioni, errori nelle dichiarazioni dei redditi, perdite
                    finanziarie o danni derivanti dall'uso di questo strumento.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700 leading-relaxed">
                    L'utente è <strong>l'unico responsabile</strong> della
                    verifica dei dati e della consultazione con un
                    professionista prima di prendere decisioni fiscali o
                    dichiarative.
                  </p>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                3. Accuratezza dei Calcoli
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Gli algoritmi di calcolo sono basati sulla normativa italiana
                vigente al momento della pubblicazione. Tuttavia:
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700 leading-relaxed">
                    Le leggi fiscali cambiano frequentemente
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700 leading-relaxed">
                    Possono esistere casi particolari non contemplati
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700 leading-relaxed">
                    Addizionali regionali/comunali variano per comune
                  </p>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                Ci impegniamo a mantenere lo strumento aggiornato, ma non
                garantiamo che i calcoli siano sempre corretti al 100%.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                4. Modifiche al Servizio
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Ci riserviamo il diritto di modificare, aggiornare o
                interrompere il servizio (o parti di esso) in qualsiasi momento
                e senza preavviso. Gli algoritmi di calcolo possono essere
                modificati per riflettere aggiornamenti normativi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                5. Proprietà Intellettuale
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Tutti i contenuti, il codice, il design e i calcoli di Bur0 sono
                di proprietà esclusiva dell'autore. È vietata la riproduzione,
                distribuzione o uso commerciale senza autorizzazione scritta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                6. Uso Accettabile
              </h2>
              <p className="text-slate-700 leading-relaxed">
                L'utente si impegna a utilizzare Bur0 in modo lecito e conforme
                alla legge. È vietato:
              </p>
              <ul className="space-y-2 ml-4 mt-3">
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">
                    Tentare di violare la sicurezza del sito
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">
                    Copiare o reverse-engineering del codice
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p className="text-slate-700">
                    Utilizzare il servizio per scopi illegali
                  </p>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                7. Legge Applicabile
              </h2>
              <p className="text-slate-700 leading-relaxed">
                I presenti Termini e Condizioni sono regolati dalla legge
                italiana. Per qualsiasi controversia sarà competente
                esclusivamente il Foro di [Inserisci Città].
              </p>
            </section>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-purple-900 font-medium mb-2">
                <strong>Data ultima revisione:</strong> 10 Dicembre 2025
              </p>
              <p className="text-sm text-purple-800">
                Utilizzando Bur0, accetti questi Termini e Condizioni nella loro
                interezza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
