import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-lg font-black text-white mb-1">
              Bur<span className="font-mono">0</span>
            </p>
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
              Strumenti Fiscali Gratuiti
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Calcola tasse, simula scenari fiscali e genera documenti.
              Aggiornato per il {currentYear}.
            </p>
          </div>

          {/* Calcolatori */}
          <div>
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
              Calcolatori
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/calcolatori/forfettario"
                  className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  Regime Forfettario{" "}
                  <span className="text-[10px] uppercase tracking-editorial font-semibold text-green-500">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/calcolatori/ateco"
                  className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  Codice ATECO 2025{" "}
                  <span className="text-[10px] uppercase tracking-editorial font-semibold text-green-500">
                    Live
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Riferimenti */}
          <div>
            <p className="text-xs uppercase tracking-editorial font-semibold text-zinc-600 mb-4">
              Riferimenti
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.agenziaentrate.gov.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Agenzia delle Entrate{" "}
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.inps.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  INPS <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@bur0.click"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Contatti
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {currentYear} Bur0 — I calcoli sono indicativi. Per consulenze
            specifiche, rivolgiti a un commercialista.
          </p>
          <div className="flex gap-5 text-xs text-zinc-600">
            <Link
              href="/privacy"
              className="hover:text-zinc-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/termini"
              className="hover:text-zinc-400 transition-colors"
            >
              Termini
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
