"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/forfettario-utils";

const MONTHS_IT = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const STORAGE_KEY = "bur0_cliff_2026";
const YEAR = 2026;
const CLIFF = 100_000;
const WARN_RED = 85_000;
const WARN_AMBER = 70_000;

export default function CliffTracker() {
  const [months, setMonths] = useState<Record<number, number | undefined>>({});
  const [inputVals, setInputVals] = useState<Record<number, string>>({});
  const [loaded, setLoaded] = useState(false);

  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored: Record<number, number> = raw ? JSON.parse(raw) : {};
      const vals: Record<number, string> = {};
      for (let m = 1; m <= 12; m++) {
        vals[m] = stored[m] !== undefined ? String(stored[m]) : "";
      }
      setMonths(stored);
      setInputVals(vals);
    } catch {}
    setLoaded(true);
  }, []);

  const persist = (newMonths: Record<number, number | undefined>) => {
    const toSave: Record<number, number> = {};
    for (const [k, v] of Object.entries(newMonths)) {
      if (v !== undefined) toSave[Number(k)] = v;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const updateMonth = (m: number, raw: string) => {
    setInputVals((prev) => ({ ...prev, [m]: raw }));
    const trimmed = raw.trim();
    const num = parseFloat(trimmed);
    const val =
      trimmed === "" ? undefined : Math.max(0, isNaN(num) ? 0 : num);
    const newMonths = { ...months, [m]: val };
    setMonths(newMonths);
    persist(newMonths);
  };

  let total = 0;
  let enteredCount = 0;
  for (let m = 1; m <= 12; m++) {
    const v = months[m];
    if (v !== undefined) {
      total += v;
      enteredCount++;
    }
  }

  const avgMonthly = enteredCount > 0 ? total / enteredCount : 0;
  const remainingMonths = 12 - enteredCount;
  const projectedTotal = Math.round(total + avgMonthly * remainingMonths);

  const progressPct = Math.min(100, (total / CLIFF) * 100);
  const barColor =
    total >= WARN_RED
      ? "bg-red-500"
      : total >= WARN_AMBER
        ? "bg-amber-500"
        : "bg-emerald-500";

  const statusLabel =
    total >= CLIFF
      ? "Limite superato — valuta il Regime Ordinario"
      : total >= WARN_RED
        ? `Zona rossa — ${formatCurrency(CLIFF - total)} al limite`
        : total >= WARN_AMBER
          ? "Zona attenzione — crescita sostenuta"
          : "In zona sicura";

  const statusColor =
    total >= CLIFF
      ? "text-red-600"
      : total >= WARN_RED
        ? "text-red-500"
        : total >= WARN_AMBER
          ? "text-amber-500"
          : "text-emerald-600";

  const clampRev = (v: number) =>
    Math.round(Math.max(20000, Math.min(120000, v || 50000)));

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            Tax Cliff Monitor {YEAR}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            Traccia il Fatturato
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Inserisci il fatturato mensile e monitora la distanza dalla Tax
            Cliff di €100.000. Nessun account, nessun server.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-1 space-y-5">
            {/* YTD Total */}
            <div className="bg-white border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
                Fatturato {YEAR}
              </p>
              <p
                className={`text-5xl font-black font-mono tabular leading-none ${statusColor}`}
              >
                {formatCurrency(total)}
              </p>
              <p className={`text-xs font-semibold mt-2 ${statusColor}`}>
                {statusLabel}
              </p>
            </div>

            {/* Progress bar */}
            <div className="bg-white border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                Avanzamento verso €100k
              </p>
              <div className="relative h-3 bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${progressPct}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-px bg-amber-400/70"
                  style={{ left: `${(WARN_AMBER / CLIFF) * 100}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-400/70"
                  style={{ left: `${(WARN_RED / CLIFF) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1.5">
                <span>€0</span>
                <span className="text-amber-500">€70k</span>
                <span className="text-red-500">€85k</span>
                <span className="text-red-600 font-bold">€100k</span>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <p className="text-2xl font-black font-mono tabular text-zinc-950">
                  {formatCurrency(Math.max(0, CLIFF - total))}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  rimangono alla cliff
                </p>
              </div>
            </div>

            {/* Projection — show when at least 2 months entered */}
            {enteredCount >= 2 && (
              <div className="bg-white border border-zinc-200 p-6">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Proiezione Fine Anno
                </p>
                <p
                  className={`text-3xl font-black font-mono tabular ${
                    projectedTotal >= CLIFF
                      ? "text-red-600"
                      : projectedTotal >= WARN_RED
                        ? "text-amber-500"
                        : "text-zinc-950"
                  }`}
                >
                  {formatCurrency(projectedTotal)}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Media {formatCurrency(Math.round(avgMonthly))}/mese ×{" "}
                  {remainingMonths} mesi rimanenti
                </p>
                {projectedTotal >= CLIFF && (
                  <p className="mt-3 text-xs text-red-600 font-semibold border-l-2 border-red-500 pl-2">
                    Al ritmo attuale supererai €100k. Simula il Regime
                    Ordinario.
                  </p>
                )}
                {enteredCount < 12 && (
                  <Link
                    href={`/calcolatori/forfettario?rev=${clampRev(projectedTotal)}`}
                    className="mt-3 inline-block text-xs font-bold text-zinc-500 hover:text-zinc-900 underline underline-offset-2"
                  >
                    Simula con proiezione →
                  </Link>
                )}
              </div>
            )}

            {/* CTA to simulator */}
            <Link
              href={`/calcolatori/forfettario?rev=${clampRev(total)}`}
              className="block bg-zinc-950 hover:bg-zinc-800 text-white p-5 transition-colors"
            >
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                Simulatore Fiscale
              </p>
              <p className="text-sm font-bold">
                Apri il simulatore con {formatCurrency(total)} →
              </p>
            </Link>

            {/* Privacy note */}
            <div className="flex items-start gap-2 border border-zinc-200 bg-zinc-50 p-4">
              <Lock className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                I tuoi dati rimangono solo nel tuo browser — nessun server,
                nessun account. Si azzerano se svuoti la cache.
              </p>
            </div>
          </div>

          {/* ── RIGHT: MONTHLY GRID ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-5">
                Fatturato Mensile — {YEAR}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MONTHS_IT.map((name, idx) => {
                  const m = idx + 1;
                  const isCurrent = m === currentMonth;
                  const hasValue =
                    inputVals[m] !== "" && inputVals[m] !== undefined;

                  return (
                    <div
                      key={m}
                      className={`relative border p-3 transition-colors ${
                        isCurrent
                          ? "border-zinc-950 bg-zinc-950/[0.03]"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <label
                        htmlFor={`month-${m}`}
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-editorial mb-2 cursor-pointer ${
                          isCurrent ? "text-zinc-950" : "text-zinc-400"
                        }`}
                      >
                        {name}
                        {isCurrent && (
                          <span className="text-[8px] bg-zinc-950 text-white px-1 py-0.5 leading-tight">
                            ORA
                          </span>
                        )}
                      </label>
                      <div className="relative flex items-center">
                        <span className="text-xs text-zinc-400 font-mono mr-1">
                          €
                        </span>
                        <input
                          id={`month-${m}`}
                          type="text"
                          inputMode="numeric"
                          value={inputVals[m] ?? ""}
                          onChange={(e) => updateMonth(m, e.target.value)}
                          onBlur={(e) => {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num)) {
                              setInputVals((prev) => ({
                                ...prev,
                                [m]: String(num),
                              }));
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className={`flex-1 min-w-0 py-1 border-b bg-transparent text-sm font-mono tabular focus:outline-none ${
                            isCurrent
                              ? "border-zinc-700 text-zinc-950"
                              : "border-zinc-200 text-zinc-600"
                          }`}
                        />
                      </div>
                      {hasValue && (
                        <div
                          className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${
                            (months[m] ?? 0) > 0
                              ? "bg-emerald-400"
                              : "bg-zinc-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Running total */}
              {enteredCount > 0 && (
                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-editorial">
                    Totale inserito
                  </span>
                  <span
                    className={`text-xl font-black font-mono tabular ${statusColor}`}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
