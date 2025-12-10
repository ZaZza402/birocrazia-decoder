import Link from "next/link";
import { ArrowRight, Calculator, Sparkles, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section - Calculator Focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Language Switcher */}
            <div className="flex justify-center gap-3 mb-8">
              <Link
                href="/it"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all border border-white/20"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">Italiano</span>
              </Link>
              <Link
                href="/en"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all border border-white/20"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">English</span>
              </Link>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Calcolatori ISEE
              <br />
              <span className="text-yellow-300">2026 Gratuiti</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-blue-100 leading-relaxed">
              Formula INPS ufficiale • Risultato in 3 minuti
            </p>
            <p className="text-lg md:text-xl mb-12 text-blue-200 max-w-2xl mx-auto">
              Scopri a quali bonus e agevolazioni hai diritto
            </p>
          </div>
        </div>
      </section>

      {/* Main Calculator Cards */}
      <section className="relative -mt-16 md:-mt-20 z-10 px-4 sm:px-6 lg:px-8 pb-20 md:pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* ISEE Ordinario Card */}
            <Link
              href="/calcolatori/isee"
              className="group relative bg-white rounded-2xl shadow-premium-xl hover:shadow-premium-2xl transition-all duration-300 overflow-hidden hover:scale-[1.03] border-2 border-transparent hover:border-green-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-bl-full"></div>

              <div className="relative p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-2">
                      PIÙ POPOLARE
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                      ISEE Ordinario
                    </h2>
                    <p className="text-slate-600 font-medium">
                      Per bonus, agevolazioni e servizi pubblici
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-slate-700">
                      <strong>Formula INPS ufficiale 2026</strong> con
                      detrazioni disabilità
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-slate-700">
                      <strong>BTP e investimenti</strong> - primi €50.000
                      esclusi
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-slate-700">
                      <strong>Bonus disponibili</strong> - lista completa
                      inclusa
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <span className="text-sm font-bold text-green-600 uppercase tracking-wide">
                    Calcola Ora Gratis
                  </span>
                  <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* ISEE Università Card */}
            <Link
              href="/it/isee-universita"
              className="group relative bg-white rounded-2xl shadow-premium-xl hover:shadow-premium-2xl transition-all duration-300 overflow-hidden hover:scale-[1.03] border-2 border-transparent hover:border-blue-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-bl-full"></div>

              <div className="relative p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2">
                      PER STUDENTI
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                      ISEE Università
                    </h2>
                    <p className="text-slate-600 font-medium">
                      Per tasse universitarie e borse di studio
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-slate-700">
                      <strong>6 scenari automatici</strong> - studente autonomo,
                      coniugato, ecc.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-slate-700">
                      <strong>Calcolo tasse</strong> - stima precisa per la tua
                      università
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-slate-700">
                      <strong>Verifica esenzione</strong> - scopri se sei esente
                      al 100%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                    Calcola Ora Gratis
                  </span>
                  <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-8 px-6 md:px-8 py-4 bg-white rounded-2xl shadow-premium-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-700 font-semibold">
                  100% Gratis
                </span>
              </div>
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-semibold">
                  Formula INPS Ufficiale
                </span>
              </div>
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="text-slate-700 font-semibold">
                  Aggiornato 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl shadow-premium-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>

            <div className="relative px-8 md:px-12 py-16 md:py-20 text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-yellow-300/30">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-100 font-bold text-sm uppercase tracking-wide">
                  Prossimamente
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Nuovi Calcolatori
                <br />
                <span className="text-yellow-300">In Arrivo! 🚀</span>
              </h2>

              <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Stiamo lavorando su nuovi strumenti per semplificarti la vita
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    ISEE Corrente
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Per variazioni di reddito significative
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Modello 730
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Calcolo dichiarazione dei redditi
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    ISEE Sociosanitario
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Per prestazioni socio-sanitarie
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href="/it"
                  className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-purple-700 font-bold px-10 py-5 rounded-xl transition-all shadow-premium-lg hover:shadow-premium-xl hover:scale-105 touch-manipulation min-h-[64px]"
                >
                  <span>Esplora Tutti i Servizi</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
