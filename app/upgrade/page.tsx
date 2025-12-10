"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  CloudUpload,
  Palette,
  BarChart3,
  Check,
  X,
} from "lucide-react";

export default function UpgradePage() {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInterest = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit email");
        // Still show success to user (fail silently)
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      // Still show success to user (fail silently)
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-200">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Bur
            <span className="text-indigo-600 font-mono text-5xl md:text-6xl">
              0
            </span>{" "}
            PRO
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Per Commercialisti e Freelancer Avanzati
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-premium-xl border-2 border-indigo-100 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-200">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Piano Professional
              </h2>
              <p className="text-slate-600">
                Tutte le funzionalità avanzate per il tuo studio
              </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-5xl font-black text-slate-900 mb-1">
                €9
                <span className="text-xl text-slate-500 font-medium">
                  /mese
                </span>
              </div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CloudUpload className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  💾 Salva i Clienti
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Salva infinite simulazioni nel cloud. Non perdere mai più i
                  dati dei tuoi clienti. Accedi da qualsiasi dispositivo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  🎨 White Label
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Rimuovi il logo "Bur0" e metti il logo del tuo Studio sul PDF.
                  Report completamente brandizzati con i tuoi colori.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  📊 Confronta Scenari Multipli
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Confronta 3 fatturati diversi in una sola vista. Mostra al
                  cliente tutte le opzioni contemporaneamente.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          {!showForm && !submitted && (
            <button
              onClick={handleInterest}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              Voglio Essere Avvisato al Lancio
            </button>
          )}

          {/* Email Form */}
          {showForm && !submitted && (
            <div className="bg-indigo-50 rounded-2xl p-6 border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Ottieni il 50% di Sconto al Lancio
              </h3>
              <p className="text-slate-600 mb-4">
                Stiamo ultimando questa versione. Lascia la tua email per essere
                avvisato e ricevere lo sconto Early Bird.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tua@email.it"
                  required
                  className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Invia
                </button>
              </form>
            </div>
          )}

          {/* Success Message */}
          {submitted && (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Perfetto! 🎉
              </h3>
              <p className="text-green-800">
                Ti avviseremo non appena Bur0 PRO sarà disponibile, con il tuo
                sconto riservato del 50%.
              </p>
            </div>
          )}
        </div>

        {/* Commercialisti Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Sei un Commercialista?
          </h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Vuoi questo simulatore sul tuo sito web, personalizzato con il TUO
            logo e i TUOI colori?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-purple-100">
              <Check className="w-5 h-5 text-green-400" />
              <span className="font-medium">Personalizzato</span>
            </div>
            <div className="flex items-center gap-2 text-purple-100">
              <Check className="w-5 h-5 text-green-400" />
              <span className="font-medium">Cattura Lead</span>
            </div>
            <div className="flex items-center gap-2 text-purple-100">
              <Check className="w-5 h-5 text-green-400" />
              <span className="font-medium">Risparmia Tempo</span>
            </div>
          </div>
          <a
            href="https://alecsdesign.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-purple-700 font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            <span>Richiedi Demo</span>
          </a>
          <p className="text-sm text-purple-200 mt-6">
            Sviluppato da un developer professionista. Soluzioni su misura per
            il tuo studio.
          </p>
        </div>
      </div>
    </div>
  );
}
