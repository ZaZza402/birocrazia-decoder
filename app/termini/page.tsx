import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termini e Condizioni | Bur0",
  description: "Termini di Utilizzo — Strumento di Simulazione Fiscale",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* â”€â”€ HEADER â”€â”€ */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            Termini di Utilizzo — bur0.click
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            Termini e Condizioni
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Bur0 &egrave; uno strumento di simulazione fiscale a scopo
            informativo. Non sostituisce la consulenza di un commercialista.
          </p>
        </div>

        {/* â”€â”€ DISCLAIMER BOX â”€â”€ */}
        <div className="bg-white border border-zinc-200 border-l-4 border-l-red-600 p-5 mb-10">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
            Importante
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed">
            I risultati forniti da Bur0 hanno valore
            <strong className="text-zinc-900"> puramente indicativo</strong>.
            L&apos;utente &egrave; l&apos;unico responsabile delle proprie
            scelte fiscali e della verifica con un professionista abilitato.
          </p>
        </div>

        <div className="space-y-8">
          {/* 1 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              01
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Scopo del Servizio
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Bur0</strong> &egrave; uno
              strumento di{" "}
              <strong className="text-zinc-900">simulazione e stima</strong>{" "}
              fiscale gratuito. I risultati (inclusi i report PDF) sono basati
              sulla normativa vigente al momento dell&apos;aggiornamento ma
              hanno finalit&agrave; esclusivamente orientativa. Non
              sostituiscono la consulenza di un commercialista, consulente
              fiscale o CAF.
            </p>
          </section>

          {/* 2 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              02
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Limitazione di Responsabilit&agrave;
            </h2>
            <div className="space-y-3">
              {[
                "Bur0 non sostituisce il parere di un commercialista o consulente fiscale.",
                "L'autore non si assume alcuna responsabilit\u00e0 per sanzioni, errori dichiarativi, perdite finanziarie o danni derivanti dall'uso di questo strumento.",
                "L'utente \u00e8 l'unico responsabile della verifica dei dati e della consultazione con un professionista prima di qualsiasi decisione fiscale.",
              ].map((text, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-zinc-300 font-mono font-black flex-shrink-0 pt-0.5">
                    &mdash;
                  </span>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              03
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Accuratezza dei Calcoli
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed mb-3">
              Gli algoritmi sono basati sulla normativa italiana vigente al
              momento della pubblicazione. Tuttavia le leggi fiscali cambiano
              frequentemente, possono esistere casi particolari non contemplati
              e le addizionali regionali/comunali variano per comune. Ci
              impegniamo a mantenere lo strumento aggiornato ma non garantiamo
              la correttezza assoluta dei risultati.
            </p>
          </section>

          {/* 4 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              04
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Modifiche al Servizio
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Ci riserviamo il diritto di modificare, aggiornare o interrompere
              il servizio in qualsiasi momento senza preavviso. Gli algoritmi di
              calcolo possono essere modificati per riflettere aggiornamenti
              normativi.
            </p>
          </section>

          {/* 5 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              05
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Propriet&agrave; Intellettuale
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Tutti i contenuti, il codice, il design e gli algoritmi di Bur0
              sono di propriet&agrave; esclusiva dell&apos;autore. &Egrave;
              vietata la riproduzione, distribuzione o uso commerciale senza
              autorizzazione scritta.
            </p>
          </section>

          {/* 6 */}
          <section className="border-b border-zinc-100 pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              06
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Uso Accettabile
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed mb-3">
              L&apos;utente si impegna a utilizzare Bur0 in modo lecito.
              &Egrave; vietato tentare di violare la sicurezza del sito,
              effettuare reverse-engineering del codice o utilizzare il servizio
              per scopi illegali.
            </p>
          </section>

          {/* 7 */}
          <section className="pb-8">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
              07
            </p>
            <h2 className="text-xl font-black text-zinc-950 mb-3">
              Legge Applicabile
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              I presenti Termini sono regolati dalla legge italiana. Per
              qualsiasi controversia sar&agrave; competente il foro di
              competenza territoriale dell&apos;autore.
            </p>
          </section>
        </div>

        {/* â”€â”€ FOOTER ROW â”€â”€ */}
        <div className="mt-8 pt-6 border-t border-zinc-200 flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            Ultima revisione: Marzo 2026 &mdash; Utilizzando Bur0 accetti questi
            Termini.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
