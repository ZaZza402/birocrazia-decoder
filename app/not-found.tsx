import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-200">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-slate-700 mb-4">
            Pagina Non Trovata
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Torna alla Home</span>
          </Link>

          <Link
            href="/calcolatori/forfettario"
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-indigo-600 text-indigo-600 font-bold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Vai al Simulatore</span>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Se pensi che questa sia un errore,{" "}
            <a
              href="mailto:info@alecsdesign.xyz?subject=Errore%20404%20su%20Bur0"
              className="text-indigo-600 hover:underline font-medium"
            >
              contattaci
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
