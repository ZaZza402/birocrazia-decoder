import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  Search,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bur0 - Simulatore Regime Forfettario",
    description:
      "Simulatore fiscale per calcolare la convenienza tra Regime Forfettario e Ordinario. Report PDF gratuito con confronto dettagliato.",
    url: "https://bur0.click",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    featureList: [
      "Calcolo Regime Forfettario vs Ordinario",
      "Report PDF gratuito",
      "Visualizzazione Tax Cliff a €100k",
      "Simulazione con dati reali",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Freelancer, Partita IVA, Commercialisti",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quando conviene il Regime Forfettario?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Il Regime Forfettario conviene generalmente fino a €85.000 di fatturato annuo, con tassazione flat al 15% (5% per startup nei primi 5 anni). Oltre questa soglia si rischia l'esclusione e il passaggio forzato al Regime Ordinario con aliquote IRPEF progressive fino al 43%.",
        },
      },
      {
        "@type": "Question",
        name: "Cosa succede a €100.000 di fatturato?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Se si supera il limite di €100.000, si esce IMMEDIATAMENTE dal Regime Forfettario con effetto retroattivo. Questo significa ricalcolare tutte le tasse dell'anno in Regime Ordinario, con possibili sanzioni e conguagli.",
        },
      },
      {
        "@type": "Question",
        name: "Il simulatore è gratuito?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sì, il simulatore Bur0 è completamente gratuito. Include il report PDF dettagliato con tutti i calcoli da portare al commercialista. Non serve registrazione.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-stone-50">
        {/* ── HERO ── */}
        <section className="bg-zinc-950 text-white">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
            {/* Kicker */}
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span className="text-xs uppercase tracking-editorial font-semibold text-red-400">
                La Trappola degli €85.000 — Regime Forfettario 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight mb-6">
              Forfettario
              <br />
              <span className="text-red-500">o Ordinario?</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed">
              Scopri esattamente quanto stai regalando allo stato. Simulazione
              con i tuoi numeri reali, report PDF pronto per il commercialista.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/calcolatori/forfettario"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-editorial px-8 py-4 transition-colors group"
              >
                Avvia Simulazione Gratuita
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 text-xs text-zinc-500 uppercase tracking-editorial pt-3 sm:pt-4">
                <span>Gratis</span>
                <span className="w-px h-3 bg-zinc-700"></span>
                <span>2 minuti</span>
                <span className="w-px h-3 bg-zinc-700"></span>
                <span>PDF incluso</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── NUMBERS — THE EVIDENCE ── */}
        <section className="bg-white border-b border-zinc-200">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-10">
              Esempio reale — Fatturato €50.000, ATECO 67%
            </p>

            <div className="grid md:grid-cols-3 gap-0 border border-zinc-200">
              {/* Forfettario */}
              <div className="p-8 border-r border-zinc-200">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Regime Forfettario
                </p>
                <p className="text-5xl font-black font-mono tabular text-zinc-950 leading-none mb-2">
                  €36.242
                </p>
                <p className="text-sm text-zinc-500">Netto in tasca</p>
                <p className="text-xs text-zinc-400 mt-3">
                  Aliquota effettiva:{" "}
                  <strong className="text-zinc-700">27.5%</strong>
                </p>
              </div>

              {/* Ordinario */}
              <div className="p-8 border-r border-zinc-200">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Regime Ordinario
                </p>
                <p className="text-5xl font-black font-mono tabular text-zinc-950 leading-none mb-2">
                  €29.153
                </p>
                <p className="text-sm text-zinc-500">Netto in tasca</p>
                <p className="text-xs text-zinc-400 mt-3">
                  Aliquota effettiva:{" "}
                  <strong className="text-zinc-700">41.7%</strong>
                </p>
              </div>

              {/* Difference */}
              <div className="p-8 bg-zinc-950">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-500 mb-3">
                  Differenza annuale
                </p>
                <p className="text-5xl font-black font-mono tabular text-white leading-none mb-2">
                  €7.089
                </p>
                <p className="text-sm text-zinc-400">
                  Regalati allo stato ogni anno
                </p>
                <p className="text-xs text-red-400 mt-3 font-semibold">
                  In 5 anni: oltre €35.000
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOLS GRID ── */}
        <section className="bg-zinc-950 text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-500 mb-10">
              Strumenti disponibili
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
              {/* Tool 1 — Forfettario */}
              <Link
                href="/calcolatori/forfettario"
                className="group bg-zinc-950 hover:bg-zinc-900 transition-colors p-5 sm:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px]"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-editorial font-semibold text-green-500 mb-3 block">
                    Live
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    Simulatore
                    <br />
                    Forfettario vs Ordinario
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Calcola il netto con i tuoi numeri reali. Tax cliff a €100k.
                    Report PDF per il commercialista.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-editorial text-zinc-400 group-hover:text-white transition-colors">
                  Avvia simulazione
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Tool 2 — ATECO */}
              <Link
                href="/calcolatori/ateco"
                className="group bg-zinc-950 hover:bg-zinc-900 transition-colors p-5 sm:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px]"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-editorial font-semibold text-green-500 mb-3 block">
                    Live
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    Trova il tuo
                    <br />
                    Codice ATECO 2025
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Cerca per attività e trova il codice ufficiale + il
                    coefficiente di redditività per il Forfettario.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-editorial text-zinc-400 group-hover:text-white transition-colors">
                  <Search className="w-3.5 h-3.5" />
                  Cerca il tuo codice
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Tool 3 — Tax Cliff Monitor */}
              <Link
                href="/calcolatori/cliff"
                className="group bg-zinc-950 hover:bg-zinc-900 transition-colors p-5 sm:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px]"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-editorial font-semibold text-green-500 mb-3 block">
                    Live
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    Tax Cliff
                    <br />
                    Monitor {new Date().getFullYear()}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Traccia il fatturato mensile e monitora quanto sei lontano
                    dalla soglia di €100.000.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-editorial text-zinc-400 group-hover:text-white transition-colors">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Monitora il fatturato
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Tool 4 — Acconto */}
              <Link
                href="/calcolatori/acconto"
                className="group bg-zinc-950 hover:bg-zinc-900 transition-colors p-5 sm:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px]"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-editorial font-semibold text-green-500 mb-3 block">
                    Live
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    Acconto
                    <br />
                    Imposta Sostitutiva
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Calcola quanto pagare di acconto entro il 30 Novembre. Rate,
                    scadenze e codice F24.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-editorial text-zinc-400 group-hover:text-white transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  Calcola le rate
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── EXPLANATION ── */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                Perché succede
              </p>
              <h2 className="text-3xl font-black text-zinc-950 mb-4 leading-tight">
                Il problema che nessuno calcola prima
              </h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                Quando superi gli{" "}
                <strong className="text-zinc-900">€85.000 di fatturato</strong>,
                perdi automaticamente il regime forfettario l'anno successivo.
                Se superi
                <strong className="text-zinc-900"> €100.000</strong>, esci con
                effetto retroattivo sull'intero anno.
              </p>
              <p className="text-zinc-600 leading-relaxed">
                Nel regime ordinario l'IRPEF progressiva (23%, 35%, 43%) e le
                addizionali regionali ti mangiano quasi il doppio rispetto al
                forfettario. Pochissimi lo calcolano <em>prima</em> di trovarsi
                nella trappola.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                Caso B2C
              </p>
              <div className="border-l-2 border-red-500 pl-5">
                <h3 className="text-xl font-black text-zinc-950 mb-3">
                  Vendi a privati? La situazione è peggio.
                </h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  Se lavori con clienti privati (B2C), in regime ordinario devi
                  applicare l'IVA al 22% e girarla allo stato. Nel forfettario,
                  l'IVA non si applica.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Su €50.000 di fatturato B2C, questa differenza aggiunte alle
                  tasse porta la perdita annuale oltre{" "}
                  <strong className="text-zinc-900">€10.000</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bg-zinc-950 text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-500 mb-3">
                Simulatore Gratuito
              </p>
              <h2 className="text-4xl font-black leading-tight mb-2">
                Non indovinare.
                <br />
                Calcola.
              </h2>
              <p className="text-zinc-400 max-w-sm">
                Inserisci i tuoi numeri reali e scarica il report PDF per il tuo
                commercialista.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/calcolatori/forfettario"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-editorial px-8 py-4 transition-colors group"
              >
                Vai al Simulatore
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
