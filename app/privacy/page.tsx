import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Bur0",
  description: "Informativa Privacy — Local-First, Zero Tracking",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* â”€â”€ HEADER â”€â”€ */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            Privacy Policy — bur0.click
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            I tuoi dati restano tuoi
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Bur0 non raccoglie, non trasmette e non conserva alcun dato fiscale.
            Tutto viene elaborato localmente nel tuo browser.
          </p>
        </div>

        {/* â”€â”€ HIGHLIGHT â”€â”€ */}
        <div className="bg-white border border-zinc-200 border-l-4 border-l-zinc-950 p-5 mb-10">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
            In breve
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed">
            I tuoi dati fiscali (fatturato, spese, ATECO, ecc.) non escono mai
            dal tuo dispositivo. Non abbiamo server che li archiviano. Non
            esistono account, registrazioni o profilazioni.
          </p>
        </div>

        <div className="space-y-8">
          {/* 1 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              01
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Titolare del Trattamento
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Bur0</strong> — per qualsiasi
              richiesta:{" "}
              <a
                href="mailto:info@alecsdesign.xyz?subject=Privacy%20Bur0"
                className="underline underline-offset-2 hover:text-zinc-900 transition-colors"
              >
                info@alecsdesign.xyz
              </a>
            </p>
          </section>

          {/* 2 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              02
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Dati Trattati
            </h2>
            <div className="space-y-4">
              <div className="bg-white border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-editorial text-zinc-400 mb-1">
                  Dati inseriti dall&apos;utente
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Tutti i dati fiscali (fatturato, spese, codice ATECO, ecc.)
                  vengono elaborati{" "}
                  <strong className="text-zinc-900">
                    esclusivamente nel browser
                  </strong>
                  . Non vengono mai inviati a server esterni.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-editorial text-zinc-400 mb-1">
                  Dati tecnici
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Il provider di hosting (Vercel) raccoglie log tecnici anonimi
                  (indirizzi IP) per fini di sicurezza e diagnostica. Questi
                  dati non includono informazioni personali identificabili.
                </p>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              03
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Cookie e Local Storage
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Usiamo il <strong className="text-zinc-900">Local Storage</strong>{" "}
              del browser esclusivamente per salvare preferenze locali (es. dati
              del Tax Cliff Monitor, consenso cookie banner). Questi dati non ci
              sono accessibili e puoi eliminarli cancellando la cache del
              browser in qualsiasi momento.
            </p>
          </section>

          {/* 4 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              04
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              I Tuoi Diritti
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Non conserviamo i tuoi dati personali sui nostri server, quindi
              non possiamo modificarli o cancellarli a richiesta —
              semplicemente non esistono da noi. Puoi eliminarli in autonomia
              cancellando i dati del sito nelle impostazioni del browser.
            </p>
          </section>

          {/* 5 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              05
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">Sicurezza</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Tutto il codice viene eseguito in modalit&agrave; client-side
              (JavaScript nel browser). Non esistono sistemi di account,
              autenticazione o archiviazione di dati di pagamento.
            </p>
          </section>

          {/* 6 */}
          <section className="pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              06
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">Modifiche</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Ci riserviamo il diritto di aggiornare questa informativa per
              riflettere modifiche alle pratiche o alla normativa. L&apos;ultima
              revisione sar&agrave; sempre disponibile su questa pagina.
            </p>
          </section>
        </div>

        {/* â”€â”€ FOOTER ROW â”€â”€ */}
        <div className="mt-8 pt-6 border-t border-zinc-200 flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">Ultima revisione: Marzo 2026</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
