"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  AlertTriangle,
  Loader2,
  Download,
  ExternalLink,
  X,
  FileText,
  Share2,
} from "lucide-react";
import { ForfettarioReport } from "@/components/ForfettarioReport";
import LoadingScreen from "@/components/LoadingScreen";
import AtecoCombobox from "@/components/AtecoCombobox";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import {
  type ForfettarioInputs,
  type CassaType,
  compareRegimes,
  formatCurrency,
} from "@/lib/forfettario-utils";
import { ATECO_DATA, type AtecoEntry } from "@/lib/ateco-data";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface InitialInputs {
  atecoCode?: string;
  cassaType?: CassaType;
  isNewBusiness?: boolean;
  expectedRevenue?: number;
  previousYearINPS?: number;
  realExpenses?: number;
  clientType?: "b2b" | "b2c";
}

export default function ForfettarioCalculator({
  initialInputs,
  scenarioLabel,
}: {
  initialInputs?: InitialInputs;
  scenarioLabel?: string;
}) {
  const initialAteco = initialInputs?.atecoCode
    ? (ATECO_DATA.find((e) => e.code === initialInputs.atecoCode) ??
      ATECO_DATA[0])
    : ATECO_DATA[0];

  const [inputs, setInputs] = useState<ForfettarioInputs>({
    atecoCoefficient: initialAteco.coefficient,
    cassaType: initialInputs?.cassaType ?? "gestione_separata",
    isNewBusiness: initialInputs?.isNewBusiness ?? false,
    expectedRevenue: initialInputs?.expectedRevenue ?? 50000,
    previousYearINPS: initialInputs?.previousYearINPS ?? 0,
    realExpenses: initialInputs?.realExpenses ?? 5000,
    clientType: initialInputs?.clientType ?? "b2b",
  });

  const [selectedAteco, setSelectedAteco] = useState<AtecoEntry>(initialAteco);
  const [showPdfPopup, setShowPdfPopup] = useState(false);
  const [showPdfLoading, setShowPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingPdf, setPendingPdf] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const [realExpensesStr, setRealExpensesStr] = useState(
    String(inputs.realExpenses),
  );
  const [prevINPSStr, setPrevINPSStr] = useState(
    String(inputs.previousYearINPS),
  );

  const router = useRouter();
  const pathname = usePathname();
  const didMount = useRef(false);
  const urlSyncReady = useRef(true);
  const [copied, setCopied] = useState(false);

  const comparison = useMemo(() => {
    try {
      return compareRegimes(inputs);
    } catch (error) {
      console.error("Comparison calculation error:", error);
      return {
        forfettario: {
          grossRevenue: 0,
          taxableBase: 0,
          inpsContributes: 0,
          taxAmount: 0,
          netIncome: 0,
          effectiveTaxRate: 0,
          warnings: ["Errore nel calcolo"],
          ivaAmount: 0,
        },
        ordinario: {
          grossRevenue: 0,
          taxableBase: 0,
          inpsContributes: 0,
          taxAmount: 0,
          netIncome: 0,
          effectiveTaxRate: 0,
          warnings: ["Errore nel calcolo"],
          ivaAmount: 0,
        },
        difference: 0,
        recommendation: "Verifica i dati inseriti",
      };
    }
  }, [inputs]);

  const chartData = useMemo(() => {
    try {
      const data = [];
      for (let rev = 30000; rev <= 120000; rev += 5000) {
        const simInput = { ...inputs, expectedRevenue: rev };
        const res = compareRegimes(simInput);
        data.push({
          revenue: rev,
          forfettarioNet:
            rev <= 100000 && res.forfettario.netIncome > 0
              ? Math.max(0, res.forfettario.netIncome)
              : undefined,
          ordinarioNet: Math.max(0, res.ordinario.netIncome),
        });
      }
      return data;
    } catch {
      return [];
    }
  }, [inputs]);

  useEffect(() => {
    if (pendingPdf && !showPdfLoading) {
      setPdfBlob(pendingPdf.blob);
      setPdfUrl(pendingPdf.url);
      setShowPdfPopup(true);
      setIsGenerating(false);
      setPendingPdf(null);
    }
  }, [pendingPdf, showPdfLoading]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!urlSyncReady.current) return;
    const params = new URLSearchParams({
      rev: String(inputs.expectedRevenue),
      ateco: selectedAteco.code,
      cassa: inputs.cassaType,
      startup: inputs.isNewBusiness ? "1" : "0",
      tipo: inputs.clientType,
      spese: String(inputs.realExpenses),
      inps: String(inputs.previousYearINPS),
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [inputs, selectedAteco, router, pathname]);

  const generatePdf = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setShowPdfLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <ForfettarioReport inputs={inputs} results={comparison} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPendingPdf({ blob, url });
    } catch (e) {
      console.error("PDF generation failed:", e);
      setIsGenerating(false);
      setShowPdfLoading(false);
    }
  };

  const handleRevenueChange = (value: number) => {
    const validValue = isNaN(value)
      ? 20000
      : Math.max(20000, Math.min(120000, value));
    setInputs({ ...inputs, expectedRevenue: validValue });
  };

  const handleAtecoChange = (entry: AtecoEntry) => {
    setSelectedAteco(entry);
    setInputs({ ...inputs, atecoCoefficient: entry.coefficient });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const forfettarioWins = comparison.difference > 0;
  const isOverCliff = inputs.expectedRevenue > 100000;
  const allWarnings = [
    ...comparison.forfettario.warnings,
    ...comparison.ordinario.warnings,
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── HEADER ── */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            Simulatore Fiscale 2026
          </p>
          {scenarioLabel && (
            <p className="text-xs font-mono text-zinc-400 mb-2 tracking-tight">
              {scenarioLabel}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            Forfettario vs Ordinario
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Inserisci i tuoi dati per scoprire quale regime ti lascia più
            soldi in tasca.
          </p>
          <button
            onClick={handleShare}
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-editorial text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <Share2 className="w-3 h-3" />
            {copied ? "Copiato!" : "Condividi"}
          </button>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ── LEFT: INPUTS ── */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-5">
                Configurazione Fiscale
              </p>

              <div className="space-y-5">
                {/* ATECO */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                    Codice ATECO
                  </label>
                  <AtecoCombobox
                    value={selectedAteco}
                    onChange={handleAtecoChange}
                  />
                  <p className="mt-1.5 text-[11px] text-zinc-400">
                    Coefficiente di redditività:{" "}
                    <span className="font-mono font-bold text-zinc-700">
                      {(selectedAteco.coefficient * 100).toFixed(0)}%
                    </span>
                  </p>
                </div>

                {/* Cassa */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                    Cassa Previdenziale
                  </label>
                  <select
                    value={inputs.cassaType}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        cassaType: e.target.value as CassaType,
                      })
                    }
                    className="select-styled w-full px-3 py-2.5 bg-white border border-zinc-300 text-sm text-zinc-900 font-medium focus:outline-none focus:border-zinc-700"
                  >
                    <option value="gestione_separata">
                      Gestione Separata INPS (26.07%)
                    </option>
                    <option value="artigiani_commercianti">
                      Artigiani / Commercianti
                    </option>
                    <option value="custom">Cassa Professionale</option>
                  </select>
                </div>

                {/* Custom cassa rate */}
                {inputs.cassaType === "custom" && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                      % Cassa
                    </label>
                    <input
                      type="number"
                      value={inputs.customCassaRate || 0}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          customCassaRate: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2.5 border border-zinc-300 text-sm text-zinc-900 font-medium focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                )}

                {/* Start-up toggle */}
                <div className="flex items-center justify-between py-1 border-t border-zinc-100 pt-4">
                  <div>
                    <span className="text-sm font-semibold text-zinc-800">
                      Start-up
                    </span>
                    <span className="ml-2 text-xs text-zinc-400">
                      Aliquota 5% (primi 5 anni)
                    </span>
                  </div>
                  <button
                    role="switch"
                    aria-checked={inputs.isNewBusiness}
                    onClick={() =>
                      setInputs({
                        ...inputs,
                        isNewBusiness: !inputs.isNewBusiness,
                      })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                      inputs.isNewBusiness ? "bg-zinc-950" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        inputs.isNewBusiness ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Expenses */}
                <div className="pt-4 border-t border-zinc-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                        Spese Reali
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={realExpensesStr}
                        onChange={(e) => setRealExpensesStr(e.target.value)}
                        onBlur={() => {
                          const v = parseFloat(realExpensesStr) || 0;
                          setRealExpensesStr(String(v));
                          setInputs((prev) => ({ ...prev, realExpenses: v }));
                        }}
                        onFocus={(e) => e.target.select()}
                        className="w-full px-3 py-2.5 border-b border-zinc-300 bg-transparent text-sm text-zinc-900 font-mono tabular focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                        INPS Prec.
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={prevINPSStr}
                        onChange={(e) => setPrevINPSStr(e.target.value)}
                        onBlur={() => {
                          const v = parseFloat(prevINPSStr) || 0;
                          setPrevINPSStr(String(v));
                          setInputs((prev) => ({
                            ...prev,
                            previousYearINPS: v,
                          }));
                        }}
                        onFocus={(e) => e.target.select()}
                        className="w-full px-3 py-2.5 border-b border-zinc-300 bg-transparent text-sm text-zinc-900 font-mono tabular focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>
                </div>

                {/* B2B / B2C */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-2">
                    Tipo Clientela
                  </label>
                  <div className="flex border border-zinc-300">
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, clientType: "b2b" })
                      }
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-editorial transition-colors ${
                        inputs.clientType === "b2b"
                          ? "bg-zinc-950 text-white"
                          : "bg-white text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      B2B — Aziende
                    </button>
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, clientType: "b2c" })
                      }
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-editorial transition-colors ${
                        inputs.clientType === "b2c"
                          ? "bg-zinc-950 text-white"
                          : "bg-white text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      B2C — Privati
                    </button>
                  </div>
                  {inputs.clientType === "b2c" && (
                    <p className="text-xs text-red-600 mt-1.5 font-medium">
                      In Ordinario perderai il 22% di IVA sui privati
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div className="lg:col-span-8 space-y-5">
            {/* SLIDER */}
            <div className="bg-white border border-zinc-200 p-6">
              <div className="flex justify-between items-baseline mb-6">
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400">
                  Fatturato Annuo Previsto
                </p>
                <span className="text-5xl font-black font-mono tabular text-zinc-950 leading-none">
                  {formatCurrency(inputs.expectedRevenue || 0)}
                </span>
              </div>

              <SliderPrimitive.Root
                className="slider-root"
                min={20000}
                max={120000}
                step={1000}
                value={[inputs.expectedRevenue]}
                onPointerDown={() => {
                  urlSyncReady.current = false;
                }}
                onValueChange={([val]) => handleRevenueChange(val)}
                onValueCommit={([val]) => {
                  urlSyncReady.current = true;
                  handleRevenueChange(val);
                }}
              >
                <SliderPrimitive.Track className="slider-track">
                  <SliderPrimitive.Range className="slider-range" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                  className="slider-thumb"
                  aria-label="Fatturato"
                />
              </SliderPrimitive.Root>

              <div className="flex justify-between text-xs font-semibold text-zinc-400 mt-3">
                <span>€20k</span>
                <span className="text-amber-600">€85k limite</span>
                <span className="text-red-600">€100k cliff</span>
                <span>€120k</span>
              </div>

              {/* Warnings */}
              {allWarnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {allWarnings.map((w, i) => (
                    <div
                      key={`w-${i}`}
                      className="flex items-start gap-2 border-l-2 border-red-500 pl-3 py-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-zinc-700">{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CHART */}
            <div className="bg-white border border-zinc-200 p-6">
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                Netto Disponibile — Proiezione €30k → €120k
              </p>
              <div className="w-full" style={{ height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    style={{ outline: "none" }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      vertical={false}
                      stroke="#f0f0f0"
                      strokeWidth={1}
                    />
                    <XAxis
                      dataKey="revenue"
                      tickFormatter={(v) => `€${v / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#a1a1aa",
                        fontSize: 11,
                        fontFamily: "Courier New",
                      }}
                    />
                    <YAxis
                      tickFormatter={(v) => `€${v / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#a1a1aa",
                        fontSize: 11,
                        fontFamily: "Courier New",
                      }}
                      width={52}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "forfettarioNet" ? "Forfettario" : "Ordinario",
                      ]}
                      labelFormatter={(label) =>
                        `Fatturato: ${formatCurrency(label as number)}`
                      }
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e4e4e7",
                        borderRadius: 0,
                        fontSize: 12,
                        fontFamily: "Courier New",
                        boxShadow: "none",
                      }}
                    />
                    <ReferenceLine
                      x={85000}
                      stroke="#d97706"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      x={inputs.expectedRevenue}
                      stroke="#dc2626"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      label={{
                        position: "top",
                        value: "↑ qui",
                        fill: "#dc2626",
                        fontSize: 11,
                        fontFamily: "Courier New",
                      }}
                    />
                    {/* Forfettario — solid black */}
                    <Line
                      type="monotone"
                      dataKey="forfettarioNet"
                      stroke="#09090b"
                      strokeWidth={2}
                      dot={false}
                      name="forfettarioNet"
                      connectNulls={false}
                      animationDuration={600}
                    />
                    {/* Ordinario — red dashed */}
                    <Line
                      type="monotone"
                      dataKey="ordinarioNet"
                      stroke="#dc2626"
                      strokeWidth={2}
                      strokeDasharray="5 3"
                      dot={false}
                      name="ordinarioNet"
                      animationDuration={600}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-[2px] bg-zinc-950"></div>
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-editorial">
                    Forfettario
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-[2px] bg-red-600"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #dc2626 0, #dc2626 5px, transparent 5px, transparent 8px)",
                    }}
                  ></div>
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-editorial">
                    Ordinario
                  </span>
                </div>
              </div>
            </div>

            {/* ── VERDICT — THE ANCHOR ── */}
            <div
              className={`border-l-4 ${forfettarioWins ? "border-l-zinc-950 bg-white" : isOverCliff ? "border-l-red-600 bg-red-50" : "border-l-red-600 bg-white"} border border-zinc-200 p-6`}
            >
              {isOverCliff ? (
                <div>
                  <p className="text-xs uppercase tracking-editorial font-semibold text-red-600 mb-1">
                    Regime Forfettario — Non disponibile
                  </p>
                  <p className="text-sm text-zinc-600">
                    Sopra €100.000 si esce dal forfettario con effetto
                    retroattivo.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                        {forfettarioWins
                          ? "Forfettario — Regime Consigliato"
                          : "Ordinario — Regime Consigliato"}
                      </p>
                      <p className="text-5xl font-black font-mono tabular text-zinc-950 leading-none">
                        {formatCurrency(
                          forfettarioWins
                            ? comparison.forfettario.netIncome
                            : comparison.ordinario.netIncome,
                        )}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        Netto annuale in tasca
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-1">
                        Risparmio vs alternativa
                      </p>
                      <p
                        className={`text-3xl font-black font-mono tabular ${Math.abs(comparison.difference) > 0 ? "text-red-600" : "text-zinc-950"}`}
                      >
                        {comparison.difference > 0 ? "+" : ""}
                        {formatCurrency(comparison.difference)}
                      </p>
                    </div>
                  </div>
                  {inputs.expectedRevenue >= 70000 && (
                    <p className="text-xs text-zinc-500 mt-3 border-t border-zinc-100 pt-3">
                      A{" "}
                      <span className="font-bold text-zinc-700">
                        {formatCurrency(100000 - inputs.expectedRevenue)}
                      </span>{" "}
                      dalla Tax Cliff.{" "}
                      <Link
                        href="/calcolatori/cliff"
                        className="underline underline-offset-2 hover:text-zinc-900"
                      >
                        Traccialo ogni mese →
                      </Link>
                    </p>
                  )}
                </>
              )}
            </div>

            {/* ── BREAKDOWN TABLE ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FORFETTARIO */}
              {!isOverCliff && (
                <div
                  className={`bg-white border ${forfettarioWins ? "border-zinc-950" : "border-zinc-200"} p-5`}
                >
                  <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                    Regime Forfettario
                  </p>
                  <div className="space-y-2.5">
                    {[
                      {
                        label: "Netto in Tasca",
                        value: formatCurrency(comparison.forfettario.netIncome),
                        bold: true,
                      },
                      {
                        label: `Imposta (${inputs.isNewBusiness ? "5%" : "15%"})`,
                        value: `−${formatCurrency(comparison.forfettario.taxAmount)}`,
                      },
                      {
                        label: "INPS",
                        value: `−${formatCurrency(comparison.forfettario.inpsContributes)}`,
                      },
                      {
                        label: "Aliquota Eff.",
                        value: isFinite(comparison.forfettario.effectiveTaxRate)
                          ? `${comparison.forfettario.effectiveTaxRate.toFixed(1)}%`
                          : "—",
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between items-baseline border-b border-zinc-100 pb-2"
                      >
                        <span className="text-xs text-zinc-500">
                          {row.label}
                        </span>
                        <span
                          className={`text-sm font-mono tabular ${row.bold ? "font-black text-zinc-950" : "font-semibold text-zinc-700"}`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDINARIO */}
              <div
                className={`bg-white border ${!forfettarioWins && !isOverCliff ? "border-zinc-950" : "border-zinc-200"} p-5 ${isOverCliff ? "sm:col-span-2" : ""}`}
              >
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-4">
                  Regime Ordinario
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Netto in Tasca",
                      value: formatCurrency(comparison.ordinario.netIncome),
                      bold: true,
                    },
                    {
                      label: "IRPEF",
                      value: `−${formatCurrency(comparison.ordinario.taxAmount)}`,
                    },
                    {
                      label: "Add. Reg./Com.",
                      value: `−${formatCurrency(comparison.ordinario.addizionali || 0)}`,
                    },
                    {
                      label: "INPS",
                      value: `−${formatCurrency(comparison.ordinario.inpsContributes)}`,
                    },
                    ...(comparison.ordinario.ivaAmount > 0
                      ? [
                          {
                            label: "IVA Persa (B2C)",
                            value: `−${formatCurrency(comparison.ordinario.ivaAmount)}`,
                          },
                        ]
                      : []),
                    {
                      label: "Aliquota Eff.",
                      value: isFinite(comparison.ordinario.effectiveTaxRate)
                        ? `${comparison.ordinario.effectiveTaxRate.toFixed(1)}%`
                        : "—",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-baseline border-b border-zinc-100 pb-2"
                    >
                      <span className="text-xs text-zinc-500">{row.label}</span>
                      <span
                        className={`text-sm font-mono tabular ${row.bold ? "font-black text-zinc-950" : "font-semibold text-zinc-700"}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── ACCONTO CTA ── */}
            {!isOverCliff && comparison.forfettario.taxAmount > 51.65 && (
              <div className="bg-white border border-zinc-200 p-4 flex items-center justify-between gap-4">
                <p className="text-xs text-zinc-600">
                  Imposta sostitutiva stimata:{" "}
                  <span className="font-bold font-mono">
                    {formatCurrency(comparison.forfettario.taxAmount)}
                  </span>{" "}
                  — devi versare l&apos;acconto?
                </p>
                <Link
                  href={`/calcolatori/acconto?tax=${Math.round(comparison.forfettario.taxAmount)}`}
                  className="flex-shrink-0 text-xs font-bold uppercase tracking-editorial text-zinc-950 border border-zinc-300 px-3 py-2 hover:border-zinc-700 transition-colors whitespace-nowrap"
                >
                  Calcola le rate →
                </Link>
              </div>
            )}

            {/* ── PDF CTA ── */}
            <div className="bg-white border border-zinc-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-zinc-900">
                  Report PDF Completo
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Tutti i calcoli in un documento da portare al commercialista.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  disabled={isGenerating}
                  onClick={generatePdf}
                  className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm uppercase tracking-editorial py-3 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {isGenerating ? "Generazione..." : "Scarica Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading screen */}
      {showPdfLoading && (
        <LoadingScreen
          type="pdf"
          minDuration={2500}
          onComplete={() => setShowPdfLoading(false)}
        />
      )}

      {/* PDF Popup */}
      {showPdfPopup && pdfUrl && !showPdfLoading && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 max-w-sm w-full p-8 relative shadow-xl">
            <button
              onClick={() => {
                setShowPdfPopup(false);
                if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
                setPdfBlob(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
              Report Pronto
            </p>
            <p className="text-2xl font-black text-zinc-950 mb-1">
              PDF Generato
            </p>
            <p className="text-sm text-zinc-500 mb-6">
              Il report è pronto. Aprilo per vedere i dettagli completi della
              simulazione.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (pdfBlob) {
                    const freshUrl = URL.createObjectURL(pdfBlob);
                    window.open(freshUrl, "_blank");
                    setTimeout(() => URL.revokeObjectURL(freshUrl), 1000);
                    setShowPdfPopup(false);
                    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                    setPdfBlob(null);
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm uppercase tracking-editorial py-3 px-4 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Apri PDF
              </button>
              <button
                onClick={() => {
                  setShowPdfPopup(false);
                  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                  setPdfUrl(null);
                  setPdfBlob(null);
                }}
                className="flex-1 border border-zinc-300 text-zinc-700 hover:border-zinc-500 font-bold text-sm uppercase tracking-editorial py-3 px-4 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
