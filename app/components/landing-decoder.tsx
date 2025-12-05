"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { useState, useEffect } from "react";
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
  Lock,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const schema = z.object({
  la_verita: z.string(),
  livello_di_rischio: z.enum(["BASSO", "MEDIO", "ALTO"]),
  cosa_devi_fare: z.string(),
  nota_del_burocrate: z.string(),
});

type Persona = "cinico" | "solerte" | "avvocato";

export default function LandingDecoder() {
  const [input, setInput] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<Persona>("cinico");
  const [fileName, setFileName] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Usage State
  const [usageData, setUsageData] = useState({
    cinico: false,
    solerte: false,
    avvocato: false,
  });

  // Load usage from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(
      new RegExp("(^| )preview_usage_data=([^;]+)")
    );
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[2]));
        setUsageData(data);

        // Auto-select first available persona
        if (data.cinico) {
          if (!data.solerte) setSelectedPersona("solerte");
          else if (!data.avvocato) setSelectedPersona("avvocato");
        }
      } catch (e) {
        console.error("Failed to parse usage cookie", e);
      }
    }
  }, []);

  const remainingUses =
    3 -
    ((usageData.cinico ? 1 : 0) +
      (usageData.solerte ? 1 : 0) +
      (usageData.avvocato ? 1 : 0));

  const { object, submit, isLoading, error } = useObject({
    api: "/api/chat/preview",
    schema,
    onFinish: () => {
      // Optimistically update usage
      setUsageData((prev) => ({ ...prev, [selectedPersona]: true }));
    },
    onError: (err) => {
      console.error("Preview Error:", err);
      setShowLimitModal(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !base64Image) return;
    submit({ prompt: input, persona: selectedPersona, image: base64Image });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64Image(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8 mb-20">
      {/* Limit Modal */}
      {showLimitModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 max-w-md w-full text-center shadow-[8px_8px_0px_0px_rgba(253,224,71,1)]">
            <Lock className="w-16 h-16 mx-auto mb-4 text-black" />
            <h3 className="text-2xl font-black uppercase mb-4">
              Hai finito i gettoni!
            </h3>
            <p className="text-lg mb-8 font-medium">
              La burocrazia non dorme mai, ma la tua prova gratuita sì.
              Registrati per continuare a decodificare l'impossibile.
            </p>
            <Link
              href="/dashboard"
              className="block w-full bg-black text-white px-6 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-800 transition-all border-2 border-black"
            >
              Registrati Gratis
            </Link>
          </div>
        </div>
      )}

      <div className="absolute -top-6 -left-6 bg-yellow-300 border-4 border-black px-4 py-2 font-black uppercase rotate-[-5deg] shadow-sm z-10">
        Prova Gratuita ({remainingUses} usi rimasti)
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div>
            <label className="block font-black uppercase mb-2 text-lg">
              1. Scegli il tuo traduttore
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  !usageData.cinico && setSelectedPersona("cinico")
                }
                disabled={usageData.cinico}
                className={cn(
                  "p-2 border-2 border-black font-bold text-sm transition-all relative",
                  selectedPersona === "cinico"
                    ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]"
                    : "bg-white text-black hover:bg-gray-100",
                  usageData.cinico &&
                    "opacity-50 cursor-not-allowed bg-gray-200"
                )}
              >
                {usageData.cinico && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 border border-black z-10">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <Hammer className="w-5 h-5" />
                  <span>CINICO</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  !usageData.solerte && setSelectedPersona("solerte")
                }
                disabled={usageData.solerte}
                className={cn(
                  "p-2 border-2 border-black font-bold text-sm transition-all relative",
                  selectedPersona === "solerte"
                    ? "bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black hover:bg-gray-100",
                  usageData.solerte &&
                    "opacity-50 cursor-not-allowed bg-gray-200"
                )}
              >
                {usageData.solerte && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 border border-black z-10">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <Stamp className="w-5 h-5" />
                  <span>SOLERTE</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  !usageData.avvocato && setSelectedPersona("avvocato")
                }
                disabled={usageData.avvocato}
                className={cn(
                  "p-2 border-2 border-black font-bold text-sm transition-all relative",
                  selectedPersona === "avvocato"
                    ? "bg-purple-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black hover:bg-gray-100",
                  usageData.avvocato &&
                    "opacity-50 cursor-not-allowed bg-gray-200"
                )}
              >
                {usageData.avvocato && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 border border-black z-10">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <Scale className="w-5 h-5" />
                  <span>AVVOCATO</span>
                </div>
              </button>
            </div>
            <p className="text-xs font-mono mt-2 text-gray-600 bg-gray-100 p-2 border border-black/20">
              {selectedPersona === "cinico" &&
                "Ti dice le cose come stanno, con cattiveria."}
              {selectedPersona === "solerte" &&
                "Ti dice cosa fare, senza emozioni."}
              {selectedPersona === "avvocato" &&
                "Ti spiega come se avessi 5 anni (con disclaimer)."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-black uppercase mb-2 text-lg">
                2. Incolla il testo o carica foto
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-40 p-4 border-2 border-black font-mono text-sm focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-none bg-gray-50"
                  placeholder="Incolla qui il testo burocratico incomprensibile..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                {/* File Upload Button inside textarea area */}
                <div className="absolute bottom-3 right-3">
                  <input
                    type="file"
                    id="file-upload-landing"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload-landing"
                    className={cn(
                      "cursor-pointer flex items-center gap-2 px-3 py-1 text-xs font-bold border-2 border-black transition-all hover:-translate-y-0.5",
                      fileName
                        ? "bg-green-400 text-black"
                        : "bg-white text-black hover:bg-gray-100"
                    )}
                  >
                    {fileName ? (
                      <>
                        <Check className="w-3 h-3" />{" "}
                        {fileName.substring(0, 10)}...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" /> CARICA FOTO
                      </>
                    )}
                  </label>
                </div>

                {base64Image && (
                  <button
                    type="button"
                    onClick={() => {
                      setBase64Image(undefined);
                      setFileName(null);
                    }}
                    className="absolute bottom-3 right-36 bg-red-500 text-white border-2 border-black p-1 hover:bg-red-600"
                    title="Rimuovi immagine"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!input && !base64Image)}
              className="w-full bg-black text-white py-4 text-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] hover:translate-y-1 hover:shadow-none border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> DECODIFICA...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" /> DECODIFICA ORA
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output */}
        <div className="bg-gray-100 border-2 border-black p-6 relative min-h-[400px] flex flex-col">
          <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
            RISULTATO
          </div>

          {!object ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8 opacity-50">
              <FileText className="w-16 h-16 mb-4" />
              <p className="font-mono text-sm">
                Il risultato della decodifica apparirà qui.
                <br />
                Speriamo non siano brutte notizie.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header with Risk Level */}
              <div className="flex items-center justify-between border-b-2 border-black pb-4">
                <div className="flex items-center gap-2">
                  <MessageSquareQuote className="w-6 h-6" />
                  <span className="font-bold uppercase">Il Verdetto</span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 font-black text-sm uppercase border-2",
                    getRiskColor(object.livello_di_rischio)
                  )}
                >
                  Rischio: {object.livello_di_rischio}
                </span>
              </div>

              {/* The Truth */}
              <div>
                <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> La Verità
                </h3>
                <p className="font-mono text-lg leading-relaxed bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  {object.la_verita}
                </p>
              </div>

              {/* Action Plan */}
              <div>
                <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Cosa Devi Fare
                </h3>
                <div className="font-mono text-sm bg-yellow-50 p-4 border-l-4 border-black">
                  {object.cosa_devi_fare}
                </div>
              </div>

              {/* Bureaucrat Note */}
              <div className="pt-4 border-t-2 border-black/20">
                <div className="flex gap-2 text-xs text-gray-500 font-mono italic">
                  <Quote className="w-4 h-4 rotate-180" />
                  <p>{object.nota_del_burocrate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
