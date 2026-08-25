import "../LandingPage.css";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  Search,
  TrendingUp,
  Calendar,
  FileText,
  BookOpen,
  Calculator,
  ChevronDown,
} from "lucide-react";
import InstallAppButton from "@/components/InstallAppButton";

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BurZero - Simulatore Regime Forfettario",
    description:
      "Simulatore fiscale per calcolare la convenienza tra Regime Forfettario e Ordinario. Report PDF gratuito con confronto dettagliato.",
    url: "https://www.bur0.click",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    featureList: [
      "Calcolo Regime Forfettario vs Ordinario",
      "Report PDF gratuito",
      "Visualizzazione Tax Cliff a €85.000",
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
          text: "Sì, il simulatore BurZero è completamente gratuito. Include il report PDF dettagliato con tutti i calcoli da portare al commercialista. Non serve registrazione.",
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
                Il Salto degli €85.000 - Regime Forfettario 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight mb-6">
              Forfettario
              <br />
              <span className="text-red-500">o Ordinario?</span>
            </h1>

            <p className="text-lg text-zinc-600 max-w-xl mb-10 leading-relaxed">
              Simula il passaggio di regime con i tuoi numeri reali. Pianifica
              la crescita senza sorprese fiscali - report PDF pronto per il
              commercialista.
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

        {/* ── NUMBERS - THE EVIDENCE ── */}
        <section className="bg-white border-b border-zinc-200">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-10">
              Esempio reale - Fatturato €50.000, ATECO 67%, senza spese
              aziendali
            </p>

            <div className="grid md:grid-cols-3 gap-0 border border-zinc-200">
              {/* Forfettario */}
              <div className="p-8 border-r border-zinc-200">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-3">
                  Regime Forfettario
                </p>
                <p className="text-5xl font-black font-mono tabular text-zinc-950 leading-none mb-2">
                  €36.242
                </p>
                <p className="text-sm text-zinc-500">Netto in tasca</p>
                <p className="text-xs text-zinc-600 mt-3">
                  Aliquota effettiva:{" "}
                  <strong className="text-zinc-700">27.5%</strong>
                </p>
              </div>

              {/* Ordinario */}
              <div className="p-8 border-r border-zinc-200">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-3">
                  Regime Ordinario
                </p>
                <p className="text-5xl font-black font-mono tabular text-zinc-950 leading-none mb-2">
                  €29.153
                </p>
                <p className="text-sm text-zinc-500">Netto in tasca</p>
                <p className="text-xs text-zinc-600 mt-3">
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
                <p className="text-sm text-zinc-600">
                  Regalati allo stato ogni anno
                </p>
                <p className="text-xs text-red-400 mt-3 font-semibold">
                  In 5 anni: oltre €35.000
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── PEACE OF MIND ── */}
        <section className="border-b border-zinc-200">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-10">
              I tuoi dati
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-200">
              <div className="bg-stone-50 px-6 py-7">
                <p className="text-sm font-black text-zinc-950 mb-2">
                  Nessun account.
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Niente registrazione, niente email, niente password. Apri il
                  sito e inizia - basta.
                </p>
              </div>
              <div className="bg-stone-50 px-6 py-7">
                <p className="text-sm font-black text-zinc-950 mb-2">
                  Tutto resta sul tuo dispositivo.
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  I numeri che inserisci non vanno da nessuna parte. Nessun
                  server li vede. Nessun tracciamento.
                </p>
              </div>
              <div className="bg-stone-50 px-6 py-7">
                <p className="text-sm font-black text-zinc-950 mb-2">
                  Vuoi sparire? Cancella e basta.
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Svuota la cache o disinstalla l&apos;app e non rimane
                  nient&apos;altro. Zero. Come se non fossi mai passato.
                </p>
              </div>
            </div>
            <InstallAppButton />
          </div>
        </section>

        {/* ── TOOLS GRID ── */}
        <section className="bg-zinc-950 text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-500 mb-10">
              Sei strumenti - dal profilo alla fattura
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800">
              {/* 01 - ATECO */}
              <div className="bg-zinc-950 p-5 md:p-6 flex flex-col min-h-[150px]">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600 mb-3 block">
                  01 - Identifica
                </span>
                <Link
                  href="/calcolatori/ateco"
                  className="group/l flex-1 block"
                >
                  <h2 className="text-base md:text-xl font-black text-white leading-tight">
                    Codice ATECO 2026
                  </h2>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial text-zinc-600 group-hover/l:text-zinc-500 transition-colors">
                    <Search className="w-3 h-3 flex-shrink-0" />
                    Cerca
                    <ArrowRight className="w-3 h-3 group-hover/l:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <details className="mt-3 group">
                  <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-zinc-700 hover:text-zinc-500 transition-colors select-none">
                    Dettagli{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    Cerca per attività e trova il codice ufficiale più il
                    coefficiente di redditività corretto per il Forfettario.
                  </p>
                </details>
              </div>

              {/* 02 - SIMULATORE */}
              <div className="bg-zinc-950 p-5 md:p-6 flex flex-col min-h-[150px]">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600 mb-3 block">
                  02 - Simula
                </span>
                <Link
                  href="/calcolatori/forfettario"
                  className="group/l flex-1 block"
                >
                  <h2 className="text-base md:text-xl font-black text-white leading-tight">
                    Forfettario vs Ordinario
                  </h2>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial text-zinc-600 group-hover/l:text-zinc-500 transition-colors">
                    <Calculator className="w-3 h-3 flex-shrink-0" />
                    Simula
                    <ArrowRight className="w-3 h-3 group-hover/l:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <details className="mt-3 group">
                  <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-zinc-700 hover:text-zinc-500 transition-colors select-none">
                    Dettagli{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    Calcola il netto con i tuoi numeri reali. Tax cliff a €100k.
                    Report PDF per il commercialista.
                  </p>
                </details>
              </div>

              {/* 03 - TAX CLIFF MONITOR */}
              <div className="bg-zinc-950 p-5 md:p-6 flex flex-col min-h-[150px]">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600 mb-3 block">
                  03 - Monitora
                </span>
                <Link
                  href="/calcolatori/cliff"
                  className="group/l flex-1 block"
                >
                  <h2 className="text-base md:text-xl font-black text-white leading-tight">
                    Tax Cliff Monitor
                  </h2>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial text-zinc-600 group-hover/l:text-zinc-500 transition-colors">
                    <TrendingUp className="w-3 h-3 flex-shrink-0" />
                    Monitora
                    <ArrowRight className="w-3 h-3 group-hover/l:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <details className="mt-3 group">
                  <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-zinc-700 hover:text-zinc-500 transition-colors select-none">
                    Dettagli{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    Traccia il fatturato mensile e monitora quanto sei lontano
                    dalla soglia di €100.000.
                  </p>
                </details>
              </div>

              {/* 04 - REGISTRO INCASSI */}
              <div className="bg-zinc-900 p-5 md:p-6 flex flex-col min-h-[150px]">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600 mb-3 flex items-center gap-2">
                  04 - Registra
                  <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 font-black tracking-wider leading-tight">
                    NUOVO
                  </span>
                </span>
                <Link
                  href="/calcolatori/giornale"
                  className="group/l flex-1 block"
                >
                  <h2 className="text-base md:text-xl font-black text-white leading-tight">
                    Registro Incassi
                  </h2>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial text-zinc-600 group-hover/l:text-zinc-500 transition-colors">
                    <BookOpen className="w-3 h-3 flex-shrink-0" />
                    Registra
                    <ArrowRight className="w-3 h-3 group-hover/l:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <details className="mt-3 group">
                  <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-zinc-700 hover:text-zinc-500 transition-colors select-none">
                    Dettagli{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    Logga ogni incasso, vedi il netto spendibile e quanto
                    accantonare. Aggiorna il Tax Cliff automaticamente.
                  </p>
                </details>
              </div>

              {/* 05 - ACCONTO */}
              <div className="bg-zinc-950 p-5 md:p-6 flex flex-col min-h-[150px]">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600 mb-3 block">
                  05 - Pianifica
                </span>
                <Link
                  href="/calcolatori/acconto"
                  className="group/l flex-1 block"
                >
                  <h2 className="text-base md:text-xl font-black text-white leading-tight">
                    Acconto Imposta Sostitutiva
                  </h2>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial text-zinc-600 group-hover/l:text-zinc-500 transition-colors">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    Calcola
                    <ArrowRight className="w-3 h-3 group-hover/l:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <details className="mt-3 group">
                  <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-zinc-700 hover:text-zinc-500 transition-colors select-none">
                    Dettagli{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    Calcola quanto pagare di acconto entro il 30 Novembre. Rate,
                    scadenze e codice F24.
                  </p>
                </details>
              </div>

              {/* 06 - PRO-FORMA */}
              <div className="bg-zinc-950 p-5 md:p-6 flex flex-col min-h-[150px]">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-600 mb-3 block">
                  06 - Emetti
                </span>
                <Link
                  href="/calcolatori/fattura"
                  className="group/l flex-1 block"
                >
                  <h2 className="text-base md:text-xl font-black text-white leading-tight">
                    Pro-Forma &amp; Avviso di Parcella
                  </h2>
                  <span className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial text-zinc-600 group-hover/l:text-zinc-500 transition-colors">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    Crea
                    <ArrowRight className="w-3 h-3 group-hover/l:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <details className="mt-3 group">
                  <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-1 text-[10px] font-semibold uppercase tracking-editorial text-zinc-700 hover:text-zinc-500 transition-colors select-none">
                    Dettagli{" "}
                    <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    Documento di pagamento non fiscale. Forfettario, ritenuta,
                    logo drag &amp; drop. La fattura parte solo a incasso.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLANATION ── */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
                Perché succede
              </p>
              <h2 className="text-3xl font-black text-zinc-950 mb-4 leading-tight">
                Il problema che nessuno calcola prima
              </h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                Quando superi gli{" "}
                <strong className="text-zinc-900">€85.000 di fatturato</strong>,
                perdi automaticamente il regime forfettario l&apos;anno
                successivo. Se superi
                <strong className="text-zinc-900"> €100.000</strong>, esci con
                effetto retroattivo sull&apos;intero anno.
              </p>
              <p className="text-zinc-600 leading-relaxed">
                Nel regime ordinario l&apos;IRPEF progressiva (23%, 35%, 43%) e
                le addizionali regionali ti mangiano quasi il doppio rispetto al
                forfettario. Pochissimi lo calcolano <em>prima</em> di trovarsi
                nella trappola.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
                Caso B2C
              </p>
              <div className="border-l-2 border-red-500 pl-5">
                <h3 className="text-xl font-black text-zinc-950 mb-3">
                  Vendi a privati? La situazione è peggio.
                </h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  Se lavori con clienti privati (B2C), in regime ordinario devi
                  applicare l&apos;IVA al 22% e girarla allo stato. Nel
                  forfettario, l&apos;IVA non si applica.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Su €50.000 di fatturato B2C, questa differenza aggiunte alle
                  tasse porta la perdita annuale oltre{" "}
                  <strong className="text-zinc-900">€10.000</strong>.
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed mt-3 pt-3 border-t border-zinc-100">
                  Il regime ordinario apre però la deducibilità dei costi
                  aziendali e la detrazione IVA sugli acquisti - variabili che
                  il simulatore include nel campo <em>Spese Reali</em>.
                </p>
                <Link
                  href="/calcolatori/forfettario"
                  className="inline-flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-editorial text-zinc-950 hover:text-red-600 transition-colors"
                >
                  Calcola con i tuoi costi reali
                  <ArrowRight className="w-3 h-3" />
                </Link>
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
              <p className="text-zinc-600 max-w-sm">
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
