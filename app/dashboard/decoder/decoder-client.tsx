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

import { Plan } from "@/lib/plans";

type Persona = "cinico" | "solerte" | "avvocato";

export default function DecoderClient({ plan }: { plan: Plan }) {
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
        return "bg-red-600 text-white border-black";
      case "MEDIO":
        return "bg-yellow-400 text-black border-black";
      case "BASSO":
        return "bg-green-500 text-black border-black";
      default:
        return "bg-gray-200 text-black border-black";
    }
  };

  const personas = [
    {
      id: "cinico",
      name: "Il Commercialista Cinico",
      icon: Briefcase,
      desc: "Sarcasmo brutale e verità scomode.",
      color: "bg-white text-black border-black",
      activeColor: "bg-yellow-300 text-black border-black",
      requiredPlan: ["FREE", "STARTER", "PRO"],
      loadingText: "Sto insultando il funzionario...",
    },
    {
      id: "solerte",
      name: "Il Funzionario Solerte",
      icon: FileText,
      desc: "Chiarezza assoluta, zero emozioni.",
      color: "bg-white text-black border-black",
      activeColor: "bg-blue-300 text-black border-black",
      requiredPlan: ["STARTER", "PRO"],
      loadingText: "Sto compilando il modulo H7-bis...",
    },
    {
      id: "avvocato",
      name: "L'Avvocato Cauto",
      icon: Scale,
      desc: "Paranoia legale e rischi ovunque.",
      color: "bg-white text-black border-black",
      activeColor: "bg-red-300 text-black border-black",
      requiredPlan: ["PRO"],
      loadingText: "Sto consultando la giurisprudenza...",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black font-mono p-4 md:p-8 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <FileText
          size={400}
          strokeWidth={0.5}
          className="absolute -top-20 -right-20"
        />
      </div>

      <main className="max-w-2xl mx-auto space-y-8 pt-6 md:pt-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter bg-yellow-300 inline-block px-4 py-1 border-4 border-black transform -rotate-2">
            Il Decodificatore
          </h1>
          <p className="text-xl font-bold border-l-4 border-black pl-4 max-w-md mx-auto">
            La Burocrazia fa schifo. <br />
            <span className="bg-black text-white px-1">
              Noi la distruggiamo.
            </span>
          </p>
        </div>

        {/* Persona Selector */}
        <div className="grid grid-cols-3 gap-4">
          {personas.map((p) => {
            const isLocked = !p.requiredPlan.includes(plan);
            return (
              <button
                key={p.id}
                onClick={() => !isLocked && setSelectedPersona(p.id as Persona)}
                disabled={isLocked}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border-4 transition-all gap-2 h-32 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  selectedPersona === p.id
                    ? `${p.activeColor}`
                    : isLocked
                    ? "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0 hover:shadow-none"
                    : "bg-white border-black hover:bg-gray-50"
                )}
              >
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80 z-10">
                    <div className="bg-black text-white text-xs font-black px-2 py-1 uppercase transform -rotate-12 border-2 border-white">
                      Lucchetto
                    </div>
                  </div>
                )}
                <p.icon className="w-8 h-8 stroke-[2.5px]" />
                <span className="text-xs font-black uppercase tracking-wide text-center leading-tight">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`INCOLLA QUI IL TESTO PER ${personas
                .find((p) => p.id === selectedPersona)
                ?.name.toUpperCase()}...`}
              className="w-full min-h-[150px] p-6 border-4 border-black bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-lg font-bold placeholder:text-gray-400"
              disabled={isLoading}
            />

            {/* File Upload Overlay / Button */}
            <div className="absolute bottom-4 right-4">
              <label className="cursor-pointer bg-white hover:bg-gray-100 text-black px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 text-xs font-black uppercase">
                <Upload className="w-4 h-4" />
                {fileName ? "Cambia File" : "Carica PDF/Foto"}
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
            <div className="flex items-center justify-between bg-blue-100 text-black px-4 py-2 border-2 border-black font-bold">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {fileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFileName(null);
                  setInput("");
                }}
                className="hover:bg-red-500 hover:text-white p-1 border-2 border-transparent hover:border-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full py-4 bg-black text-white font-black text-xl uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:bg-gray-800 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {personas.find((p) => p.id === selectedPersona)?.loadingText ||
                  "Analisi in corso..."}
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                DECODIFICA ORA
              </>
            )}
          </button>
        </form>

        {/* Results Display */}
        {object && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Result Card */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              {/* Risk Header */}
              {object.livello_di_rischio && (
                <div
                  className={cn(
                    "px-6 py-4 border-b-4 border-black flex items-center justify-between",
                    getRiskColor(object.livello_di_rischio)
                  )}
                >
                  <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    LIVELLO DI RISCHIO
                  </span>
                  <span className="font-black text-3xl uppercase tracking-tighter">
                    {object.livello_di_rischio}
                  </span>
                </div>
              )}

              <div className="p-8 space-y-8">
                {/* Summary (The Truth) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white p-2">
                      <Quote className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-widest bg-yellow-300 px-2 border-2 border-black">
                      LA VERITÀ
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-black leading-tight uppercase">
                    {object.la_verita}
                  </h2>
                </div>

                {/* Action Required */}
                <div className="bg-gray-100 p-6 border-4 border-black flex flex-col gap-4 relative">
                  <div className="absolute -top-4 -left-4 bg-black text-white px-3 py-1 font-black uppercase border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Cosa devi fare
                  </div>
                  <p className="text-xl font-bold text-black leading-relaxed mt-2">
                    {object.cosa_devi_fare}
                  </p>
                </div>

                {/* Bureaucrat's Note */}
                <div className="pt-6 border-t-4 border-dashed border-gray-300">
                  <div className="flex gap-4 items-start">
                    <Stamp className="w-12 h-12 text-red-600 shrink-0 rotate-12 opacity-80" />
                    <div className="space-y-2">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                        NOTA DEL BUROCRATE
                      </p>
                      <p className="italic text-gray-600 font-serif text-lg leading-relaxed border-l-4 border-black pl-4">
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
              className="w-full bg-white text-black py-4 font-black text-xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3"
            >
              {copied ? (
                <Check className="w-6 h-6" />
              ) : (
                <Share2 className="w-6 h-6" />
              )}
              {copied ? "LINK COPIATO!" : "CONDIVIDI QUESTA FOLLIA"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
