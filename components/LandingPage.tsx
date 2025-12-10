import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

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
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 md:pb-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-full px-4 py-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold text-yellow-300">
                  Attenzione: La Trappola degli €85k
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight tracking-tight">
                Conviene il Forfettario
                <br />
                <span className="text-yellow-300">o l'Ordinario?</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 text-purple-100 leading-relaxed font-bold">
                Scopri Esattamente Quanto Stai Regalando allo Stato
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-purple-200 max-w-2xl mx-auto px-4">
                Simulazione reale con i tuoi numeri. Report PDF pronto per il
                commercialista.
              </p>
            </div>
          </div>
        </section>

        {/* Main CTA - ONE GIANT BUTTON */}
        <section className="relative -mt-12 sm:-mt-16 md:-mt-20 z-10 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/calcolatori/forfettario"
              className="group inline-flex items-center justify-center gap-4 bg-white hover:bg-gray-50 text-purple-700 font-black text-2xl sm:text-3xl md:text-4xl px-12 sm:px-16 md:px-20 py-6 sm:py-8 rounded-full shadow-premium-2xl hover:shadow-premium-xl transition-all duration-300 hover:scale-105"
            >
              <Calculator className="w-10 h-10 sm:w-12 sm:h-12" />
              <span>AVVIA SIMULAZIONE GRATUITA</span>
              <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>

        {/* SEO CONTENT SECTION - La Trappola degli €85k */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 text-center">
              La Trappola degli €85k:
              <br />
              <span className="text-purple-600">Simulazione Reale (2025)</span>
            </h2>

            {/* Section 1: The Horror Story */}
            <div className="mb-16">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      Il Problema Che Nessuno Ti Dice
                    </h3>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Molti freelancer pensano che passare all'Ordinario costi{" "}
                      <strong>"solo un po' di più"</strong>. Sbagliato. La
                      differenza può essere devastante.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Quando superi gli <strong>€85.000 di fatturato</strong>, perdi
                automaticamente il regime forfettario l'anno successivo. Se
                superi <strong>€100.000</strong>, esci <em>immediatamente</em>{" "}
                (retroattivo).
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Ma quanto ti costa davvero questo passaggio? Pochissimi lo
                calcolano <em>prima</em> di trovarsi nella trappola.
              </p>
            </div>

            {/* Section 2: The Evidence */}
            <div className="mb-16">
              <h3 className="text-3xl font-black text-slate-900 mb-6">
                I Numeri Non Mentono
              </h3>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Abbiamo simulato un fatturato di <strong>€50.000</strong> con
                coefficiente <strong>67%</strong>
                (tipico di sviluppatori e consulenti). Ecco cosa succede:
              </p>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">
                      Regime Forfettario
                    </h4>
                  </div>
                  <div className="text-4xl font-black text-green-600 mb-2">
                    €36.242
                  </div>
                  <p className="text-slate-600 font-medium">
                    Ti rimangono in tasca
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-slate-600">
                      Aliquota Effettiva:{" "}
                      <strong className="text-green-700">27.5%</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">
                      Regime Ordinario
                    </h4>
                  </div>
                  <div className="text-4xl font-black text-red-600 mb-2">
                    €29.153
                  </div>
                  <p className="text-slate-600 font-medium">
                    Ti rimangono in tasca
                  </p>
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-sm text-slate-600">
                      Aliquota Effettiva:{" "}
                      <strong className="text-red-700">41.7%</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">
                  La Differenza
                </p>
                <p className="text-5xl font-black mb-3">€7.089</p>
                <p className="text-lg text-slate-300">
                  Stai regalando allo stato{" "}
                  <strong className="text-yellow-300">oltre €7.000</strong> ogni
                  anno
                </p>
              </div>
            </div>

            {/* Section 3: The "Why" */}
            <div className="mb-16">
              <h3 className="text-3xl font-black text-slate-900 mb-6">
                Perché Succede?
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl mb-6">
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  Nel <strong>Regime Ordinario</strong>, l'IRPEF (progressiva al
                  23%, 35%, 43%) e le addizionali regionali/comunali ti mangiano
                  il <strong>41.7% del reddito</strong>.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Nel <strong>Regime Forfettario</strong>, paghi una flat tax
                  del 5% (primi 5 anni) o 15% sul reddito imponibile (calcolato
                  con il coefficiente). Ti fermi al <strong>27.5%</strong>,
                  anche senza scaricare spese.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Caso Speciale: B2C (Vendite a Privati)
                </h4>
                <p className="text-slate-700">
                  Se vendi a privati (e-commerce, servizi B2C), in regime
                  ordinario perdi anche il <strong>22% di IVA</strong>
                  che devi girare allo stato. Nel forfettario, l'IVA non si
                  applica. Questo amplifica la differenza fino a{" "}
                  <strong>€10.000+</strong>.
                </p>
              </div>
            </div>

            {/* Section 4: Call to Action */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                Non Indovinare. Calcola.
              </h3>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Inserisci <strong>i tuoi numeri reali</strong> nel simulatore
                qui sopra e scarica il report PDF completo per il tuo
                commercialista.
              </p>
              <Link
                href="/calcolatori/forfettario"
                className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-purple-700 font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105"
              >
                <Calculator className="w-6 h-6" />
                <span>Vai al Simulatore</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-purple-200 mt-6">
                ✓ Gratuito ✓ 2 minuti ✓ Report PDF pronto
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
