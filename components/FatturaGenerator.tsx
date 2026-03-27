"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Trash2, Upload, X, FileText, Info } from "lucide-react";
import type {
  FatturaData,
  FatturaItem,
  DocType,
} from "@/components/FatturaDocument";

// ─── Types ────────────────────────────────────────────────────────────────────

type PdfStatus = "idle" | "generating" | "done";

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function FatturaGenerator() {
  const today = new Date().toISOString().split("T")[0];

  // Form state
  const [docType, setDocType] = useState<DocType>("avviso_di_parcella");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("1");
  const [currency, setCurrency] = useState("EUR");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [interest, setInterest] = useState("");
  const [items, setItems] = useState<FatturaItem[]>([EMPTY_ITEM()]);
  const [notes, setNotes] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [isForfettario, setIsForfettario] = useState(false);
  const [ritenuta, setRitenuta] = useState(false);
  const [taxRate, setTaxRate] = useState(22);
  const [roundingAmount, setRoundingAmount] = useState(0);

  // UI state
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── localStorage persistence ────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.docType) setDocType(d.docType);
      if (d.from !== undefined) setFrom(d.from);
      if (d.to !== undefined) setTo(d.to);
      if (d.invoiceNumber !== undefined) setInvoiceNumber(d.invoiceNumber);
      if (d.currency) setCurrency(d.currency);
      if (d.invoiceDate) setInvoiceDate(d.invoiceDate);
      if (d.dueDate !== undefined) setDueDate(d.dueDate);
      if (d.interest !== undefined) setInterest(d.interest);
      if (d.items?.length) setItems(d.items);
      if (d.notes !== undefined) setNotes(d.notes);
      if (d.bankDetails !== undefined) setBankDetails(d.bankDetails);
      if (d.isForfettario !== undefined) setIsForfettario(d.isForfettario);
      if (d.ritenuta !== undefined) setRitenuta(d.ritenuta);
      if (d.taxRate !== undefined) setTaxRate(d.taxRate);
      if (d.roundingAmount !== undefined) setRoundingAmount(d.roundingAmount);
    } catch {}
  }, []);

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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BurZero-ProForma-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setPdfStatus("done");
      setTimeout(() => setPdfStatus("idle"), 2500);
    } catch (e) {
      console.error("PDF generation failed:", e);
      setPdfStatus("idle");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  const sym: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
  const currSym = sym[currency] ?? currency;

  return (
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
                Strumento 05 — Emetti
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 leading-none mb-2">
              Pro-Forma /{" "}
              <span className="text-zinc-400 font-normal">
                Avviso di Parcella
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Documento di richiesta pagamento — non è una fattura fiscale. La
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
                Logo (opzionale — JPG, PNG, max 5MB)
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
                  type="number"
                  min={0}
                  step={0.1}
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="0"
                  className="w-full border border-zinc-200 px-2.5 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* ── LINE ITEMS ───────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 overflow-hidden">
              {/* Table header */}
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

              {/* Item rows */}
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
                      type="number"
                      min={0}
                      step={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          "quantity",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="col-span-1 text-sm text-zinc-800 text-right focus:outline-none border-b border-zinc-200 focus:border-zinc-400"
                    />
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(idx, "unit", e.target.value)}
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
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full text-sm text-zinc-800 text-right focus:outline-none border-b border-zinc-200 focus:border-zinc-400"
                      />
                    </div>
                    <div className="col-span-1 flex items-center gap-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            "discount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
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

                {/* IVA rate — shown only when NOT forfettario */}
                {!isForfettario && (
                  <div className="flex items-center gap-4 pl-13">
                    <div className="ml-[52px]">
                      <p className="text-xs text-zinc-400 mb-1.5 uppercase tracking-editorial font-semibold">
                        Aliquota IVA (%)
                      </p>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step={1}
                        value={taxRate}
                        onChange={(e) =>
                          setTaxRate(parseFloat(e.target.value) || 0)
                        }
                        className="border border-zinc-200 px-2.5 py-2 text-sm font-bold text-zinc-800 w-24 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                  </div>
                )}

                {/* Ritenuta — incompatible with Forfettario */}
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
                      Ritenuta d'acconto (20%)
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isForfettario
                        ? "Non applicabile in Regime Forfettario — il contribuente è escluso dalla qualifica di sostituto d'imposta."
                        : "Deduce automaticamente il 20% dal totale. Il cliente trattiene questa quota e la versa al fisco per tuo conto."}
                    </p>
                  </div>
                </div>

                {/* Marca da bollo info */}
                {subtotal > 77.47 && isForfettario && (
                  <div className="ml-[52px] border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-bold text-amber-700">
                      Marca da bollo richiesta — €2,00
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      L'importo supera €77,47. In Regime Forfettario la marca da
                      bollo da €2 è obbligatoria. Verrà inclusa nel PDF.
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
                        Ritenuta d'acconto (20%)
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
                      li versa all'Agenzia delle Entrate per tuo conto.
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
  );
}
