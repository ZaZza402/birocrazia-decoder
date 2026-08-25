"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { AlertTriangle, Loader2, FileText, Share2 } from "lucide-react";
import { ForfettarioReport } from "@/components/ForfettarioReport";

import AtecoCombobox from "@/components/AtecoCombobox";
import InfoTooltip from "@/components/InfoTooltip";

const ForfettarioChart = dynamic(
  () => import("@/components/ForfettarioChart"),
  { ssr: false, loading: () => <div style={{ height: "280px" }} /> },
);

import {
  type ForfettarioInputs,
  type CassaType,
  compareRegimes,
  formatCurrency,
} from "@/lib/forfettario-utils";
import { ATECO_DATA, type AtecoEntry } from "@/lib/ateco-data";
import { resolveAtecoCoefficient } from "@/lib/ateco-rules-2026";
import {
  FORFETTARIO_ENTRY_LIMIT,
  FORFETTARIO_EXIT_CLIFF,
  INPS_GESTIONE_SEPARATA_RATE,
} from "@/lib/tax-constants-2026";
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

interface DownloadNotice {
  url: string;
  fileName: string;
}

function parseLooseNumber(raw: string): number | null {
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
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function buildForfettarioReportFileName(expectedRevenue: number): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
  const revenueToken = Math.round(expectedRevenue).toString();
  return `BurZero-Report-Forfettario-${revenueToken}-${timestamp}.pdf`;
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
  const initialAtecoCoefficient = resolveAtecoCoefficient(initialAteco);

  const [inputs, setInputs] = useState<ForfettarioInputs>({
    atecoCoefficient: initialAtecoCoefficient,
    cassaType: initialInputs?.cassaType ?? "gestione_separata",
    isNewBusiness: initialInputs?.isNewBusiness ?? false,
    expectedRevenue: initialInputs?.expectedRevenue ?? 50000,
    previousYearINPS: initialInputs?.previousYearINPS ?? 0,
    realExpenses: initialInputs?.realExpenses ?? 5000,
    clientType: initialInputs?.clientType ?? "b2b",
  });

  const [selectedAteco, setSelectedAteco] = useState<AtecoEntry>(initialAteco);
  const [pdfStatus, setPdfStatus] = useState<"idle" | "generating" | "done">(
    "idle",
  );
  const [realExpensesStr, setRealExpensesStr] = useState(
    String(inputs.realExpenses),
  );
  const [prevINPSStr, setPrevINPSStr] = useState(
    String(inputs.previousYearINPS),
  );
  const [customCassaRateDraft, setCustomCassaRateDraft] = useState<
    string | null
  >(null);

  const router = useRouter();
  const pathname = usePathname();
  const didMount = useRef(false);
  const urlSyncReady = useRef(true);
  const [copied, setCopied] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<DownloadNotice | null>(
    null,
  );
  const canShareApi = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && "share" in navigator,
    () => false,
  );
  const revokeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const roundToCents = (value: number) => Math.round(value * 100) / 100;
      const revenues = new Set<number>();

      for (let rev = 30000; rev <= 120000; rev += 5000) {
        revenues.add(rev);
      }

      // Always include the currently selected revenue so chart point and verdict match.
      revenues.add(inputs.expectedRevenue);

      const sortedRevenues = Array.from(revenues).sort((a, b) => a - b);
      const data = [];

      for (const rev of sortedRevenues) {
        const simInput = { ...inputs, expectedRevenue: rev };
        const res = compareRegimes(simInput);
        data.push({
          revenue: rev,
          forfettarioNet:
            rev <= 100000 && res.forfettario.netIncome > 0
              ? roundToCents(Math.max(0, res.forfettario.netIncome))
              : undefined,
          ordinarioNet: roundToCents(Math.max(0, res.ordinario.netIncome)),
        });
      }
      return data;
    } catch {
      return [];
    }
  }, [inputs]);

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
    if (pdfStatus === "generating") return;
    setPdfStatus("generating");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <ForfettarioReport inputs={inputs} results={comparison} />,
      ).toBlob();
      const fileName = buildForfettarioReportFileName(inputs.expectedRevenue);
      const url = URL.createObjectURL(blob);
      // Trigger download / iOS share sheet directly-no popup
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
    if (!downloadNotice || !canShareApi) return;
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

  const handleRevenueChange = (value: number) => {
    const validValue = isNaN(value)
      ? 20000
      : Math.max(20000, Math.min(120000, value));
    setInputs({ ...inputs, expectedRevenue: validValue });
  };

  const handleAtecoChange = (entry: AtecoEntry) => {
    setSelectedAteco(entry);
    setInputs({
      ...inputs,
      atecoCoefficient: resolveAtecoCoefficient(entry),
    });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const forfettarioWins = comparison.difference > 0;
  const isOverCliff = inputs.expectedRevenue > FORFETTARIO_EXIT_CLIFF;
  const allWarnings = [
    ...comparison.forfettario.warnings,
    ...comparison.ordinario.warnings,
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── HEADER ── */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-2">
            Simulatore Fiscale 2026
          </p>
          {scenarioLabel && (
            <p className="text-xs font-mono text-zinc-600 mb-2 tracking-tight">
              {scenarioLabel}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
            Forfettario vs Ordinario
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            Inserisci i tuoi dati per scoprire quale regime ti lascia più soldi
            in tasca.
          </p>
          <button
            onClick={handleShare}
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-editorial text-zinc-600 hover:text-zinc-700 transition-colors"
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
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-5">
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
                  <p className="mt-1.5 text-[11px] text-zinc-600 flex items-center">
                    Coefficiente di redditività:{" "}
                    <span className="font-mono font-bold text-zinc-700 ml-1">
                      {(resolveAtecoCoefficient(selectedAteco) * 100).toFixed(
                        0,
                      )}
                      %
                    </span>
                    <InfoTooltip content="Solo questa percentuale del tuo fatturato è considerata reddito tassabile. Es: coefficiente 67% su €50.000 → base imponibile €33.500. Un coefficiente più basso significa meno tasse." />
                  </p>
                </div>

                {/* Cassa */}
                <div>
                  <label className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                    Cassa Previdenziale
                    <InfoTooltip content="Gestione Separata INPS: la maggior parte dei freelance (sviluppatori, consulenti, ecc.) senza un albo professionale. Artigiani/Commercianti: attività con partita IVA in commercio o artigianato. Cassa Professionale: ordini con cassa propria (medici, avvocati, ingegneri, ecc.) - inserisci la % indicata dal tuo ordine." />
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
                      Gestione Separata INPS (
                      {(INPS_GESTIONE_SEPARATA_RATE * 100).toFixed(2)}%)
                    </option>
                    <option value="artigiani">
                      Artigiani (contributi fissi + variabili)
                    </option>
                    <option value="commercianti">
                      Commercianti (contributi fissi + variabili)
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
                      type="text"
                      inputMode="decimal"
                      value={
                        customCassaRateDraft !== null
                          ? customCassaRateDraft
                          : inputs.customCassaRate === undefined
                            ? ""
                            : String(inputs.customCassaRate)
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        setCustomCassaRateDraft(raw);
                        if (raw.trim() === "") {
                          setInputs({
                            ...inputs,
                            customCassaRate: undefined,
                          });
                          return;
                        }
                        const parsed = parseLooseNumber(raw);
                        if (parsed !== null) {
                          setInputs({
                            ...inputs,
                            customCassaRate: Math.max(0, parsed),
                          });
                        }
                      }}
                      onBlur={() => {
                        setCustomCassaRateDraft(null);
                      }}
                      placeholder="0"
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
                    <span className="ml-2 text-xs text-zinc-600">
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
                      <label className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                        Spese Reali
                        <InfoTooltip content="Solo in Regime Ordinario: le spese aziendali documentate (hardware, software, abbonamenti, affitto ufficio, formazione) riducono il reddito imponibile. Nel forfettario non contano - si usa solo il coefficiente ATECO. Inserisci la stima annuale." />
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={realExpensesStr}
                        onChange={(e) => setRealExpensesStr(e.target.value)}
                        onBlur={() => {
                          const v = parseLooseNumber(realExpensesStr) ?? 0;
                          setRealExpensesStr(String(v));
                          setInputs((prev) => ({ ...prev, realExpenses: v }));
                        }}
                        className="w-full px-3 py-2.5 border-b border-zinc-300 bg-transparent text-sm text-zinc-900 font-mono tabular focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-1.5">
                        INPS Prec.
                        <InfoTooltip
                          content="Contributi INPS versati nell'anno precedente, deducibili dal reddito imponibile nel Regime Ordinario. Li trovi nel modello Redditi dell'anno scorso. Lascia 0 se è il primo anno di attività."
                          side="top"
                        />
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={prevINPSStr}
                        onChange={(e) => setPrevINPSStr(e.target.value)}
                        onBlur={() => {
                          const v = parseLooseNumber(prevINPSStr) ?? 0;
                          setPrevINPSStr(String(v));
                          setInputs((prev) => ({
                            ...prev,
                            previousYearINPS: v,
                          }));
                        }}
                        className="w-full px-3 py-2.5 border-b border-zinc-300 bg-transparent text-sm text-zinc-900 font-mono tabular focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>
                </div>

                {/* B2B / B2C */}
                <div>
                  <label className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-editorial mb-2">
                    Tipo Clientela
                    <InfoTooltip
                      content="B2B (aziende): il cliente recupera l'IVA, quindi il prezzo netto non cambia. B2C (privati): il cliente non può recuperare l'IVA - in Regime Ordinario devi applicare il 22% e versarlo allo Stato, il che erode il tuo margine se non riesci ad alzare i prezzi."
                      side="top"
                    />
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
                      B2B - Aziende
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
                      B2C - Privati
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
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600">
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

              <div className="flex justify-between text-xs font-semibold text-zinc-600 mt-3">
                <span>€20k</span>
                <span className="text-amber-600">
                  €{FORFETTARIO_ENTRY_LIMIT.toLocaleString("it-IT")} limite
                </span>
                <span className="text-red-600 flex items-center">
                  €{FORFETTARIO_EXIT_CLIFF.toLocaleString("it-IT")} cliff
                  <InfoTooltip
                    content={`€${FORFETTARIO_ENTRY_LIMIT.toLocaleString("it-IT")}: se superi questo importo nell'anno N, perdi il forfettario dall'anno N+1. €${FORFETTARIO_EXIT_CLIFF.toLocaleString("it-IT")} (cliff): se superi questo importo nell'anno corrente, esci dal forfettario con effetto retroattivo - tutte le tasse dell'anno vengono ricalcolate in Regime Ordinario.`}
                    side="top"
                  />
                </span>
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
              <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
                Netto Disponibile - Proiezione €30k → €120k
              </p>
              <ForfettarioChart
                chartData={chartData}
                expectedRevenue={inputs.expectedRevenue}
              />
            </div>

            {/* ── VERDICT - THE ANCHOR ── */}
            <div
              className={`border-l-4 ${forfettarioWins ? "border-l-zinc-950 bg-white" : isOverCliff ? "border-l-red-600 bg-red-50" : "border-l-red-600 bg-white"} border border-zinc-200 p-6`}
            >
              {isOverCliff ? (
                <div>
                  <p className="text-xs uppercase tracking-editorial font-semibold text-red-600 mb-1">
                    Regime Forfettario - Non disponibile
                  </p>
                  <p className="text-sm text-zinc-600">
                    Sopra €{FORFETTARIO_EXIT_CLIFF.toLocaleString("it-IT")} si
                    esce dal forfettario con effetto retroattivo.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-1">
                        {forfettarioWins
                          ? "Forfettario - Regime Consigliato"
                          : "Ordinario - Regime Consigliato"}
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
                      <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-1">
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
                        {formatCurrency(
                          FORFETTARIO_EXIT_CLIFF - inputs.expectedRevenue,
                        )}
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
                  <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
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
                          : "-",
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
                  {inputs.realExpenses > 0 && (
                    <p className="text-[10px] text-zinc-600 mt-3 leading-relaxed">
                      Spese ({formatCurrency(inputs.realExpenses)}) incluse nel
                      netto - nel forfettario non sono deducibili fiscalmente ma
                      le paghi comunque.
                    </p>
                  )}
                </div>
              )}

              {/* ORDINARIO */}
              <div
                className={`bg-white border ${!forfettarioWins && !isOverCliff ? "border-zinc-950" : "border-zinc-200"} p-5 ${isOverCliff ? "sm:col-span-2" : ""}`}
              >
                <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
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
                        : "-",
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
                  - devi versare l&apos;acconto?
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
                  disabled={pdfStatus === "generating"}
                  onClick={generatePdf}
                  className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm uppercase tracking-editorial py-3 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pdfStatus === "generating" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : pdfStatus === "done" ? (
                    <span className="text-green-400">&#10003;</span>
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {pdfStatus === "generating"
                    ? "Generazione..."
                    : pdfStatus === "done"
                      ? "Download Avviato"
                      : "Scarica Report"}
                </button>
              </div>

              {downloadNotice && (
                <div className="w-full sm:w-auto sm:min-w-[280px] border border-emerald-200 bg-emerald-50 p-3">
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
          </div>
        </div>
      </div>

      {/* Generating overlay */}
      {pdfStatus === "generating" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white border border-zinc-200 px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-950" />
            <p className="text-sm font-black text-zinc-950 uppercase tracking-editorial">
              Generazione Report
            </p>
            <p className="text-xs text-zinc-600">Calcoli in corso&hellip;</p>
          </div>
        </div>
      )}
    </div>
  );
}
