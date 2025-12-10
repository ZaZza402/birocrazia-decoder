import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, FileText, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-300">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Image
                  src="/android-chrome-512x512.png"
                  alt="Bur0 Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none tracking-tight">
                  Bur<span className="text-indigo-400 font-mono text-2xl">0</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Strumenti Fiscali
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              Strumenti gratuiti e sempre aggiornati per gestire la tua Partita
              IVA. Calcola tasse, simula scenari fiscali e genera documenti in
              pochi click.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span>in Italia</span>
            </div>
          </div>

          {/* Tools Column */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Calcolatori
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/calcolatori/forfettario"
                  className="group flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <Image
                    src="/android-chrome-512x512.png"
                    alt="Calculator"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span>Regime Forfettario</span>
                  <span className="ml-auto px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/calcolatori/ricevuta"
                  className="group flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generatore Ricevute</span>
                  <span className="ml-auto px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded uppercase">
                    Soon
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Risorse
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.agenziaentrate.gov.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <span>Agenzia delle Entrate</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.inps.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <span>INPS - Contributi</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <Link
                  href="/upgrade"
                  className="group flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <span>Sei un Commercialista?</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@alecsdesign.xyz?subject=Supporto%20Bur0"
                  className="group flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Scrivici qui</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} Bur0. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-indigo-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termini"
              className="hover:text-indigo-400 transition-colors"
            >
              Termini di Servizio
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/30 rounded-xl">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> I calcoli
            forniti sono indicativi e basati sulla normativa fiscale italiana
            vigente. Per consulenze specifiche rivolgersi sempre a un
            commercialista abilitato. Bur0 non si assume responsabilità per
            decisioni prese sulla base delle informazioni fornite.
          </p>
        </div>
      </div>
    </footer>
  );
}
