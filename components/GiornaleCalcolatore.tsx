"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  Trash2,
  Pencil,
  Check,
  X as XIcon,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/forfettario-utils";
import type { CassaType } from "@/lib/forfettario-utils";
import { ATECO_DATA } from "@/lib/ateco-data";
import type { AtecoEntry } from "@/lib/ateco-data";
import { resolveAtecoCoefficient } from "@/lib/ateco-rules-2026";
import { TAX_YEAR } from "@/lib/tax-constants-2026";
import AtecoCombobox from "@/components/AtecoCombobox";
import InfoTooltip from "@/components/InfoTooltip";
import {
  type GiornaleProfile,
  type GiornaleEntry,
  type GiornaleData,
  DEFAULT_PROFILE,
  readProfile,
  saveProfile,
  readEntries,
  saveEntries,
  syncMonthToCliff,
  computeSafeToSpend,
  getMonthTotal,
} from "@/lib/giornale-utils";

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

const CASSA_OPTIONS: { value: CassaType; label: string }[] = [
  { value: "gestione_separata", label: "Gestione Separata (Professionisti)" },
  { value: "artigiani", label: "Artigiani" },
  { value: "commercianti", label: "Commercianti" },
  { value: "custom", label: "Cassa Professionale (aliquota custom)" },
];

function formatDateShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function parseAmount(raw: string): number | null {
  const n = parseFloat(raw.replace(",", ".").replace(/[^0-9.-]/g, ""));
  return isFinite(n) && n > 0 ? n : null;
}

// ─── Profile Summary Pill ─────────────────────────────────────────────────────

function profileSummary(profile: GiornaleProfile): string {
  const rate = profile.isNewBusiness ? "5%" : "15%";
  const coeff = `coeff. ${Math.round(profile.atecoCoefficient * 100)}%`;
  const cassa =
    profile.cassaType === "gestione_separata"
      ? "Gest. Sep."
      : profile.cassaType === "artigiani"
        ? "Artigiani"
        : profile.cassaType === "commercianti"
          ? "Commercianti"
          : `Custom ${profile.customCassaRate ?? 0}%`;
  return `${rate} · ${cassa} · ${coeff}`;
}

// ─── Profile Drawer ───────────────────────────────────────────────────────────

interface ProfileDrawerProps {
  profile: GiornaleProfile;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (updates: Partial<GiornaleProfile>) => void;
}

function ProfileDrawer({
  profile,
  isOpen,
  onToggle,
  onChange,
}: ProfileDrawerProps) {
  const [selectedAteco, setSelectedAteco] = useState<AtecoEntry>(
    () => ATECO_DATA.find((e) => e.code === profile.atecoCode) ?? ATECO_DATA[0],
  );
  const [customRateStr, setCustomRateStr] = useState(
    String(profile.customCassaRate ?? ""),
  );
  const [prevInpsStr, setPrevInpsStr] = useState(
    String(profile.previousYearINPS),
  );

  function handleAtecoChange(entry: AtecoEntry) {
    setSelectedAteco(entry);
    onChange({
      atecoCode: entry.code,
      atecoCoefficient: resolveAtecoCoefficient(entry),
    });
  }

  function handleCustomRateBlur() {
    const n = parseFloat(customRateStr.replace(",", "."));
    if (isFinite(n) && n > 0 && n < 100) onChange({ customCassaRate: n });
  }

  function handlePrevInpsBlur() {
    const n = parseFloat(prevInpsStr.replace(",", "."));
    onChange({ previousYearINPS: isFinite(n) && n >= 0 ? n : 0 });
  }

  return (
    <div className="mb-6">
      {/* Pull tab */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-white border border-zinc-200 px-4 py-3 hover:border-zinc-400 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-editorial text-zinc-500">
            Profilo Fiscale
          </span>
          <span className="hidden sm:block text-xs font-mono text-zinc-400 ml-2">
            {profileSummary(profile)}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {/* sm: summary below pull tab on mobile */}
      {!isOpen && (
        <p className="sm:hidden text-[11px] font-mono text-zinc-400 px-4 py-1.5 bg-white border-x border-b border-zinc-200">
          {profileSummary(profile)}
        </p>
      )}

      {/* Drawer body */}
      {isOpen && (
        <div className="bg-white border-x border-b border-zinc-200 p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* ATECO */}
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 block mb-2">
                Codice ATECO
              </label>
              <AtecoCombobox
                value={selectedAteco}
                onChange={handleAtecoChange}
              />
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Coefficiente:{" "}
                <span className="font-mono font-bold text-zinc-700">
                  {Math.round(profile.atecoCoefficient * 100)}%
                </span>
              </p>
            </div>

            {/* Regime */}
            <div>
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 block mb-2">
                Aliquota Imposta Sostitutiva
                <InfoTooltip content="5% per i primi 5 anni di attività (regime startup). 15% per tutti gli altri." />
              </label>
              <div className="flex gap-2">
                {[
                  { value: false, label: "15% (ordinario)" },
                  { value: true, label: "5% (startup)" },
                ].map(({ value, label }) => (
                  <button
                    key={String(value)}
                    onClick={() => onChange({ isNewBusiness: value })}
                    className={`flex-1 py-2 text-xs font-bold border transition-colors ${
                      profile.isNewBusiness === value
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cassa */}
            <div>
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 block mb-2">
                Contributi Previdenziali
              </label>
              <select
                value={profile.cassaType}
                onChange={(e) =>
                  onChange({ cassaType: e.target.value as CassaType })
                }
                className="w-full text-xs border border-zinc-200 bg-white px-3 py-2 focus:outline-none focus:border-zinc-500"
              >
                {CASSA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {profile.cassaType === "custom" && (
                <div className="flex items-center gap-1 mt-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customRateStr}
                    onChange={(e) => setCustomRateStr(e.target.value)}
                    onBlur={handleCustomRateBlur}
                    placeholder="es. 12"
                    className="w-20 text-xs border-b border-zinc-300 bg-transparent py-1 focus:outline-none focus:border-zinc-700 font-mono"
                  />
                  <span className="text-xs text-zinc-500">%</span>
                </div>
              )}
            </div>

            {/* Prev INPS */}
            <div>
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 block mb-2">
                INPS Versato Anno Precedente
                <InfoTooltip content="Contributi INPS versati nell'anno fiscale precedente. Riducono la base imponibile (principio di cassa). Se è il tuo primo anno, lascia 0." />
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-400 font-mono">€</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={prevInpsStr}
                  onChange={(e) => setPrevInpsStr(e.target.value)}
                  onBlur={handlePrevInpsBlur}
                  placeholder="0"
                  className="flex-1 text-xs border-b border-zinc-300 bg-transparent py-1 focus:outline-none focus:border-zinc-700 font-mono"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3 flex-shrink-0" />
            Salvato solo nel tuo browser. Nessun account, nessun server.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Entry Row ────────────────────────────────────────────────────────────────

interface EntryRowProps {
  entry: GiornaleEntry;
  profile: GiornaleProfile;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onSaveEdit: (id: string, amount: number, label: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

function EntryRow({
  entry,
  profile,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: EntryRowProps) {
  const [editAmount, setEditAmount] = useState(String(entry.amount));
  const [editLabel, setEditLabel] = useState(entry.label);
  const { safeToSpend } = computeSafeToSpend(entry.amount, profile);

  function handleSave() {
    const amount = parseAmount(editAmount);
    if (amount === null) return;
    onSaveEdit(entry.id, amount, editLabel.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      onCancelEdit();
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2 border-b border-zinc-100 last:border-0">
        <span className="text-[10px] font-mono text-zinc-300 w-8 flex-shrink-0">
          {formatDateShort(entry.date)}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-24 text-sm font-mono border-b border-zinc-400 bg-transparent focus:outline-none focus:border-zinc-700 py-0.5"
          placeholder="Importo"
        />
        <input
          type="text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 text-xs border-b border-zinc-300 bg-transparent focus:outline-none focus:border-zinc-600 py-0.5 text-zinc-600"
          placeholder="Descrizione (opzionale)"
        />
        <button
          onClick={handleSave}
          className="p-1 text-emerald-600 hover:text-emerald-700 flex-shrink-0"
          aria-label="Salva modifica"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onCancelEdit}
          className="p-1 text-zinc-400 hover:text-zinc-700 flex-shrink-0"
          aria-label="Annulla modifica"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2 border-b border-zinc-100 last:border-0 group">
      <span className="text-[10px] font-mono text-zinc-300 w-8 flex-shrink-0">
        {formatDateShort(entry.date)}
      </span>
      <span className="flex-1 min-w-0 text-xs text-zinc-500 truncate">
        {entry.label || <span className="text-zinc-300 italic">—</span>}
      </span>
      {/* safe-to-spend chip */}
      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 flex-shrink-0">
        <span className="text-emerald-400">spendi</span>{" "}
        {formatCurrency(safeToSpend)}
      </span>
      <span className="text-sm font-mono font-bold text-zinc-800 flex-shrink-0">
        {formatCurrency(entry.amount)}
      </span>
      <button
        onClick={() => {
          setEditAmount(String(entry.amount));
          setEditLabel(entry.label);
          onStartEdit(entry.id);
        }}
        className="p-1 text-zinc-300 hover:text-zinc-600 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label="Modifica"
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={() => onDelete(entry.id)}
        className="p-1 text-zinc-300 hover:text-red-500 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label="Elimina incasso"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Month Panel ──────────────────────────────────────────────────────────────

interface MonthPanelProps {
  month: number;
  entries: GiornaleEntry[];
  profile: GiornaleProfile;
  isCurrentMonth: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (month: number, entries: GiornaleEntry[]) => void;
}

function MonthPanel({
  month,
  entries,
  profile,
  isCurrentMonth,
  isExpanded,
  onToggle,
  onChange,
}: MonthPanelProps) {
  const [addAmount, setAddAmount] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [syncFlash, setSyncFlash] = useState(false);

  const total = getMonthTotal(entries);
  const { safeToSpend, toReserve, reservePct } = computeSafeToSpend(
    total,
    profile,
  );
  const monthName = MONTHS_IT[month - 1];

  function flash() {
    setSyncFlash(true);
    setTimeout(() => setSyncFlash(false), 2200);
  }

  function handleAdd() {
    const amount = parseAmount(addAmount);
    if (amount === null) return;
    const newEntry: GiornaleEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      amount,
      label: addLabel.trim(),
    };
    onChange(month, [...entries, newEntry]);
    setAddAmount("");
    setAddLabel("");
    flash();
  }

  function handleAddKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  function handleDelete(id: string) {
    onChange(
      month,
      entries.filter((e) => e.id !== id),
    );
    if (editingId === id) setEditingId(null);
    flash();
  }

  function handleSaveEdit(id: string, amount: number, label: string) {
    onChange(
      month,
      entries.map((e) => (e.id === id ? { ...e, amount, label } : e)),
    );
    setEditingId(null);
    flash();
  }

  const isCollapsed = !isExpanded;

  return (
    <div className={`mb-3 ${isCurrentMonth ? "ring-1 ring-zinc-950/10" : ""}`}>
      {/* Month header — always visible */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
          isCurrentMonth
            ? "bg-zinc-950 text-white"
            : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400"
        }`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-black ${isCurrentMonth ? "text-white" : "text-zinc-950"}`}
          >
            {monthName} {TAX_YEAR}
          </span>
          {isCurrentMonth && (
            <span className="text-[9px] uppercase tracking-widest font-black text-zinc-400 bg-zinc-800 px-1.5 py-0.5">
              MESE CORRENTE
            </span>
          )}
          {!isCurrentMonth && entries.length === 0 && (
            <span className="text-[10px] text-zinc-300 font-mono">
              Nessun incasso
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {(total > 0 || entries.length > 0) && (
            <span
              className={`text-sm font-mono font-bold ${isCurrentMonth ? "text-white" : "text-zinc-700"}`}
            >
              {formatCurrency(total)}
              <span
                className={`ml-2 text-[10px] font-normal ${isCurrentMonth ? "text-zinc-400" : "text-zinc-400"}`}
              >
                {entries.length} {entries.length === 1 ? "incasso" : "incassi"}
              </span>
            </span>
          )}
          {isCollapsed ? (
            <ChevronDown
              className={`w-4 h-4 ${isCurrentMonth ? "text-zinc-400" : "text-zinc-400"}`}
            />
          ) : (
            <ChevronUp
              className={`w-4 h-4 ${isCurrentMonth ? "text-zinc-400" : "text-zinc-400"}`}
            />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div
          className={`border-x border-b ${isCurrentMonth ? "border-zinc-950/10" : "border-zinc-200"} bg-white`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* ── Left: entries + add form ── */}
            <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-zinc-100">
              {/* Add form */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex items-center flex-shrink-0">
                  <span className="text-xs text-zinc-400 font-mono absolute left-0">
                    €
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    onKeyDown={handleAddKeyDown}
                    placeholder="0"
                    className="w-28 pl-3.5 text-sm font-mono border-b border-zinc-300 bg-transparent py-2 focus:outline-none focus:border-zinc-700"
                    aria-label="Importo incasso"
                  />
                </div>
                <input
                  type="text"
                  value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                  onKeyDown={handleAddKeyDown}
                  placeholder="Descrizione (opzionale)"
                  className="flex-1 min-w-0 text-xs border-b border-zinc-200 bg-transparent py-2 focus:outline-none focus:border-zinc-500 text-zinc-600"
                  aria-label="Descrizione incasso"
                />
                <button
                  onClick={handleAdd}
                  disabled={!parseAmount(addAmount)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white text-xs font-bold uppercase tracking-editorial hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Aggiungi incasso"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Aggiungi</span>
                </button>
              </div>

              {/* Entry list */}
              {entries.length > 0 ? (
                <div>
                  {[...entries].reverse().map((entry) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      profile={profile}
                      isEditing={editingId === entry.id}
                      onStartEdit={setEditingId}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={() => setEditingId(null)}
                      onDelete={handleDelete}
                    />
                  ))}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400">
                      Totale {monthName}
                    </span>
                    <span className="text-base font-black font-mono text-zinc-950">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-4 text-center border border-dashed border-zinc-200">
                  Nessun incasso registrato per {monthName}.
                </p>
              )}
            </div>

            {/* ── Right: monthly summary ── */}
            <div className="p-5 space-y-4">
              <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400">
                Riepilogo {monthName}
              </p>

              {total > 0 ? (
                <>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-zinc-500">
                        Lordo incassato
                      </span>
                      <span className="text-sm font-mono font-bold text-zinc-900">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        Da accantonare
                        <InfoTooltip
                          content={`Stima delle tasse + INPS da accantonare (${Math.round(reservePct * 100)}% del lordo). Non considera le spese reali né l'INPS deducibile dell'anno precedente. Usa il Simulatore per il calcolo annuale completo.`}
                          side="top"
                        />
                      </span>
                      <span className="text-sm font-mono font-bold text-red-600">
                        {formatCurrency(toReserve)}
                      </span>
                    </div>
                    <div className="h-px bg-zinc-100" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-zinc-700">
                        Netto stimato
                      </span>
                      <span className="text-base font-black font-mono text-emerald-600">
                        {formatCurrency(safeToSpend)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Stima indicativa.{" "}
                    <Link
                      href={`/calcolatori/forfettario?rev=${Math.round(total * 12)}`}
                      className="underline underline-offset-2 hover:text-zinc-700"
                    >
                      Simula su base annua →
                    </Link>
                  </p>
                </>
              ) : (
                <p className="text-xs text-zinc-400">
                  Aggiungi un incasso per vedere il riepilogo fiscale.
                </p>
              )}

              {/* Cliff sync indicator */}
              <div
                className={`flex items-center gap-1.5 transition-opacity duration-300 ${syncFlash ? "opacity-100" : "opacity-40"}`}
              >
                <TrendingUp className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                <span className="text-[10px] text-zinc-400">
                  Tax Cliff Monitor aggiornato
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GiornaleCalcolatore() {
  const [profile, setProfile] = useState<GiornaleProfile>(DEFAULT_PROFILE);
  const [entries, setEntries] = useState<GiornaleData>({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

  const currentMonth = new Date().getMonth() + 1;

  // Defer localStorage reads to avoid SSR/client hydration mismatch
  useEffect(() => {
    setProfile(readProfile());
    setEntries(readEntries());
    setExpandedMonths(new Set([new Date().getMonth() + 1]));
  }, []);

  function handleProfileChange(updates: Partial<GiornaleProfile>) {
    const next = { ...profile, ...updates };
    setProfile(next);
    saveProfile(next);
  }

  function handleEntriesChange(month: number, monthEntries: GiornaleEntry[]) {
    const next = { ...entries, [month]: monthEntries };
    setEntries(next);
    saveEntries(next);
    syncMonthToCliff(month, monthEntries);
  }

  function toggleMonth(month: number) {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }

  // All months from January to current, reversed so current is always at top
  const visibleMonths = Array.from(
    { length: currentMonth },
    (_, i) => currentMonth - i,
  );

  // YTD total across all months
  const ytdTotal = visibleMonths.reduce(
    (sum, m) => sum + getMonthTotal(entries[m] ?? []),
    0,
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            Registro Incassi {TAX_YEAR}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            Logga ogni incasso.
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Registra ogni pagamento ricevuto, vedi subito quanto puoi spendere e
            quanto accantonare. Il Tax Cliff Monitor si aggiorna
            automaticamente.
          </p>
          {ytdTotal > 0 && (
            <p className="mt-4 text-2xl font-black font-mono text-zinc-950">
              {formatCurrency(ytdTotal)}{" "}
              <span className="text-sm font-normal text-zinc-400">
                fatturati nel {TAX_YEAR}
              </span>
            </p>
          )}
        </div>

        {/* Profile drawer */}
        <ProfileDrawer
          profile={profile}
          isOpen={profileOpen}
          onToggle={() => setProfileOpen((o) => !o)}
          onChange={handleProfileChange}
        />

        {/* Month panels — current month first, then past months */}
        {visibleMonths.map((month) => (
          <MonthPanel
            key={month}
            month={month}
            entries={entries[month] ?? []}
            profile={profile}
            isCurrentMonth={month === currentMonth}
            isExpanded={expandedMonths.has(month)}
            onToggle={() => toggleMonth(month)}
            onChange={handleEntriesChange}
          />
        ))}

        {/* Privacy note */}
        <div className="mt-6 flex items-start gap-2 border border-zinc-200 bg-zinc-50 p-4">
          <Lock className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Tutti i dati rimangono esclusivamente nel tuo browser — nessun
            server, nessun account. Si azzerano se svuoti la cache del browser.
          </p>
        </div>
      </div>
    </div>
  );
}
