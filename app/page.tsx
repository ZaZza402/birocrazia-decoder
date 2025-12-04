"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { useState } from "react";
import {
  CheckCircle,
  MessageSquareQuote,
  Send,
  Loader2,
  Share2,
  Quote,
  Check,
  Hammer,
  Stamp,
  AlertTriangle,
  Briefcase,
  Scale,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the schema to match the API response
const schema = z.object({
  la_verita: z.string(),
  livello_di_rischio: z.enum(["BASSO", "MEDIO", "ALTO"]),
  cosa_devi_fare: z.string(),
  nota_del_burocrate: z.string(),
});

type Persona = "cinico" | "solerte" | "avvocato";

export default function Home() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>("cinico");
  const [fileName, setFileName] = useState<string | null>(null);

  const { object, submit, isLoading } = useObject({
    api: "/api/chat",
    schema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    submit({ prompt: input, persona: selectedPersona });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Mock OCR: In a real app, you'd upload this file to your API
      // and get the text back. For now, we simulate it.
      setInput(
        (prev) =>
          prev +
          `\n[FILE CARICATO: ${file.name} - Contenuto simulato del documento...]`
      );
    }
  };

  const handleShare = async () => {
    const shareText =
      "Condividi con qualcuno che non capisce un ca**o: " +
      window.location.href;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard failed:", err);
    }
  };

  // Helper to determine badge color based on risk level
  const getRiskColor = (level?: "BASSO" | "MEDIO" | "ALTO") => {
    switch (level) {
      case "ALTO":
        return "bg-red-700 text-white border-red-800";
      case "MEDIO":
        return "bg-amber-600 text-white border-amber-700";
      case "BASSO":
        return "bg-olive-700 text-white border-olive-800 bg-[#4a5d23]";
      default:
        return "bg-slate-700 text-white border-slate-800";
    }
  };

  const personas = [
    {
      id: "cinico",
      name: "Il Commercialista Cinico",
      icon: Briefcase,
      desc: "Sarcasmo brutale e verità scomode.",
      color: "bg-slate-900 text-white",
    },
    {
      id: "solerte",
      name: "Il Funzionario Solerte",
      icon: FileText,
      desc: "Chiarezza assoluta, zero emozioni.",
      color: "bg-blue-600 text-white",
    },
    {
      id: "avvocato",
      name: "L'Avvocato Cauto",
      icon: Scale,
      desc: "Paranoia legale e rischi ovunque.",
      color: "bg-emerald-800 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <main className="max-w-xl mx-auto space-y-6 pt-6 md:pt-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Il Decodificatore
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            La Burocrazia. Svelata.{" "}
            <span className="text-red-600 font-bold">Fa male.</span>
          </p>
        </div>

        {/* Persona Selector */}
        <div className="grid grid-cols-3 gap-2">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id as Persona)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 h-24",
                selectedPersona === p.id
                  ? `${p.color} border-transparent shadow-lg scale-105`
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <p.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                {p.name}
              </span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl opacity-20 group-hover:opacity-40 transition duration-200 blur"></div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Incolla qui il testo per ${
                personas.find((p) => p.id === selectedPersona)?.name
              }...`}
              className="relative w-full min-h-[120px] p-4 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none resize-none shadow-sm transition-all text-slate-900 placeholder:text-slate-400 text-base font-medium"
              disabled={isLoading}
            />

            {/* File Upload Overlay / Button */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-slate-200">
                <Upload className="w-4 h-4" />
                {fileName ? "Cambia File" : "Carica Foto/PDF"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                />
              </label>
            </div>
          </div>

          {fileName && (
            <div className="flex items-center justify-between bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {fileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFileName(null);
                  setInput("");
                }}
                className="hover:bg-blue-100 p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "w-full h-14 rounded-xl font-black text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98] uppercase tracking-wide text-white",
              selectedPersona === "cinico"
                ? "bg-slate-900 hover:bg-slate-800"
                : selectedPersona === "solerte"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-800 hover:bg-emerald-900"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analisi in corso...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                DECODIFICA ORA
              </>
            )}
          </button>
        </form>

        {/* Results Display */}
        {object && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Result Card */}
            <div className="bg-white rounded-none shadow-2xl border-2 border-slate-900 overflow-hidden relative">
              {/* Risk Header */}
              {object.livello_di_rischio && (
                <div
                  className={cn(
                    "px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between",
                    getRiskColor(object.livello_di_rischio)
                  )}
                >
                  <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {selectedPersona === "cinico"
                      ? "ATTENZIONE: Quanto siamo fottuti?"
                      : "Livello di Rischio Rilevato"}
                  </span>
                  <span className="font-black text-2xl uppercase tracking-widest">
                    {object.livello_di_rischio}
                  </span>
                </div>
              )}

              <div className="p-6 md:p-8 space-y-8">
                {/* Summary (The Truth) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Quote className="w-8 h-8 fill-slate-900" />
                    <span className="text-sm font-black uppercase tracking-widest border-b-2 border-slate-900">
                      {selectedPersona === "cinico"
                        ? "LA VERITÀ"
                        : "ANALISI DEL DOCUMENTO"}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {object.la_verita}
                  </h2>
                </div>

                {/* Action Required */}
                <div className="bg-slate-100 p-6 border-l-8 border-slate-900 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-slate-900 mb-1">
                    <Hammer className="w-6 h-6" />
                    <div className="text-sm font-black uppercase tracking-widest">
                      {selectedPersona === "cinico"
                        ? "L'UNICA COSA CHE DEVI FARE ORA"
                        : "AZIONI RICHIESTE"}
                    </div>
                  </div>
                  <p className="text-xl font-bold text-slate-900 leading-relaxed">
                    {object.cosa_devi_fare}
                  </p>
                </div>

                {/* Bureaucrat's Note */}
                <div className="pt-6 relative">
                  <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-slate-300"></div>
                  <div className="flex gap-4 items-start mt-4 opacity-80 hover:opacity-100 transition-opacity">
                    <Stamp className="w-10 h-10 text-slate-400 shrink-0 rotate-12" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {selectedPersona === "cinico"
                          ? "Nota del Burocrate"
                          : "Note Aggiuntive"}
                      </p>
                      <p className="italic text-slate-600 font-serif text-lg leading-relaxed border-l-2 border-slate-200 pl-4">
                        &quot;{object.nota_del_burocrate}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full bg-white text-slate-900 h-14 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <Share2 className="w-6 h-6" />
              )}
              {copied ? "LINK COPIATO!" : "COPIA LINK PER CONDIVIDERE LA PENA"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
