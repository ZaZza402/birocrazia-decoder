"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import { ATECO_DATA, searchAteco, type AtecoEntry } from "@/lib/ateco-data";

const COEFFICIENT_LABELS: Record<number, { label: string; color: string }> = {
  0.40: { label: "40%", color: "text-blue-600" },
  0.67: { label: "67%", color: "text-violet-600" },
  0.78: { label: "78%", color: "text-amber-600" },
  0.86: { label: "86%", color: "text-red-600" },
};

const SECTORS = Array.from(new Set(ATECO_DATA.map((e) => e.sector))).sort();

// Group ATECO_DATA by sector for browse mode
function groupBySector(entries: AtecoEntry[]) {
  const map: Record<string, AtecoEntry[]> = {};
  for (const e of entries) {
    if (!map[e.sector]) map[e.sector] = [];
    map[e.sector].push(e);
  }
  return map;
}

function CoefficientBadge({ coefficient }: { coefficient: number }) {
  const info = COEFFICIENT_LABELS[coefficient] ?? {
    label: `${(coefficient * 100).toFixed(0)}%`,
    color: "text-zinc-600",
  };
  return (
    <span className={`text-xs font-mono font-bold ${info.color}`}>
      {info.label}
    </span>
  );
}

function EntryRow({
  entry,
  onSelect,
  selected,
}: {
  entry: AtecoEntry;
  onSelect: (e: AtecoEntry) => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={`w-full flex items-start gap-4 px-5 py-4 text-left border-b border-zinc-100 last:border-0 transition-colors ${
        selected ? "bg-zinc-950 text-white" : "hover:bg-zinc-50"
      }`}
    >
      <span
        className={`text-[11px] font-mono font-bold flex-shrink-0 pt-0.5 w-[5rem] ${
          selected ? "text-zinc-400" : "text-zinc-400"
        }`}
      >
        {entry.code}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold leading-snug ${
            selected ? "text-white" : "text-zinc-950"
          }`}
        >
          {entry.description}
        </p>
        <p
          className={`text-[11px] uppercase tracking-editorial mt-0.5 ${
            selected ? "text-zinc-400" : "text-zinc-400"
          }`}
        >
          {entry.sector}
        </p>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        {selected ? (
          <span className="text-xs font-mono font-bold text-white">
            {(entry.coefficient * 100).toFixed(0)}%
          </span>
        ) : (
          <CoefficientBadge coefficient={entry.coefficient} />
        )}
      </div>
    </button>
  );
}

export default function AtecoFinder() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AtecoEntry | null>(null);
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => searchAteco(query), [query]);
  const grouped = useMemo(() => groupBySector(ATECO_DATA), []);

  const isSearching = query.trim().length > 0;

  // What to show in the list
  const displayEntries = useMemo(() => {
    if (isSearching) return searchResults;
    if (activeSector) return grouped[activeSector] ?? [];
    // default: show first 12 most-used
    return ATECO_DATA.slice(0, 12);
  }, [isSearching, searchResults, activeSector, grouped]);

  function clearSearch() {
    setQuery("");
    inputRef.current?.focus();
  }

  const taxRate = selected
    ? selected.coefficient * (selected ? 15 : 0) // 15% flat tax on taxable base
    : null;

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Bur0
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            <Link
              href="/calcolatori/forfettario"
              className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Calcolatori
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            <span className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-700">
              ATECO
            </span>
          </div>
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            ATECO 2025 — Classificazione aggiornata
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            Trova il tuo
            <br />
            Codice ATECO
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Cerca per attività o professione. Ottieni il codice ufficiale e il
            coefficiente di redditività per il Regime Forfettario.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ── LEFT PANEL: search + list ── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Search bar */}
            <div className="bg-white border border-zinc-200 flex items-center gap-3 px-4 py-3.5">
              <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveSector(null);
                }}
                placeholder="Scrivi la tua attività (es. sviluppatore, fisioterapista, fotografo…)"
                className="flex-1 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none bg-transparent"
                autoFocus
              />
              {query && (
                <button onClick={clearSearch} className="flex-shrink-0 text-zinc-400 hover:text-zinc-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sector filter pills — shown only when not searching */}
            {!isSearching && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveSector(null)}
                  className={`text-[11px] font-bold uppercase tracking-editorial px-3 py-1.5 border transition-colors ${
                    activeSector === null
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  Più cercati
                </button>
                {SECTORS.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setActiveSector(sector)}
                    className={`text-[11px] font-bold uppercase tracking-editorial px-3 py-1.5 border transition-colors ${
                      activeSector === sector
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            )}

            {/* Results list */}
            <div className="bg-white border border-zinc-200 overflow-hidden">
              {/* Header row */}
              <div className="flex items-center gap-4 px-5 py-2 border-b border-zinc-100 bg-zinc-50">
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 w-[5rem] flex-shrink-0">
                  Codice
                </span>
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 flex-1">
                  Descrizione attività
                </span>
                <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 flex-shrink-0">
                  Coeff.
                </span>
              </div>

              {/* Entries */}
              <div className="max-h-[480px] overflow-y-auto">
                {displayEntries.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-zinc-500">
                      Nessun risultato per &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Prova con sinonimi — es. &ldquo;commercio&rdquo; invece di
                      &ldquo;vendita&rdquo;
                    </p>
                  </div>
                ) : (
                  displayEntries.map((entry) => (
                    <EntryRow
                      key={entry.code}
                      entry={entry}
                      onSelect={setSelected}
                      selected={selected?.code === entry.code}
                    />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-100 px-5 py-2.5 flex items-center justify-between">
                <p className="text-[10px] text-zinc-400">
                  {isSearching
                    ? `${displayEntries.length} risultati`
                    : activeSector
                      ? `${displayEntries.length} codici in ${activeSector}`
                      : `${ATECO_DATA.length} codici totali — filtra per settore o cerca`}
                </p>
                <a
                  href="https://www.istat.it/it/archivio/17888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-zinc-400 hover:text-zinc-700 inline-flex items-center gap-1 transition-colors"
                >
                  Fonte ISTAT ATECO 2025
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: detail card ── */}
          <div className="lg:col-span-5 space-y-4">

            {selected ? (
              <>
                {/* Main card */}
                <div className="bg-zinc-950 text-white p-6">
                  <p className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-500 mb-4">
                    Codice selezionato
                  </p>
                  <p className="text-4xl font-black font-mono leading-none mb-1">
                    {selected.code}
                  </p>
                  <p className="text-sm text-zinc-300 mt-2 leading-snug">
                    {selected.description}
                  </p>
                  <p className="text-[11px] uppercase tracking-editorial text-zinc-500 mt-1">
                    {selected.sector}
                  </p>

                  <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-500 mb-1">
                        Coeff. redditività
                      </p>
                      <p className="text-3xl font-black font-mono leading-none text-white">
                        {(selected.coefficient * 100).toFixed(0)}%
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        del fatturato è tassabile
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-500 mb-1">
                        Aliquota flat
                      </p>
                      <p className="text-3xl font-black font-mono leading-none text-white">
                        15%
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        (5% startup, primi 5 anni)
                      </p>
                    </div>
                  </div>

                  {/* Effective rate example */}
                  <div className="mt-5 pt-4 border-t border-zinc-800">
                    <p className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-500 mb-2">
                      Imposta effettiva su €50.000
                    </p>
                    <p className="text-2xl font-black font-mono leading-none">
                      €
                      {(
                        50000 *
                        selected.coefficient *
                        0.15
                      ).toLocaleString("it-IT", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      = €50.000 × {(selected.coefficient * 100).toFixed(0)}% ×
                      15% (solo imposta sostitutiva, senza INPS)
                    </p>
                  </div>
                </div>

                {/* CTA to calculator */}
                <div className="bg-white border border-zinc-200 p-5">
                  <p className="text-sm font-bold text-zinc-950 mb-1">
                    Vuoi vedere il netto completo?
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    Il simulatore calcola INPS, addizionali e differenza vs
                    Regime Ordinario con questo coefficiente.
                  </p>
                  <Link
                    href={`/calcolatori/forfettario`}
                    className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-editorial px-5 py-2.5 transition-colors group w-full justify-center"
                  >
                    Apri il Simulatore
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Keyword tags */}
                {selected.tags.length > 0 && (
                  <div className="bg-white border border-zinc-200 p-4">
                    <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-2.5">
                      Attività correlate
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tags.slice(0, 12).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-zinc-500 border border-zinc-200 px-2 py-0.5 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="bg-white border border-zinc-200 p-8">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Come funziona
                </p>
                <div className="space-y-5">
                  {[
                    {
                      step: "01",
                      text: "Cerca la tua professione nella lista a sinistra",
                    },
                    {
                      step: "02",
                      text: "Clicca sul codice per vedere coefficiente e calcolo",
                    },
                    {
                      step: "03",
                      text: "Usa il codice nel Simulatore Forfettario per il netto completo",
                    },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="text-xs font-mono font-black text-zinc-300 flex-shrink-0 pt-0.5 w-6">
                        {step}
                      </span>
                      <p className="text-sm text-zinc-600">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100">
                  <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                    I coefficienti disponibili
                  </p>
                  <div className="space-y-2">
                    {Object.entries(COEFFICIENT_LABELS).map(
                      ([coeff, { label, color }]) => (
                        <div
                          key={coeff}
                          className="flex items-center justify-between"
                        >
                          <span
                            className={`text-sm font-mono font-black ${color}`}
                          >
                            {label}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {coeff === "0.4"
                              ? "Commercio, ristorazione, ospitalità"
                              : coeff === "0.67"
                                ? "IT, software, arte, media"
                                : coeff === "0.78"
                                  ? "Professioni, salute, istruzione"
                                  : "Costruzioni, impianti"}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-100">
                  <Link
                    href="/calcolatori/forfettario"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 transition-colors group"
                  >
                    Vai al Simulatore Forfettario
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* ── EXPLAINER ── */}
            <div className="bg-white border border-zinc-200 p-5">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                Cos&apos;è il codice ATECO?
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                Il codice ATECO identifica l&apos;attività economica svolta. Nel
                Regime Forfettario, determina il{" "}
                <strong className="text-zinc-900">
                  coefficiente di redditività
                </strong>{" "}
                — cioè la percentuale del tuo fatturato considerata reddito
                imponibile.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Su quella base si applica l&apos;aliquota piatta del 15% (o 5%
                per le nuove attività). Un coefficiente più basso = meno tasse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
