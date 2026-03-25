"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { ATECO_DATA, searchAteco, type AtecoEntry } from "@/lib/ateco-data";

interface Props {
  value: AtecoEntry | null;
  onChange: (entry: AtecoEntry) => void;
}

export default function AtecoCombobox({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [opensUpward, setOpensUpward] = useState(false);

  const results = useMemo(() => searchAteco(query), [query]);

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function open() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setOpensUpward(window.innerHeight - rect.bottom < 320);
    }
    setIsOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function select(entry: AtecoEntry) {
    onChange(entry);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        ref={triggerRef}
        onClick={open}
        className="w-full flex items-center justify-between border border-zinc-300 rounded-sm px-3 py-2.5 bg-white hover:border-zinc-400 text-left transition-colors"
      >
        {value ? (
          <span className="text-sm text-zinc-950 truncate">
            <span className="font-mono font-bold text-zinc-500 mr-2">
              {value.code}
            </span>
            {value.description}
          </span>
        ) : (
          <span className="text-sm text-zinc-400">
            Cerca per descrizione o codice…
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0 ml-2" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-30 left-0 right-0 bg-white border border-zinc-200 shadow-lg rounded-sm overflow-hidden ${opensUpward ? "bottom-full mb-1" : "top-full mt-1"}`}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-zinc-100 px-3">
            <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Descrivi la tua attività (es. sviluppatore, fotografo, fisioterapista…)"
              className="flex-1 py-2.5 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery("")} className="flex-shrink-0">
                <X className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-700" />
              </button>
            )}
          </div>

          {/* Results list */}
          <div className="max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <p className="px-4 py-4 text-xs text-zinc-400 text-center">
                Nessun risultato per "{query}"
              </p>
            ) : (
              <>
                {!query && (
                  <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-editorial font-semibold text-zinc-400">
                    Più comuni
                  </p>
                )}
                {results.map((entry) => (
                  <button
                    key={entry.code}
                    type="button"
                    onClick={() => select(entry)}
                    className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-50 text-left border-b border-zinc-50 last:border-0 transition-colors"
                  >
                    <span className="text-[11px] font-mono font-bold text-zinc-400 flex-shrink-0 pt-0.5 w-[4.5rem]">
                      {entry.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-950 leading-snug">
                        {entry.description}
                      </p>
                      <p className="text-[10px] uppercase tracking-editorial text-zinc-400 mt-0.5">
                        {entry.sector}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-700 flex-shrink-0 pt-0.5">
                      {(entry.coefficient * 100).toFixed(0)}%
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-zinc-100 px-3 py-1.5">
            <p className="text-[10px] text-zinc-400">
              Coefficiente = % del fatturato su cui si calcola l&apos;imposta
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
