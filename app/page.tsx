import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ShieldAlert,
  Zap,
  XCircle,
} from "lucide-react";
import LandingDecoder from "./components/landing-decoder";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans text-black selection:bg-yellow-300">
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-black text-white px-4 py-1 font-bold uppercase tracking-widest mb-6 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
            Basta soffrire
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            LA BUROCRAZIA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              TI UCCIDE?
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            <span
              className="font-black italic text-yellow-400 tracking-widest"
              style={{ WebkitTextStroke: "1.5px black" }}
            >
              Bur0
            </span>{" "}
            traduce il legalese in italiano brutale. Carica la foto di quella
            lettera dell'Agenzia delle Entrate e scopri se devi scappare in
            Messico.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-800 transition-all shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] hover:translate-y-1 hover:shadow-none border-2 border-black flex items-center gap-2"
            >
              Inizia Gratis <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="#pricing"
              className="bg-white text-black px-8 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-50 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none border-2 border-black"
            >
              Vedi Prezzi
            </Link>
          </div>

          {/* Live Preview Section */}
          <div className="relative z-20">
            <LandingDecoder />
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-red-300 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase">Istantaneo</h3>
            <p className="text-lg font-medium text-gray-600">
              Non aspettare il commercialista. Ottieni risposte in 3 secondi
              netti. Senza appuntamento.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase">Analisi Rischi</h3>
            <p className="text-lg font-medium text-gray-600">
              Ti diciamo subito se è una multa, una truffa o solo carta
              straccia. Senza giri di parole.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase">Azioni Chiare</h3>
            <p className="text-lg font-medium text-gray-600">
              "Paga entro domani" o "Butta nel cestino". Istruzioni a prova di
              idiota.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[#ff90e8]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16 uppercase tracking-tighter">
            Scegli la tua pena
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Free Plan */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
              <h3 className="text-2xl font-black uppercase mb-2">Cittadino</h3>
              <div className="text-4xl font-black mb-6">
                €0<span className="text-xl">/sempre</span>
              </div>
              <ul className="space-y-4 mb-8 font-bold text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> 7 Decodifiche al MESE
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Persona: Cinico (Sintesi
                  Brutale)
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <XCircle className="w-5 h-5" /> No Upload PDF (Solo Testo)
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <XCircle className="w-5 h-5" /> No Archivio Storico
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full bg-gray-200 text-black text-center py-4 font-black uppercase border-2 border-black hover:bg-gray-300 transition-colors"
              >
                Resta Povero
              </Link>
            </div>

            {/* Starter Plan */}
            <div className="bg-black text-white border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] transform md:-translate-y-4 relative">
              <div className="absolute top-0 right-0 bg-yellow-300 text-black text-xs font-black px-2 py-1 uppercase border-b-2 border-l-2 border-black">
                Popolare
              </div>
              <h3 className="text-2xl font-black uppercase mb-2 text-yellow-300">
                Senatore
              </h3>
              <div className="text-4xl font-black mb-6">
                €4.99<span className="text-xl">/mese</span>
              </div>
              <ul className="space-y-4 mb-8 font-bold text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" /> Tutto
                  incluso in Cittadino più...
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" /> 30
                  Decodifiche al MESE
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" /> Persona:
                  Solerte (Azione Chiara)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" /> Upload PDF
                  & Foto
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" /> Archivio
                  Storico
                </li>
              </ul>
              <button className="block w-full bg-white text-black text-center py-4 font-black uppercase border-2 border-black hover:bg-gray-200 transition-colors">
                Scegli Senatore (Corrompi)
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black uppercase mb-2">Imperatore</h3>
              <div className="text-4xl font-black mb-6">
                €9.99<span className="text-xl">/mese</span>
              </div>
              <ul className="space-y-4 mb-8 font-bold text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Tutto incluso in Senatore
                  più...
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Decodifiche ILLIMITATE
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Persona: Avvocato
                  (Paranoia Legale)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Upload PDF & Foto
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Archivio Storico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Priorità Assoluta
                </li>
              </ul>
              <button className="block w-full bg-black text-white text-center py-4 font-black uppercase border-2 border-black hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                Diventa Intoccabile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 text-center border-t-4 border-yellow-300">
        <p className="font-bold uppercase tracking-widest mb-4">Bur0 © 2025</p>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Non siamo avvocati. Se finisci in galera è colpa tua. Questo sito usa
          AI e potrebbe dire cazzate.
        </p>
      </footer>
    </div>
  );
}
