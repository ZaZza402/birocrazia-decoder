"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Send,
  Loader2,
  Quote,
  Check,
  Stamp,
  AlertTriangle,
  Briefcase,
  Scale,
  FileText,
  Download,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateShareImage, downloadImage } from "@/lib/generate-share-image";
import Footer from "./components/footer";
import {
  trackDecoderStart,
  trackDecoderComplete,
  trackDecoderError,
  trackRateLimit,
  trackPersonaSelect,
  trackDocumentUpload,
  trackDocumentRemove,
  trackShareImageGenerate,
  trackShareImageDownload,
  trackTextInputStart,
  trackDisclaimerClick,
} from "@/lib/analytics";

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

export default function DecoderClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>("cinico");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasTrackedInputStart, setHasTrackedInputStart] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/chat",
    schema,
  });

  // Track when decoder completes successfully
  useEffect(() => {
    if (object && startTime && !isLoading) {
      const duration = Date.now() - startTime;
      trackDecoderComplete(
        selectedPersona,
        !!uploadedImage,
        object.livello_di_rischio || "MEDIO",
        duration
      );
      setStartTime(null);
    }
  }, [object, isLoading, startTime, selectedPersona, uploadedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Per favore carica un'immagine (JPG, PNG, etc.)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("L'immagine è troppo grande. Max 10MB.");
      return;
    }

    setImageFileName(file.name);

    // Track upload
    trackDocumentUpload(file.name, file.size);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUploadedImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    trackDocumentRemove();
    setUploadedImage(null);
    setImageFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !uploadedImage) return;

    // Clear previous rate limit error
    setRateLimitError(null);

    // Track decoder start
    setStartTime(Date.now());
    trackDecoderStart(selectedPersona, !!uploadedImage);

    try {
      await submit({
        prompt: input || "Analizza questo documento",
        persona: selectedPersona,
        image: uploadedImage || undefined,
      });

      // Clear image after submission (won't be saved)
      if (uploadedImage) {
        removeImage();
      }
    } catch (err: any) {
      // Track error
      trackDecoderError(err?.message || "Unknown error", selectedPersona);

      // Check if it's a rate limit error
      if (
        err?.message?.includes("429") ||
        err?.message?.includes("Troppe richieste")
      ) {
        setRateLimitError(err.message);
        // Extract minutes from error message
        const match = err.message.match(/(\d+)\s+minut/i);
        if (match) {
          trackRateLimit(selectedPersona, parseInt(match[1]));
        }
      }
    }
  };

  const handleShare = async () => {
    if (!object) return;

    setIsGeneratingImage(true);

    // Track image generation start
    trackShareImageGenerate(
      selectedPersona,
      object.livello_di_rischio || "MEDIO"
    );

    try {
      const imageBlob = await generateShareImage({
        prompt: input,
        laVerita: object.la_verita || "In analisi...",
        livelloDiRischio: object.livello_di_rischio || "MEDIO",
        cosaDeviFare: object.cosa_devi_fare || "Attendi l'analisi completa...",
        notaDelBurocrate:
          object.nota_del_burocrate || "Elaborazione in corso...",
        persona:
          personas.find((p) => p.id === selectedPersona)?.name ||
          "Il Decodificatore",
      });

      const timestamp = new Date().toISOString().split("T")[0];
      downloadImage(imageBlob, `bur0-decodifica-${timestamp}.png`);

      // Track successful download
      trackShareImageDownload(selectedPersona);

      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Image generation failed:", err);
      trackDecoderError("Image generation failed", selectedPersona);
      alert("Errore nella generazione dell'immagine. Riprova.");
    } finally {
      setIsGeneratingImage(false);
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

  const personas = [
    {
      id: "cinico",
      name: "Il Commercialista Cinico",
      icon: Briefcase,
      desc: "Sarcasmo brutale e verità scomode.",
      color: "bg-white text-black border-black",
      activeColor: "bg-yellow-300 text-black border-black",
      loadingText: "Sto insultando il funzionario...",
    },
    {
      id: "solerte",
      name: "Il Funzionario Solerte",
      icon: FileText,
      desc: "Chiarezza assoluta, zero emozioni.",
      color: "bg-white text-black border-black",
      activeColor: "bg-blue-300 text-black border-black",
      loadingText: "Sto compilando il modulo H7-bis...",
    },
    {
      id: "avvocato",
      name: "L'Avvocato Cauto",
      icon: Scale,
      desc: "Paranoia legale e rischi ovunque.",
      color: "bg-white text-black border-black",
      activeColor: "bg-red-300 text-black border-black",
      loadingText: "Sto consultando la giurisprudenza...",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#f0f0f0] text-black font-mono p-4 md:p-8 pt-24 md:pt-28 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <FileText
            size={600}
            strokeWidth={0.3}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <main className="max-w-2xl mx-auto space-y-8 pt-6 md:pt-12 pb-20 relative z-10">
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
            {/* Disclaimer Banner */}
            <div className="bg-red-100 border-2 border-red-600 p-3 text-sm font-bold max-w-lg mx-auto">
              <span className="text-red-600">⚠️ NON È CONSULENZA LEGALE</span> •{" "}
              <Link
                href="/disclaimer"
                className="underline hover:text-red-800"
                onClick={() => trackDisclaimerClick()}
              >
                Leggi il disclaimer completo
              </Link>
            </div>
          </div>

          {/* Persona Selector - ALL UNLOCKED */}
          <div className="grid grid-cols-3 gap-4">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  const prevPersona = selectedPersona;
                  setSelectedPersona(p.id as Persona);
                  trackPersonaSelect(p.id, prevPersona);
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border-4 transition-all gap-2 h-32 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  selectedPersona === p.id
                    ? `${p.activeColor}`
                    : "bg-white border-black hover:bg-gray-50"
                )}
              >
                <p.icon className="w-8 h-8 stroke-[2.5px]" />
                <span className="text-xs font-black uppercase tracking-wide text-center leading-tight">
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Track first interaction with text input
                  if (!hasTrackedInputStart && e.target.value.length > 0) {
                    trackTextInputStart();
                    setHasTrackedInputStart(true);
                  }
                }}
                placeholder={`INCOLLA QUI IL TESTO PER ${personas
                  .find((p) => p.id === selectedPersona)
                  ?.name.toUpperCase()}...`}
                className="w-full min-h-[150px] p-6 border-4 border-black bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-lg font-bold placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />

              {!uploadedImage ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-black font-black text-base uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Carica Documento (Opzionale)
                </button>
              ) : (
                <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ImageIcon className="w-6 h-6 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {imageFileName}
                        </p>
                        <p className="text-xs text-gray-600">
                          Immagine caricata (sarà eliminata dopo l'analisi)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={isLoading}
                      className="p-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rate Limit Error Display */}
            {(rateLimitError || error) && (
              <div className="bg-red-500 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-white font-black text-center">
                  {rateLimitError ||
                    error?.message ||
                    "Errore durante l'elaborazione"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !uploadedImage)}
              className="w-full py-4 bg-black text-white font-black text-xl uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:bg-gray-800 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {personas.find((p) => p.id === selectedPersona)
                    ?.loadingText || "Analisi in corso..."}
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  {uploadedImage ? "ANALIZZA DOCUMENTO" : "DECODIFICA ORA"}
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
                    <h2 className="text-lg md:text-xl font-mono text-black leading-relaxed">
                      {object.la_verita}
                    </h2>
                  </div>

                  {/* Action Required */}
                  <div className="bg-gray-100 p-6 border-4 border-black flex flex-col gap-4 relative">
                    <div className="absolute -top-4 -left-4 bg-black text-white px-3 py-1 font-black uppercase border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Cosa devi fare
                    </div>
                    <p className="text-lg font-mono text-black leading-relaxed mt-2">
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
                disabled={isGeneratingImage}
                className="w-full bg-white text-black py-4 font-black text-xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    GENERANDO IMMAGINE...
                  </>
                ) : copied ? (
                  <>
                    <Check className="w-6 h-6" />
                    IMMAGINE SCARICATA!
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    SCARICA COME IMMAGINE
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
