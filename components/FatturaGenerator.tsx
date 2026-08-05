"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Plus, Trash2, Upload, X, FileText } from "lucide-react";
import type {
  FatturaData,
  FatturaItem,
  DocType,
} from "@/components/FatturaDocument";

// ─── Types ────────────────────────────────────────────────────────────────────

type PdfStatus = "idle" | "generating" | "done";

interface DownloadNotice {
  url: string;
  fileName: string;
}

const LS_KEY = "burzero_proforma_v1";

const EMPTY_ITEM = (): FatturaItem => ({
  description: "",
  quantity: 1,
  unit: "pc",
  price: 0,
  discount: 0,
});

const CURRENCIES = ["EUR", "USD", "GBP"];
const UNITS = ["pc", "ore", "giorni", "mese", "progetto", "km"];

interface SavedDraft {
  docType?: DocType;
  from?: string;
  to?: string;
  invoiceNumber?: string;
  currency?: string;
  invoiceDate?: string;
  dueDate?: string;
  interest?: string;
  items?: FatturaItem[];
  notes?: string;
  bankDetails?: string;
  isForfettario?: boolean;
  ritenuta?: boolean;
  taxRate?: number;
  roundingAmount?: number;
}

function readSavedDraft(): SavedDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SavedDraft;
  } catch {
    return {};
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCurrency(val: number, currency: string): string {
  const sym: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
  const s = sym[currency] ?? currency;
  return `${s}${val.toFixed(2)}`;
}

function itemNet(item: FatturaItem): number {
  const gross = item.quantity * item.price;
  return gross - gross * (item.discount / 100);
}

function parseLooseNumber(raw: string, integer = false): number | null {
  const normalized = raw
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "")
    .trim();
  if (
    normalized === "" ||
    normalized === "." ||
    normalized === "-" ||
    normalized === "-."
  ) {
    return null;
  }
  const parsed = integer ? parseInt(normalized, 10) : parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function asInputValue(value: number): string {
  return value === 0 ? "" : String(value);
}

function sanitizeFileToken(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 40);
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function buildFatturaPdfFileName(
  docType: DocType,
  invoiceNumber: string,
  invoiceDate: string,
): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
  const docLabel = docType === "pro_forma" ? "ProForma" : "AvvisoParcella";
  const invoiceToken = sanitizeFileToken(invoiceNumber) || "NDoc";
  const dateToken = invoiceDate ? invoiceDate.replace(/-/g, "") : "NoData";
  return `BurZero-${docLabel}-${invoiceToken}-${dateToken}-${timestamp}.pdf`;
}

type NumericItemField = "quantity" | "price" | "discount";

// ─── Component ───────────────────────────────────────────────────────────────

export default function FatturaGenerator() {
  const today = new Date().toISOString().split("T")[0];
  const savedDraft = useMemo(() => readSavedDraft(), []);

  // Form state
  const [docType, setDocType] = useState<DocType>(
    savedDraft.docType ?? "avviso_di_parcella",
  );
  const [from, setFrom] = useState(savedDraft.from ?? "");
  const [to, setTo] = useState(savedDraft.to ?? "");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(
    savedDraft.invoiceNumber ?? "1",
  );
  const [currency, setCurrency] = useState(savedDraft.currency ?? "EUR");
  const [invoiceDate, setInvoiceDate] = useState(
    savedDraft.invoiceDate ?? today,
  );
  const [dueDate, setDueDate] = useState(savedDraft.dueDate ?? "");
  const [interest, setInterest] = useState(savedDraft.interest ?? "");
  const [items, setItems] = useState<FatturaItem[]>(
    savedDraft.items?.length ? savedDraft.items : [EMPTY_ITEM()],
  );
  const [notes, setNotes] = useState(savedDraft.notes ?? "");
  const [bankDetails, setBankDetails] = useState(savedDraft.bankDetails ?? "");
  const [isForfettario, setIsForfettario] = useState(
    savedDraft.isForfettario ?? false,
  );
  const [ritenuta, setRitenuta] = useState(savedDraft.ritenuta ?? false);
  const [taxRate, setTaxRate] = useState(savedDraft.taxRate ?? 22);
  const [roundingAmount] = useState(savedDraft.roundingAmount ?? 0);

  // UI state
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<DownloadNotice | null>(
    null,
  );
  const [itemNumericDrafts, setItemNumericDrafts] = useState<
    Record<string, string>
  >({});
  const [taxRateDraft, setTaxRateDraft] = useState<string | null>(null);
  const canShareApi = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && "share" in navigator,
    () => false,
  );
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const revokeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── localStorage persistence ────────────────────────────────────────────

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          docType,
          from,
          to,
          invoiceNumber,
          currency,
          invoiceDate,
          dueDate,
          interest,
          items,
          notes,
          bankDetails,
          isForfettario,
          ritenuta,
          taxRate,
          roundingAmount,
        }),
      );
    } catch {}
  }, [
    docType,
    from,
    to,
    invoiceNumber,
    currency,
    invoiceDate,
    dueDate,
    interest,
    items,
    notes,
    bankDetails,
    isForfettario,
    ritenuta,
    taxRate,
    roundingAmount,
  ]);

  // ─── Totals ──────────────────────────────────────────────────────────────

  const subtotal = items.reduce((acc, item) => acc + itemNet(item), 0);
  const taxAmount = isForfettario ? 0 : subtotal * (taxRate / 100);
  const ritenutaAmount = ritenuta ? subtotal * 0.2 : 0;
  const marcaDaBollo = subtotal > 77.47 && isForfettario ? 2 : 0;
  const total =
    subtotal + taxAmount - ritenutaAmount + roundingAmount + marcaDaBollo;

  // ─── Logo upload ─────────────────────────────────────────────────────────

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Il logo deve essere inferiore a 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") setLogoBase64(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ─── Line items ──────────────────────────────────────────────────────────

  const addItem = () => setItems((prev) => [...prev, EMPTY_ITEM()]);

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (
    idx: number,
    field: keyof FatturaItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const itemNumericKey = (idx: number, field: NumericItemField) =>
    `${idx}:${field}`;

  const getItemNumericValue = (
    idx: number,
    field: NumericItemField,
    currentValue: number,
  ) => {
    const key = itemNumericKey(idx, field);
    if (Object.prototype.hasOwnProperty.call(itemNumericDrafts, key)) {
      return itemNumericDrafts[key];
    }
    return asInputValue(currentValue);
  };

  const setItemNumericDraft = (
    idx: number,
    field: NumericItemField,
    raw: string,
  ) => {
    const key = itemNumericKey(idx, field);
    setItemNumericDrafts((prev) => ({ ...prev, [key]: raw }));
  };

  const clearItemNumericDraft = (idx: number, field: NumericItemField) => {
    const key = itemNumericKey(idx, field);
    setItemNumericDrafts((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, key)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const parseItemNumeric = (
    raw: string,
    options: { integer?: boolean; min?: number; max?: number } = {},
  ) => {
    const parsed = parseLooseNumber(raw, options.integer);
    if (parsed === null) return null;
    let next = parsed;
    if (options.integer) next = Math.trunc(next);
    if (options.min !== undefined) next = Math.max(options.min, next);
    if (options.max !== undefined) next = Math.min(options.max, next);
    return next;
  };

  const updateItemNumericDraft = (
    idx: number,
    field: NumericItemField,
    raw: string,
    options: { integer?: boolean; min?: number; max?: number } = {},
  ) => {
    setItemNumericDraft(idx, field, raw);
    const trimmed = raw.trim();
    if (trimmed === "") {
      updateItem(idx, field, 0);
      return;
    }
    const next = parseItemNumeric(raw, options);
    if (next !== null) {
      updateItem(idx, field, next);
    }
  };

  // ─── PDF generation ──────────────────────────────────────────────────────

  const generatePdf = async () => {
    if (pdfStatus === "generating") return;
    setPdfStatus("generating");
    try {
      const [{ pdf }, { default: FatturaDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/FatturaDocument"),
      ]);

      const data: FatturaData = {
        docType,
        from,
        to,
        logoBase64,
        invoiceNumber,
        currency,
        invoiceDate,
        dueDate,
        interest,
        items,
        notes,
        bankDetails,
        isForfettario,
        ritenuta,
        taxRate,
        roundingAmount,
      };

      const blob = await pdf(<FatturaDocument data={data} />).toBlob();
      const fileName = buildFatturaPdfFileName(
        docType,
        invoiceNumber,
        invoiceDate,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadNotice({ url, fileName });

      if (revokeTimerRef.current) clearTimeout(revokeTimerRef.current);
      revokeTimerRef.current = setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 120000);

      setPdfStatus("done");
      setTimeout(() => setPdfStatus("idle"), 2500);
    } catch (e) {
      console.error("PDF generation failed:", e);
      setPdfStatus("idle");
    }
  };

  useEffect(() => {
    return () => {
      if (revokeTimerRef.current) clearTimeout(revokeTimerRef.current);
      if (downloadNotice?.url) URL.revokeObjectURL(downloadNotice.url);
    };
  }, [downloadNotice]);

  const handleOpenDownloadedPdf = () => {
    if (!downloadNotice) return;
    window.open(downloadNotice.url, "_blank", "noopener,noreferrer");
  };

  const handleShareDownloadedPdf = async () => {
    if (!downloadNotice) return;
    if (!canShareApi) return;
    try {
      const response = await fetch(downloadNotice.url);
      const blob = await response.blob();
      const file = new File([blob], downloadNotice.fileName, {
        type: "application/pdf",
      });
      const canShareFiles =
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });
      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: downloadNotice.fileName,
        });
      } else {
        await navigator.share({
          title: downloadNotice.fileName,
          text: "PDF pronto: aprilo subito da qui.",
          url: downloadNotice.url,
        });
      }
    } catch {
      // User canceled share or browser blocked it.
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  const sym: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
  const currSym = sym[currency] ?? currency;

  return isClient ? (
    <>
      {/* Generating overlay */}
      {pdfStatus === "generating" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold uppercase tracking-editorial text-zinc-950">
              Generazione PDF...
            </p>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-stone-50 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page header */}
          <div className="mb-8 pt-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-zinc-400" />
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400">
                Strumento 05 - Emetti
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 leading-none mb-2">
              Pro-Forma /{" "}
              <span className="text-zinc-400 font-normal">
                Avviso di Parcella
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Documento di richiesta pagamento - non è una fattura fiscale. La
              fattura elettronica parte solo a incasso avvenuto.
            </p>
          </div>

          <div className="space-y-6">
            {/* ── FROM / TO / LOGO ─────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* From */}
              <div className="bg-white border border-zinc-200 p-5">
                <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Da (il tuo profilo)
                </label>
                <textarea
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder={
                    "Ragione Sociale / Nome\nPartita IVA / CF\nIndirizzo\nCodice SDI / PEC"
                  }
                  rows={5}
                  className="w-full text-sm text-zinc-800 placeholder:text-zinc-300 resize-none focus:outline-none leading-relaxed"
                />
              </div>

              {/* To */}
              <div className="bg-white border border-zinc-200 p-5">
                <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  A (cliente)
                </label>
                <textarea
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder={
                    "Ragione Sociale / Nome\nPartita IVA / CF\nIndirizzo\nCodice SDI / PEC"
                  }
                  rows={5}
                  className="w-full text-sm text-zinc-800 placeholder:text-zinc-300 resize-none focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Logo upload */}
            <div className="bg-white border border-zinc-200 p-5">
              <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                Logo (opzionale - JPG, PNG, max 5MB)
              </label>
              {logoBase64 ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoBase64}
                    alt="Logo anteprima"
                    className="h-16 w-auto object-contain border border-zinc-100"
                  />
                  <button
                    onClick={() => setLogoBase64(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-600 transition-colors uppercase tracking-editorial"
                  >
                    <X className="w-3.5 h-3.5" />
                    Rimuovi
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed transition-colors h-24 ${
                    isDragging
                      ? "border-zinc-950 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <Upload className="w-5 h-5 text-zinc-300" />
                  <p className="text-xs text-zinc-400">
                    Trascina qui o{" "}
                    <span className="font-bold text-zinc-600 underline underline-offset-2">
                      scegli file
                    </span>
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFilePick}
              />
            </div>

            {/* ── INVOICE META ─────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400">
                  Dati documento
                </label>
                {/* Doc type selector */}
                <div className="flex border border-zinc-200 overflow-hidden">
                  <button
                    onClick={() => setDocType("avviso_di_parcella")}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-editorial transition-colors ${
                      docType === "avviso_di_parcella"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    Avviso di Parcella
                  </button>
                  <button
                    onClick={() => setDocType("pro_forma")}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-editorial transition-colors ${
                      docType === "pro_forma"
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    Pro-Forma
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-editorial text-zinc-400 mb-1.5">
                    N. Documento
                  </p>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full border border-zinc-200 px-2.5 py-2 text-sm font-bold text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-editorial text-zinc-400 mb-1.5">
                    Valuta
                  </p>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full border border-zinc-200 px-2.5 py-2 text-sm text-zinc-800 bg-white focus:outline-none focus:border-zinc-400"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-editorial text-zinc-400 mb-1.5">
                    Data fattura
                  </p>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full border border-zinc-200 px-2.5 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-editorial text-zinc-400 mb-1.5">
                    Scadenza
                  </p>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-zinc-200 px-2.5 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
              <div className="mt-4 max-w-xs">
                <p className="text-[9px] uppercase tracking-editorial text-zinc-400 mb-1.5">
                  Interessi di mora (%)
                </p>
                <input
                  type="text"
                  inputMode="decimal"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="0"
                  className="w-full border border-zinc-200 px-2.5 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* ── LINE ITEMS ───────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 overflow-hidden">
              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-zinc-100">
                {items.map((item, idx) => (
                  <div key={idx} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400">
                        Voce {idx + 1}
                      </p>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-editorial text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Rimuovi
                        </button>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                        Descrizione
                      </p>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(idx, "description", e.target.value)
                        }
                        placeholder="Descrizione prestazione..."
                        className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                          Qtà
                        </p>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={getItemNumericValue(
                            idx,
                            "quantity",
                            item.quantity,
                          )}
                          onChange={(e) =>
                            updateItemNumericDraft(
                              idx,
                              "quantity",
                              e.target.value,
                              {
                                integer: true,
                                min: 0,
                              },
                            )
                          }
                          onBlur={() => clearItemNumericDraft(idx, "quantity")}
                          placeholder="0"
                          className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                          Unità
                        </p>
                        <select
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(idx, "unit", e.target.value)
                          }
                          className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 bg-white focus:outline-none focus:border-zinc-400"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                          Prezzo
                        </p>
                        <div className="flex items-center border border-zinc-200 px-3 py-2.5">
                          <span className="text-xs text-zinc-400 mr-1">
                            {currSym}
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={getItemNumericValue(
                              idx,
                              "price",
                              item.price,
                            )}
                            onChange={(e) =>
                              updateItemNumericDraft(
                                idx,
                                "price",
                                e.target.value,
                                {
                                  min: 0,
                                },
                              )
                            }
                            onBlur={() => clearItemNumericDraft(idx, "price")}
                            placeholder="0"
                            className="w-full text-sm text-zinc-800 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                          Sconto %
                        </p>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={getItemNumericValue(
                            idx,
                            "discount",
                            item.discount,
                          )}
                          onChange={(e) =>
                            updateItemNumericDraft(
                              idx,
                              "discount",
                              e.target.value,
                              {
                                integer: true,
                                min: 0,
                                max: 100,
                              },
                            )
                          }
                          onBlur={() => clearItemNumericDraft(idx, "discount")}
                          placeholder="0"
                          className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="pt-1 border-t border-zinc-100 flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400">
                        Importo
                      </p>
                      <p className="text-base font-black font-mono text-zinc-950">
                        {fmtCurrency(itemNet(item), currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block">
                <div className="bg-zinc-950 px-5 py-3 grid grid-cols-12 gap-2">
                  <p className="col-span-4 text-[9px] uppercase tracking-editorial font-semibold text-white">
                    Descrizione
                  </p>
                  <p className="col-span-1 text-[9px] uppercase tracking-editorial font-semibold text-white text-right">
                    Qtà
                  </p>
                  <p className="col-span-2 text-[9px] uppercase tracking-editorial font-semibold text-white">
                    Unità
                  </p>
                  <p className="col-span-2 text-[9px] uppercase tracking-editorial font-semibold text-white text-right">
                    Prezzo
                  </p>
                  <p className="col-span-1 text-[9px] uppercase tracking-editorial font-semibold text-white text-right">
                    Sc.%
                  </p>
                  <p className="col-span-2 text-[9px] uppercase tracking-editorial font-semibold text-white text-right">
                    Importo
                  </p>
                </div>

                <div className="divide-y divide-zinc-100">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-5 py-3 grid grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(idx, "description", e.target.value)
                        }
                        placeholder="Descrizione prestazione..."
                        className="col-span-4 text-sm text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={getItemNumericValue(
                          idx,
                          "quantity",
                          item.quantity,
                        )}
                        onChange={(e) =>
                          updateItemNumericDraft(
                            idx,
                            "quantity",
                            e.target.value,
                            {
                              integer: true,
                              min: 0,
                            },
                          )
                        }
                        onBlur={() => clearItemNumericDraft(idx, "quantity")}
                        placeholder="0"
                        className="col-span-1 text-sm text-zinc-800 text-right focus:outline-none border-b border-zinc-200 focus:border-zinc-400"
                      />
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(idx, "unit", e.target.value)
                        }
                        className="col-span-2 text-sm text-zinc-800 bg-white focus:outline-none border border-zinc-200 px-1.5 py-0.5 focus:border-zinc-400"
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <div className="col-span-2 flex items-center gap-0.5">
                        <span className="text-xs text-zinc-400">{currSym}</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={getItemNumericValue(idx, "price", item.price)}
                          onChange={(e) =>
                            updateItemNumericDraft(
                              idx,
                              "price",
                              e.target.value,
                              {
                                min: 0,
                              },
                            )
                          }
                          onBlur={() => clearItemNumericDraft(idx, "price")}
                          placeholder="0"
                          className="w-full text-sm text-zinc-800 text-right focus:outline-none border-b border-zinc-200 focus:border-zinc-400"
                        />
                      </div>
                      <div className="col-span-1 flex items-center gap-0.5">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={getItemNumericValue(
                            idx,
                            "discount",
                            item.discount,
                          )}
                          onChange={(e) =>
                            updateItemNumericDraft(
                              idx,
                              "discount",
                              e.target.value,
                              {
                                integer: true,
                                min: 0,
                                max: 100,
                              },
                            )
                          }
                          onBlur={() => clearItemNumericDraft(idx, "discount")}
                          placeholder="0"
                          className="w-full text-sm text-zinc-800 text-right focus:outline-none border-b border-zinc-200 focus:border-zinc-400"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="text-sm font-bold text-zinc-950">
                          {fmtCurrency(itemNet(item), currency)}
                        </span>
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(idx)}
                            className="text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add item */}
              <div className="px-5 py-3 border-t border-zinc-100">
                <button
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-editorial text-zinc-400 hover:text-zinc-950 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Aggiungi voce
                </button>
              </div>
            </div>

            {/* ── ITALIAN TOGGLES ──────────────────────────────── */}
            <div className="bg-white border border-zinc-200 p-5">
              <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                Opzioni fiscali italiane
              </label>

              <div className="space-y-4">
                {/* Forfettario toggle */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      const next = !isForfettario;
                      setIsForfettario(next);
                      if (next) setRitenuta(false); // mutually exclusive
                    }}
                    className={`mt-0.5 flex-shrink-0 w-10 h-5 rounded-full transition-colors ${
                      isForfettario ? "bg-zinc-950" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
                        isForfettario ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">
                      Regime Forfettario
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Aggiunge automaticamente la dicitura legale di esenzione
                      IVA (art. 1, commi 54-89, L. 190/2014). Il campo IVA viene
                      disabilitato.
                    </p>
                  </div>
                </div>

                {/* IVA rate - shown only when NOT forfettario */}
                {!isForfettario && (
                  <div className="flex items-center gap-4 pl-13">
                    <div className="ml-[52px]">
                      <p className="text-xs text-zinc-400 mb-1.5 uppercase tracking-editorial font-semibold">
                        Aliquota IVA (%)
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={taxRateDraft ?? asInputValue(taxRate)}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setTaxRateDraft(raw);
                          if (raw.trim() === "") {
                            setTaxRate(0);
                            return;
                          }
                          const parsed = parseLooseNumber(raw, true);
                          if (parsed !== null) {
                            const next = Math.max(0, Math.trunc(parsed));
                            setTaxRate(Math.min(30, next));
                          }
                        }}
                        onBlur={() => {
                          setTaxRateDraft(null);
                        }}
                        placeholder="0"
                        className="border border-zinc-200 px-2.5 py-2 text-sm font-bold text-zinc-800 w-24 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                  </div>
                )}

                {/* Ritenuta - incompatible with Forfettario */}
                <div
                  className={`flex items-start gap-3 ${
                    isForfettario ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <button
                    onClick={() => setRitenuta((v) => !v)}
                    disabled={isForfettario}
                    className={`mt-0.5 flex-shrink-0 w-10 h-5 rounded-full transition-colors ${
                      ritenuta ? "bg-zinc-950" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
                        ritenuta ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">
                      Ritenuta d&apos;acconto (20%)
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isForfettario
                        ? "Non applicabile in Regime Forfettario - il contribuente è escluso dalla qualifica di sostituto d imposta."
                        : "Deduce automaticamente il 20% dal totale. Il cliente trattiene questa quota e la versa al fisco per tuo conto."}
                    </p>
                  </div>
                </div>

                {/* Marca da bollo info */}
                {subtotal > 77.47 && isForfettario && (
                  <div className="ml-[52px] border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-bold text-amber-700">
                      Marca da bollo richiesta - €2,00
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      L&apos;importo supera €77,47. In Regime Forfettario la
                      marca da bollo da €2 è obbligatoria. Verrà inclusa nel
                      PDF.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── NOTES / BANK ─────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-zinc-200 p-5">
                <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Note aggiuntive
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Eventuali condizioni, riferimenti ordine, ecc."
                  rows={4}
                  className="w-full text-sm text-zinc-800 placeholder:text-zinc-300 resize-none focus:outline-none leading-relaxed"
                />
              </div>
              <div className="bg-white border border-zinc-200 p-5">
                <label className="block text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-3">
                  Coordinate bancarie
                </label>
                <textarea
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  placeholder={
                    "IBAN: IT00 X000 0000 0000 0000 0000 000\nBIC/SWIFT: XXXXXXXX\nBanca: Nome Istituto"
                  }
                  rows={4}
                  className="w-full text-sm text-zinc-800 placeholder:text-zinc-300 resize-none focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* ── TOTALS SUMMARY + DOWNLOAD ────────────────────── */}
            <div className="bg-white border border-zinc-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                {/* Totals */}
                <div className="space-y-1.5 min-w-[220px]">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Imponibile</span>
                    <span className="font-bold text-zinc-800">
                      {fmtCurrency(subtotal, currency)}
                    </span>
                  </div>
                  {!isForfettario && taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">IVA {taxRate}%</span>
                      <span className="font-bold text-zinc-800">
                        {fmtCurrency(taxAmount, currency)}
                      </span>
                    </div>
                  )}
                  {ritenuta && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">
                        Ritenuta d&apos;acconto (20%)
                      </span>
                      <span className="font-bold text-red-600">
                        -{fmtCurrency(ritenutaAmount, currency)}
                      </span>
                    </div>
                  )}
                  {marcaDaBollo > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Marca da bollo</span>
                      <span className="font-bold text-zinc-800">
                        {fmtCurrency(marcaDaBollo, currency)}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-zinc-200 flex justify-between">
                    <span className="text-base font-black text-zinc-950">
                      TOTALE
                    </span>
                    <span className="text-base font-black text-zinc-950">
                      {fmtCurrency(total, currency)}
                    </span>
                  </div>
                  {ritenuta && (
                    <p className="text-[10px] text-zinc-400 pt-1">
                      * Tu incassi{" "}
                      <strong>{fmtCurrency(total, currency)}</strong>. Il
                      cliente trattiene{" "}
                      <strong>{fmtCurrency(ritenutaAmount, currency)}</strong> e
                      li versa all&apos;Agenzia delle Entrate per tuo conto.
                    </p>
                  )}
                </div>

                {/* Download button */}
                <button
                  onClick={generatePdf}
                  disabled={pdfStatus !== "idle"}
                  className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-editorial transition-colors ${
                    pdfStatus === "done"
                      ? "bg-green-700 text-white"
                      : "bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-60"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {pdfStatus === "idle" && "Scarica Pro-Forma PDF"}
                  {pdfStatus === "generating" && "Generazione..."}
                  {pdfStatus === "done" && "✓ Download Avviato"}
                </button>
              </div>

              {downloadNotice && (
                <div className="mt-4 border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-editorial">
                    PDF pronto
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Download avviato. Aprilo subito o condividilo dal telefono.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={handleOpenDownloadedPdf}
                      className="text-[11px] font-bold uppercase tracking-editorial bg-white border border-emerald-300 text-emerald-700 px-2.5 py-1.5 hover:bg-emerald-100 transition-colors"
                    >
                      Apri PDF
                    </button>
                    {canShareApi && (
                      <button
                        onClick={handleShareDownloadedPdf}
                        className="text-[11px] font-bold uppercase tracking-editorial bg-white border border-emerald-300 text-emerald-700 px-2.5 py-1.5 hover:bg-emerald-100 transition-colors"
                      >
                        Condividi
                      </button>
                    )}
                    <button
                      onClick={() => setDownloadNotice(null)}
                      className="text-[11px] font-bold uppercase tracking-editorial text-emerald-700 px-2 py-1.5"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-zinc-400 leading-relaxed text-center pb-2">
              Il Pro-Forma / Avviso di Parcella non è una fattura elettronica ai
              sensi del D.P.R. 633/72 e non ha valore fiscale. Dati salvati
              automaticamente nel browser. Verifica sempre con il tuo
              commercialista.
            </p>
          </div>
        </div>
      </main>
    </>
  ) : null;
}
