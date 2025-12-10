"use client";

import { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  Download,
  ExternalLink,
  X,
} from "lucide-react";
import { ForfettarioReport } from "@/components/ForfettarioReport";

// Dynamic import to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="bg-slate-400 text-white font-bold py-4 px-8 rounded-full opacity-70"
      >
        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
        Caricamento PDF...
      </button>
    ),
  }
);
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import {
  ATECO_CODES,
  type ForfettarioInputs,
  type CassaType,
  compareRegimes,
  formatCurrency,
  formatPercentage,
} from "@/lib/forfettario-utils";

export default function ForfettarioCalculator() {
  const [inputs, setInputs] = useState<ForfettarioInputs>({
    atecoCoefficient: 0.67,
    cassaType: "gestione_separata",
    isNewBusiness: false,
    expectedRevenue: 50000,
    previousYearINPS: 0,
    realExpenses: 5000,
    clientType: "b2b",
  });

  const [selectedAteco, setSelectedAteco] = useState(ATECO_CODES[0].code);
  const [showPdfPopup, setShowPdfPopup] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const pdfShownRef = useRef(false);

  // 1. Calculate the Single Point Comparison (Current Input)
  const comparison = useMemo(() => {
    try {
      return compareRegimes(inputs);
    } catch (error) {
      console.error("Comparison calculation error:", error);
      // Return safe default
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

  // 2. Generate Data for the "Cliff Chart" (Simulation)
  // We simulate revenue from €30k to €120k to show the curve
  const chartData = useMemo(() => {
    try {
      const data = [];
      for (let rev = 30000; rev <= 120000; rev += 5000) {
        // Create a temporary input scenario for this revenue step
        const simInput = { ...inputs, expectedRevenue: rev };
        const res = compareRegimes(simInput);

        data.push({
          revenue: rev,
          // Forfettario is only valid <= 100k - show cliff by setting to null/undefined
          forfettarioNet:
            rev <= 100000 && res.forfettario.netIncome > 0
              ? Math.max(0, res.forfettario.netIncome)
              : undefined,
          ordinarioNet: Math.max(0, res.ordinario.netIncome),
          // Helper to format tooltip
          revenueLabel: `Fatturato: ${formatCurrency(rev)}`,
        });
      }
      return data;
    } catch (error) {
      console.error("Chart data generation error:", error);
      return [];
    }
  }, [inputs]);

  const handleRevenueChange = (value: number) => {
    const validValue = isNaN(value)
      ? 20000
      : Math.max(20000, Math.min(120000, value));
    setInputs({ ...inputs, expectedRevenue: validValue });
  };

  const handleAtecoChange = (code: string) => {
    setSelectedAteco(code);
    const ateco = ATECO_CODES.find((a) => a.code === code);
    if (ateco) {
      setInputs({ ...inputs, atecoCoefficient: ateco.coefficient });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl mb-4 md:mb-6 shadow-lg shadow-indigo-200">
            <Calculator className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight px-4">
            Simulatore{" "}
            <span className="text-indigo-600">Regime Forfettario</span>
          </h1>
          <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto px-4">
            Visualizza la "Trappola Fiscale". Scopri esattamente quando ti
            conviene smettere di fatturare.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Inputs (Smaller) */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" />
                Configurazione Fiscale
              </h2>

              <div className="space-y-5">
                {/* ATECO */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Codice ATECO
                  </label>
                  <select
                    value={selectedAteco}
                    onChange={(e) => handleAtecoChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-medium"
                  >
                    {ATECO_CODES.map((ateco) => (
                      <option key={ateco.code} value={ateco.code}>
                        {ateco.code} - {ateco.description} (
                        {ateco.coefficient * 100}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cassa Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-medium"
                  >
                    <option value="gestione_separata">
                      Gestione Separata INPS (26.07%)
                    </option>
                    <option value="artigiani_commercianti">
                      Artigiani/Commercianti
                    </option>
                    <option value="custom">Cassa Professionale</option>
                  </select>
                </div>

                {/* Custom Rate */}
                {inputs.cassaType === "custom" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                )}

                {/* Toggles Row */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-slate-700">
                    Start-up (5 anni)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.isNewBusiness}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          isNewBusiness: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Expenses Inputs */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        Spese Reali
                      </label>
                      <input
                        type="number"
                        value={inputs.realExpenses}
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            realExpenses: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-3 text-sm md:text-base border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        INPS Anno Prec.
                      </label>
                      <input
                        type="number"
                        value={inputs.previousYearINPS}
                        onChange={(e) =>
                          setInputs({
                            ...inputs,
                            previousYearINPS: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-3 text-sm md:text-base border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Clientela Principale
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, clientType: "b2b" })
                      }
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        inputs.clientType === "b2b"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-slate-500"
                      }`}
                    >
                      B2B (Aziende)
                    </button>
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, clientType: "b2c" })
                      }
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        inputs.clientType === "b2c"
                          ? "bg-white shadow-sm text-pink-600"
                          : "text-slate-500"
                      }`}
                    >
                      B2C (Privati)
                    </button>
                  </div>
                  {inputs.clientType === "b2c" && (
                    <p className="text-xs text-pink-600 mt-2 font-medium">
                      *Attenzione: In Ordinario perderai il 22% di IVA
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results & Chart (Larger) */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            {/* 1. SLIDER & WARNINGS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Fatturato Previsto
                  </label>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {formatCurrency(inputs.expectedRevenue || 0)}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="120000"
                  step="1000"
                  value={inputs.expectedRevenue}
                  onChange={(e) =>
                    handleRevenueChange(parseFloat(e.target.value))
                  }
                  className="w-full h-4 md:h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
                  <span>€20k</span>
                  <span className="text-amber-500">€85k (Limite)</span>
                  <span className="text-red-500">€100k (Cliff)</span>
                  <span>€120k</span>
                </div>
              </div>

              {/* Dynamic Warnings */}
              {(comparison.forfettario.warnings.length > 0 ||
                comparison.ordinario.warnings.length > 0) && (
                <div className="space-y-2">
                  {[
                    ...comparison.forfettario.warnings,
                    ...comparison.ordinario.warnings,
                  ].map((w, i) => (
                    <div
                      key={`warning-${i}-${w.substring(0, 20)}`}
                      className="bg-amber-50 text-amber-800 px-4 py-3 rounded-lg text-sm font-medium flex gap-2"
                    >
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. THE CHART (The Visual Hook) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Proiezione Netto (Forfettario vs Ordinario)
              </h3>
              <div
                className="w-full"
                style={{ height: "320px", minHeight: "320px" }}
              >
                <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    style={{ cursor: "default", outline: "none" }}
                  >
                    <defs>
                      <linearGradient
                        id="colorForf"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="revenue"
                      tickFormatter={(v) => `€${v / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(v) => `€${v / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) =>
                        `Fatturato: ${formatCurrency(label as number)}`
                      }
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <ReferenceLine
                      x={85000}
                      stroke="#f59e0b"
                      strokeDasharray="3 3"
                      label={{
                        position: "insideTopRight",
                        value: "Limite 85k",
                        fill: "#d97706",
                        fontSize: 12,
                      }}
                    />

                    {/* Area for Forfettario (Green) - More Opaque */}
                    <Area
                      type="monotone"
                      dataKey="forfettarioNet"
                      stroke="#10b981"
                      strokeWidth={4}
                      fillOpacity={0.2}
                      fill="#10b981"
                      name="Netto Forfettario"
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      isAnimationActive={true}
                    />

                    {/* Line for Ordinario (Red) - Thicker for Danger */}
                    <Line
                      type="monotone"
                      dataKey="ordinarioNet"
                      stroke="#ef4444"
                      strokeWidth={4}
                      dot={false}
                      name="Netto Ordinario"
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      isAnimationActive={true}
                    />

                    {/* Current Position - Distinct Vertical Line */}
                    <ReferenceLine
                      x={inputs.expectedRevenue}
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      label={{
                        position: "top",
                        value: "Tu sei qui",
                        fill: "#8b5cf6",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. FINAL COMPARISON CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Forfettario Card */}
              <div
                className={`p-6 rounded-2xl border-2 transition-all ${
                  inputs.expectedRevenue > 100000
                    ? "border-red-500 bg-red-50/30 opacity-50 relative"
                    : comparison.difference > 0
                    ? "border-green-500 bg-green-50/50"
                    : "border-slate-100 bg-slate-50 opacity-60"
                }`}
              >
                {inputs.expectedRevenue > 100000 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-sm rounded-2xl">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      NON DISPONIBILE
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-700">
                    Regime Forfettario
                  </span>
                  {inputs.expectedRevenue > 100000 ? (
                    <XCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <CheckCircle
                      className={`w-6 h-6 ${
                        comparison.difference > 0
                          ? "text-green-500"
                          : "text-slate-300"
                      }`}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Netto Annuale</p>
                  <p className="text-3xl font-black text-slate-900">
                    {inputs.expectedRevenue > 100000
                      ? "€0"
                      : formatCurrency(comparison.forfettario.netIncome)}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex justify-between text-sm">
                  <span className="text-slate-500">Tasse Totali</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(
                      comparison.forfettario.taxAmount +
                        comparison.forfettario.inpsContributes
                    )}
                  </span>
                </div>
              </div>

              {/* Ordinario Card */}
              <div
                className={`p-6 rounded-2xl border-2 transition-all ${
                  comparison.difference < 0
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-700">
                    Regime Ordinario
                  </span>
                  <XCircle
                    className={`w-6 h-6 ${
                      comparison.difference < 0
                        ? "text-blue-500"
                        : "text-slate-300"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Netto Annuale</p>
                  <p className="text-3xl font-black text-slate-900">
                    {formatCurrency(comparison.ordinario.netIncome)}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex justify-between text-sm">
                  <span className="text-slate-500">Tasse Totali</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(
                      comparison.ordinario.taxAmount +
                        comparison.ordinario.inpsContributes +
                        (comparison.ordinario.addizionali || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* VERDICT BANNER */}
            <div
              className={`rounded-xl p-4 flex items-center justify-between ${
                comparison.difference > 0
                  ? "bg-slate-900 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              <div>
                <p className="text-xs font-bold uppercase opacity-70 mb-1">
                  Il Verdetto
                </p>
                <p className="text-lg font-bold">{comparison.recommendation}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase opacity-70 mb-1">
                  Differenza
                </p>
                <p className="text-2xl font-black">
                  {comparison.difference > 0 ? "+" : ""}
                  {formatCurrency(comparison.difference)}
                </p>
              </div>
            </div>

            {/* CONVERSION CTA */}
            <div className="mt-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="max-w-xl mx-auto">
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Hai dubbi sul risultato?
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Non rischiare sanzioni. Scarica il report dettagliato e trova
                  un commercialista certificato nella tua zona.
                </p>
                <div className="inline-block">
                  {typeof window !== "undefined" && (
                    <PDFDownloadLink
                      document={
                        <ForfettarioReport
                          inputs={inputs}
                          results={comparison}
                        />
                      }
                      fileName={`Bur0_Simulazione_${
                        new Date().toISOString().split("T")[0]
                      }_${Date.now()}.pdf`}
                    >
                      {(linkProps) => {
                        const { blob, url, loading } = linkProps || {};

                        // Only show popup when user clicked download AND PDF is ready
                        if (
                          !loading &&
                          blob &&
                          downloadClicked &&
                          !pdfShownRef.current
                        ) {
                          pdfShownRef.current = true;
                          setTimeout(() => {
                            // Store blob and create persistent URL
                            setPdfBlob(blob);
                            const objectUrl = URL.createObjectURL(blob);
                            setPdfUrl(objectUrl);
                            setShowPdfPopup(true);
                            setIsGenerating(false);
                            setDownloadClicked(false);
                          }, 100);
                        }

                        return (
                          <button
                            disabled={loading}
                            onClick={() => {
                              if (!loading) {
                                setIsGenerating(true);
                                setDownloadClicked(true);
                                pdfShownRef.current = false; // Reset for next download
                              }
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                          >
                            {loading || isGenerating ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Download className="w-5 h-5" />
                            )}
                            <span>
                              {loading || isGenerating
                                ? "Generazione PDF..."
                                : "Scarica Report Completo"}
                            </span>
                          </button>
                        );
                      }}
                    </PDFDownloadLink>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  *Il PDF include il dettaglio completo dei calcoli da portare
                  al commercialista
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Download Popup */}
      {showPdfPopup && pdfUrl && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPdfPopup(false);
                if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
                setPdfBlob(null);
                pdfShownRef.current = false;
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Report Generato!
              </h3>

              <p className="text-slate-600 mb-6">
                Il tuo report PDF è pronto. Aprilo per vedere tutti i dettagli
                della simulazione.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (pdfBlob) {
                      // Create fresh URL from blob each time
                      const freshUrl = URL.createObjectURL(pdfBlob);
                      window.open(freshUrl, '_blank');
                      // Cleanup after short delay
                      setTimeout(() => URL.revokeObjectURL(freshUrl), 1000);
                      
                      setShowPdfPopup(false);
                      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                      setPdfUrl(null);
                      setPdfBlob(null);
                      pdfShownRef.current = false;
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Apri PDF
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPdfPopup(false);
                    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                    setPdfBlob(null);
                    pdfShownRef.current = false;
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Chiudi
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Il file è stato salvato anche nei tuoi download
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
