"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { PLANS, ONE_TIME_CREDITS } from "@/lib/plans";

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (
    priceId: string | null,
    type: "subscription" | "payment" = "subscription"
  ) => {
    if (!priceId) {
      alert(
        "Stripe non ancora configurato. Controlla le variabili d'ambiente."
      );
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, type }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Errore durante il checkout");
        setLoading(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Errore di connessione. Riprova.");
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 px-6 bg-[#ff90e8]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-black text-center mb-16 uppercase tracking-tighter">
          Scegli la tua pena
        </h2>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <h3 className="text-2xl font-black uppercase mb-2">Cittadino</h3>
            <div className="text-4xl font-black mb-6">
              €0<span className="text-xl">/sempre</span>
            </div>
            <ul className="space-y-4 mb-8 font-bold text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />{" "}
                {PLANS.FREE.limits.monthlyDecodes} Decodifiche al MESE
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Persona: Cinico (Sintesi
                Brutale)
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <XCircle className="w-5 h-5" /> No Upload PDF (Solo Testo)
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <XCircle className="w-5 h-5" /> No Archivio Storico
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="block w-full bg-gray-200 text-black text-center py-4 font-black uppercase border-2 border-black hover:bg-gray-300 transition-colors"
            >
              Resta Povero
            </Link>
          </div>

          {/* Starter Plan */}
          <div className="bg-black text-white border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] transform md:-translate-y-4 relative">
            <div className="absolute top-0 right-0 bg-yellow-300 text-black text-xs font-black px-2 py-1 uppercase border-b-2 border-l-2 border-black">
              Popolare
            </div>
            <h3 className="text-2xl font-black uppercase mb-2 text-yellow-300">
              Senatore
            </h3>
            <div className="text-4xl font-black mb-6">
              €{PLANS.STARTER.price}
              <span className="text-xl">/mese</span>
            </div>
            <ul className="space-y-4 mb-8 font-bold text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" /> Tutto
                incluso in Cittadino più...
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" />{" "}
                {PLANS.STARTER.limits.monthlyDecodes} Decodifiche al MESE
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" /> Persona:
                Solerte (Azione Chiara)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" /> Upload PDF &
                Foto
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-300" /> Archivio
                Storico
              </li>
            </ul>
            <button
              onClick={() => handleCheckout(PLANS.STARTER.stripePriceId)}
              disabled={loading === PLANS.STARTER.stripePriceId}
              className="w-full bg-white text-black text-center py-4 font-black uppercase border-2 border-black hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === PLANS.STARTER.stripePriceId ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Caricamento...
                </>
              ) : (
                "Scegli Senatore"
              )}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-2">Imperatore</h3>
            <div className="text-4xl font-black mb-6">
              €{PLANS.PRO.price}
              <span className="text-xl">/mese</span>
            </div>
            <ul className="space-y-4 mb-8 font-bold text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Tutto incluso in Senatore
                più...
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Decodifiche ILLIMITATE
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Persona: Avvocato (Paranoia
                Legale)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Upload PDF & Foto
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Archivio Storico
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Priorità Assoluta
              </li>
            </ul>
            <button
              onClick={() => handleCheckout(PLANS.PRO.stripePriceId)}
              disabled={loading === PLANS.PRO.stripePriceId}
              className="w-full bg-black text-white text-center py-4 font-black uppercase border-2 border-black hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === PLANS.PRO.stripePriceId ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Caricamento...
                </>
              ) : (
                "Diventa Intoccabile"
              )}
            </button>
          </div>
        </div>

        {/* One-time Credits Option */}
        <div className="mt-16 max-w-2xl mx-auto bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black uppercase mb-2 bg-red-500 text-white inline-block px-2">
                🚨 Emergenza
              </h3>
              <p className="font-bold text-lg">
                Hai finito le decodifiche?
                <br />
                <span className="text-sm text-gray-600">
                  Compra {ONE_TIME_CREDITS.amount} crediti extra senza
                  abbonamento
                </span>
              </p>
            </div>
            <button
              onClick={() =>
                handleCheckout(ONE_TIME_CREDITS.stripePriceId, "payment")
              }
              disabled={loading === ONE_TIME_CREDITS.stripePriceId}
              className="bg-red-500 text-white px-8 py-4 font-black uppercase border-2 border-black hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
            >
              {loading === ONE_TIME_CREDITS.stripePriceId ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ...
                </>
              ) : (
                `€${ONE_TIME_CREDITS.price} - Compra Ora`
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
