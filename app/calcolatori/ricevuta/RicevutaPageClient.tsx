"use client";

import { useState } from "react";
import {
  FileText,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function RicevutaPageClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const response = await fetch("/api/notify-ricevuta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante l'invio");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'invio");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-20 px-4 pb-8 font-sans text-zinc-900 sm:px-6">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna alla Home</span>
        </Link>

        <div className="bg-white shadow-sm overflow-hidden border border-zinc-200">
          {/* Header Section */}
          <div className="bg-zinc-950 p-6 sm:p-10 text-center text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-red-600/20 border border-red-500/40 flex items-center justify-center mb-5">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">
                Generatore Ricevute
                <span className="block text-red-400">
                  Prestazione Occasionale
                </span>
              </h1>
              <p className="text-zinc-300 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                Smetti di usare template Word rotti. Crea ricevute fiscalmente
                perfette, calcola la ritenuta e monitora il limite dei €5.000.
              </p>
            </div>
          </div>

          {/* The "Pain & Solution" Grid */}
          <div className="p-5 sm:p-10">
            {/* Subtitle */}
            <div className="text-center mb-10">
              <p className="text-zinc-600 text-base sm:text-lg">
                <span className="font-bold text-zinc-950">
                  Anche se è solo un lavoretto
                </span>
                , i numeri devono essere giusti.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mb-9">
              <div>
                <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Il Problema
                </h3>
                <ul className="space-y-3 text-zinc-600 text-sm font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">×</span>
                    <span>Calcoli della Ritenuta (20%) sbagliati</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">×</span>
                    <span>Dimentichi la Marca da Bollo (€2)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">×</span>
                    <span>Superi i €5.000 senza accorgertene</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">×</span>
                    <span>PDF brutti e poco professionali</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  LA SOLUZIONE{" "}
                  <span className="tracking-tight">
                    <span className="font-normal">Bur</span>
                    <span className="font-black text-red-600">Zero</span>
                  </span>
                </h3>
                <ul className="space-y-3 text-slate-800 text-sm font-bold">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>Calcolo Netto/Lordo Automatico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>Alert Marca da Bollo & Limiti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>Logica B2B (Aziende) vs Privati</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>PDF Pro pronto da firmare</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-stone-50 p-5 sm:p-7 border border-zinc-200 text-center">
              {status === "success" ? (
                <div className="py-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950 mb-2">
                    Sei in lista!
                  </h3>
                  <p className="text-zinc-600">
                    Ti avviseremo appena lo strumento sarà online (questione di
                    giorni).
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-zinc-950 mb-2">
                    In arrivo a brevissimo
                  </h3>
                  <p className="text-zinc-600 mb-5 text-sm">
                    Stiamo preparando il generatore PDF. Lascia la tua email per
                    ricevere una sola notifica quando sarà pronto.
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  >
                    <input
                      type="email"
                      placeholder="tua@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="flex-1 min-w-0 px-4 py-3 border border-zinc-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          Avvisami
                        </>
                      )}
                    </button>
                  </form>
                  {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                  )}
                  <p className="text-xs text-zinc-500 mt-4">
                    Nessuno spam. Solo una email quando lo strumento sarà
                    pronto.
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    Strumento BurZero gestito da Alem Studio.{" "}
                    <a
                      href="mailto:info@alemstudio.it?subject=Ricevuta%20Prestazione%20Occasionale"
                      className="font-semibold text-zinc-700 underline underline-offset-2 hover:text-red-600"
                    >
                      Contatti
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-zinc-600">
            Nel frattempo, prova il nostro{" "}
            <Link
              href="/calcolatori/forfettario"
              className="text-red-600 hover:text-red-700 font-semibold underline"
            >
              Simulatore Fiscale Forfettario
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
