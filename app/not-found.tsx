import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-lg w-full">
        {/* ── HEADER ── */}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-400 mb-2">
            Errore
          </p>
          <h1 className="text-8xl md:text-9xl font-black text-zinc-950 tracking-tight leading-none">
            404
          </h1>
          <p className="mt-4 text-base text-zinc-500">
            La pagina che cerchi non esiste o &egrave; stata spostata.
          </p>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm uppercase tracking-editorial px-6 py-3.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            Torna alla Home
          </Link>
          <Link
            href="/calcolatori/forfettario"
            className="inline-flex items-center justify-center gap-2 border border-zinc-300 hover:border-zinc-700 text-zinc-700 hover:text-zinc-950 font-bold text-sm uppercase tracking-editorial px-6 py-3.5 transition-colors"
          >
            Apri il Simulatore
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-zinc-400">
          Pensi sia un errore?{" "}
          <a
            href="mailto:info@alecsdesign.xyz?subject=Errore%20404%20su%20Bur0"
            className="underline underline-offset-2 hover:text-zinc-700 transition-colors"
          >
            Scrivici
          </a>
        </p>
      </div>
    </div>
  );
}
