import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Bur0",
  description: "Informativa Privacy - Local-First, Zero Tracking",
};

export default function PrivacyPage() {
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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              Informativa Privacy
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-8">
              <p className="text-sm font-bold text-green-900 mb-2">
                In Breve: Non Spiamo Nessuno
              </p>
              <p className="text-sm text-green-800">
                I tuoi dati fiscali non escono mai dal tuo browser. Non abbiamo
                server che conservano le tue informazioni. Tutto resta sul tuo
                dispositivo.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                1. Titolare del Trattamento
              </h2>
              <p className="text-slate-700 leading-relaxed">
                <strong>Bur0</strong>
                <br />
                Per qualsiasi richiesta:{" "}
                <a
                  href="mailto:info@alecsdesign.xyz?subject=Supporto%20Bur0"
                  className="text-indigo-600 hover:underline"
                >
                  Scrivici qui
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                2. Dati Trattati e Modalità
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Bur0 opera secondo un approccio <strong>"Local-First"</strong>.
              </p>

              <div className="bg-slate-50 rounded-lg p-6 mb-4">
                <h3 className="font-bold text-slate-900 mb-3">
                  Dati inseriti dall'utente
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  I dati fiscali (fatturato, spese, codice ATECO, ecc.) vengono
                  elaborati <strong>esclusivamente dal browser</strong> del
                  dispositivo dell'utente. Nessun dato viene inviato, salvato o
                  archiviato sui nostri server.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-3">Dati tecnici</h3>
                <p className="text-slate-700 leading-relaxed">
                  Il sistema di hosting (Vercel) potrebbe raccogliere log
                  tecnici anonimi (indirizzi IP) per fini di sicurezza e
                  diagnostica. Questi dati non contengono alcuna informazione
                  personale identificabile.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                3. Cookie e Local Storage
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Utilizziamo il <strong>"Local Storage"</strong> del browser per
                salvare le tue preferenze (es. input salvati, consenso cookie)
                esclusivamente sul tuo dispositivo.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Questi dati <strong>non sono accessibili a noi</strong>. Sono
                salvati solo nel tuo browser e puoi eliminarli cancellando la
                cache.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                4. Diritti dell'Interessato
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Poiché non conserviamo i tuoi dati personali, non possiamo
                cancellarli o modificarli: sono{" "}
                <strong>solo sul tuo dispositivo</strong>. Puoi eliminarli in
                qualsiasi momento cancellando i dati del sito nelle impostazioni
                del browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                5. Sicurezza
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Tutto il codice viene eseguito in modalità client-side
                (JavaScript nel browser). Non memorizziamo password, dati di
                pagamento o informazioni sensibili perché non esiste un sistema
                di account o registrazione.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                6. Modifiche
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Ci riserviamo il diritto di aggiornare questa informativa per
                riflettere modifiche alle pratiche o alla normativa. L'ultima
                revisione sarà sempre disponibile su questa pagina.
              </p>
            </section>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-indigo-900 font-medium">
                <strong>Data ultima revisione:</strong> 10 Dicembre 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
