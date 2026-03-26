"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/forfettario-utils";
import InfoTooltip from "@/components/InfoTooltip";
import {
  calcolaAcconto,
  SOGLIA_ESENZIONE,
  SOGLIA_UNICA,
} from "@/lib/acconto-utils";

const YEAR = new Date().getFullYear();
const PRIMA_RATA_DEADLINE = new Date(YEAR, 5, 30); // June 30
const SECONDA_RATA_DEADLINE = new Date(YEAR, 10, 30); // November 30

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function AccontoCalculator({
  initialTax,
}: {
  initialTax?: number;
} = {}) {
  const [prevTaxStr, setPrevTaxStr] = useState(
    initialTax !== undefined ? String(Math.round(initialTax)) : "",
  );
  const [stimaStr, setStimaStr] = useState("");
  const [metodo, setMetodo] = useState<"storico" | "previsionale">("storico");

  const prevTax = parseFloat(prevTaxStr.replace(",", ".")) || 0;
  const stimaTax = parseFloat(stimaStr.replace(",", ".")) || 0;
  const baseTax = metodo === "storico" ? prevTax : stimaTax;

  const result = useMemo(() => calcolaAcconto(baseTax), [baseTax]);

  const daysToFirstRata = daysUntil(PRIMA_RATA_DEADLINE);
  const daysToSecondRata = daysUntil(SECONDA_RATA_DEADLINE);
  const isNovemberUrgent = daysToSecondRata > 0 && daysToSecondRata <= 60;
  const isJuneUrgent =
    daysToFirstRata > 0 && daysToFirstRata <= 30 && !result.unicaRata;

  const formatDeadline = (d: Date) =>
    d.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
                Acconto Imposta Sostitutiva {YEAR}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
                Calcola il tuo Acconto
              </h1>
              <p className="mt-3 text-base text-zinc-500 max-w-xl">
                Quanto devi versare di acconto sull&apos;imposta sostitutiva?
                Calcola le rate e le scadenze.
              </p>
            </div>
            {isNovemberUrgent && (
              <div className="flex-shrink-0 bg-red-600 text-white px-4 py-3 text-center">
                <p className="text-[10px] uppercase tracking-editorial font-semibold">
                  Scadenza
                </p>
                <p className="text-2xl font-black font-mono leading-tight">
                  {daysToSecondRata}
                </p>
                <p className="text-[10px] font-semibold">giorni</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── LEFT: INPUTS ── */}
          <div className="lg:col-span-5 space-y-5">
            {/* Method toggle */}
            <div className="bg-white border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                Metodo di Calcolo
              </p>
              <div className="flex border border-zinc-300 mb-4">
                <button
                  onClick={() => setMetodo("storico")}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-editorial transition-colors ${
                    metodo === "storico"
                      ? "bg-zinc-950 text-white"
                      : "bg-white text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Storico
                </button>
                <button
                  onClick={() => setMetodo("previsionale")}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-editorial transition-colors ${
                    metodo === "previsionale"
                      ? "bg-zinc-950 text-white"
                      : "bg-white text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Previsionale
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {metodo === "storico"
                  ? "Paghi il 100% dell'imposta sostitutiva dell'anno precedente. Metodo più semplice e sicuro."
                  : "Paghi il 100% dell'imposta sostitutiva stimata per l'anno corrente. Conveniente se prevedi un reddito più basso."}
              </p>
            </div>

            {/* Previous year tax input */}
            <div className="bg-white border border-zinc-200 p-6">
              <label className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                Imposta Sostitutiva {YEAR - 1}
                <InfoTooltip
                  content={`Trovata nel modello Redditi PF ${YEAR - 1}, quadro LM, riga LM42. Se usi il 730 precompilato, cerca la sezione Forfettario. È l'imposta flat (15% o 5%) applicata al tuo reddito imponibile dell'anno scorso.`}
                />
              </label>
              <p className="text-[11px] text-zinc-400 mb-3">
                Trovata nella tua dichiarazione dei redditi {YEAR - 1} — riga
                &ldquo;Imposta sostitutiva&rdquo;.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-mono">
                  €
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={prevTaxStr}
                  onChange={(e) => setPrevTaxStr(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="0"
                  className="w-full pl-7 pr-4 py-3 border border-zinc-300 text-base font-mono tabular text-zinc-900 font-semibold focus:outline-none focus:border-zinc-700 bg-transparent"
                />
              </div>
              {metodo === "previsionale" && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <label className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                    Imposta Sostitutiva Stimata {YEAR}
                    <InfoTooltip
                      content={`La stima dell'imposta che pagherai quest'anno. Usa il Simulatore Forfettario con il fatturato previsto per il ${YEAR} — il valore nella riga "Imposta" del riepilogo. Se prevedi un reddito più basso dell'anno scorso, il metodo previsionale può ridurre l'acconto da versare.`}
                      side="top"
                    />
                  </label>
                  <p className="text-[11px] text-zinc-400 mb-3">
                    La tua stima dell&apos;imposta sostitutiva per l&apos;anno
                    corrente.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-mono">
                      €
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={stimaStr}
                      onChange={(e) => setStimaStr(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="w-full pl-7 pr-4 py-3 border border-zinc-300 text-base font-mono tabular text-zinc-900 font-semibold focus:outline-none focus:border-zinc-700 bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Help section */}
            <div className="bg-zinc-50 border border-zinc-200 p-5 space-y-3">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400">
                Non sai la tua imposta sostitutiva?
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Calcolala dal Simulatore Forfettario inserendo il fatturato
                dell&apos;anno {YEAR - 1}. La trovi nella riga{" "}
                <span className="font-bold text-zinc-700">
                  &ldquo;Imposta&rdquo;
                </span>{" "}
                del riepilogo.
              </p>
              <Link
                href="/calcolatori/forfettario"
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-zinc-950 underline underline-offset-2"
              >
                Apri il Simulatore Forfettario →
              </Link>
            </div>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Total */}
            <div
              className={`bg-white border p-6 ${
                result.nessunPagamento
                  ? "border-zinc-200"
                  : "border-l-4 border-l-zinc-950 border-zinc-200"
              }`}
            >
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
                Acconto Totale Dovuto
              </p>
              {result.nessunPagamento ? (
                <div>
                  <p className="text-4xl font-black text-emerald-600 font-mono tabular">
                    Esente
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Importo inferiore a {formatCurrency(SOGLIA_ESENZIONE)} —
                    nessun versamento richiesto.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-5xl font-black font-mono tabular text-zinc-950 leading-none">
                    {formatCurrency(result.totale)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    100% dell&apos;imposta sostitutiva {YEAR - 1} — metodo{" "}
                    {metodo}
                  </p>
                </div>
              )}
            </div>

            {!result.nessunPagamento && (
              <>
                {/* Rate breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Prima rata */}
                  {!result.unicaRata && (
                    <div
                      className={`bg-white border p-5 ${isJuneUrgent ? "border-l-4 border-l-amber-500 border-zinc-200" : "border-zinc-200"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400">
                          Prima Rata (40%)
                        </p>
                        {isJuneUrgent && (
                          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-3xl font-black font-mono tabular text-zinc-950 leading-none mb-1">
                        {formatCurrency(result.primaRata)}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Entro il{" "}
                        <span className="font-semibold text-zinc-600">
                          {formatDeadline(PRIMA_RATA_DEADLINE)}
                        </span>
                      </p>
                      {daysToFirstRata > 0 && (
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {daysToFirstRata} giorni
                        </p>
                      )}
                    </div>
                  )}

                  {/* Seconda rata / unica */}
                  <div
                    className={`bg-white border p-5 ${result.unicaRata ? "sm:col-span-2" : ""} ${isNovemberUrgent ? "border-l-4 border-l-red-600 border-zinc-200" : "border-zinc-200"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400">
                        {result.unicaRata
                          ? "Unica Rata (100%)"
                          : "Seconda Rata (60%)"}
                      </p>
                      {isNovemberUrgent && (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-3xl font-black font-mono tabular text-zinc-950 leading-none mb-1">
                      {formatCurrency(result.secondaRata)}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Entro il{" "}
                      <span className="font-semibold text-zinc-600">
                        {formatDeadline(SECONDA_RATA_DEADLINE)}
                      </span>
                    </p>
                    {daysToSecondRata > 0 && (
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {daysToSecondRata} giorni
                      </p>
                    )}
                    {result.unicaRata && (
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Importo ≤ {formatCurrency(SOGLIA_UNICA)} — pagamento
                        unico in novembre.
                      </p>
                    )}
                  </div>
                </div>

                {/* Info note */}
                <div className="bg-white border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
                    Come si paga
                  </p>
                  <ul className="space-y-1.5 text-xs text-zinc-500 leading-relaxed">
                    <li>
                      — Modello F24, codice tributo{" "}
                      <span className="font-mono font-bold text-zinc-700">
                        1791
                      </span>{" "}
                      (acconto imposta sostitutiva regime forfettario)
                    </li>
                    <li>
                      — Pagamento tramite home banking, intermediario, F24
                      telematico
                    </li>
                    <li>
                      — Se usi un commercialista, passa questi numeri con le
                      scadenze
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
