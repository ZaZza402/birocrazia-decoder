import Link from "next/link";
import {
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle,
  AlertTriangle,
  Heart,
} from "lucide-react";
import Footer from "./components/footer";

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
          <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            <span className="inline-block bg-yellow-400 text-black font-black px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 uppercase tracking-wider">
              BUR0
            </span>{" "}
            traduce il legalese in italiano brutale. Incolla il testo di quella
            lettera dell'Agenzia delle Entrate e scopri se devi scappare in
            Messico.
          </p>
          <div className="bg-red-500 text-white border-4 border-black p-4 max-w-2xl mx-auto mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-sm md:text-base">
              ⚠️ <strong>NON È CONSULENZA LEGALE</strong> • Questo strumento
              traduce documenti burocratici, non sostituisce avvocati o
              commercialisti.
            </p>
          </div>
          <div className="flex justify-center items-center mb-16">
            <Link
              href="/decoder"
              className="bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-800 transition-all shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] hover:translate-y-1 hover:shadow-none border-2 border-black flex items-center gap-2"
            >
              Inizia Gratis <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-red-300 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
      </header>

      {/* Why Section */}
      <section className="py-20 bg-yellow-300 border-y-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-black text-white px-4 py-2 font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Heart className="w-6 h-6 inline-block mr-2" />
              Perché Esiste
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black">
              Nato dalla Frustrazione
            </h2>
          </div>
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg md:text-xl font-medium text-black leading-relaxed mb-6">
              Questo progetto è nato perché <strong>siamo stanchi</strong>.
              Stanchi di lettere incomprensibili, di dover pagare un
              professionista per capire se quella raccomandata è una multa da
              €50 o una minaccia legale seria.
            </p>
            <p className="text-lg md:text-xl font-medium text-black leading-relaxed mb-6">
              La burocrazia italiana è un{" "}
              <strong className="bg-yellow-400 px-2 py-1 border-2 border-black">
                linguaggio fatto apposta per non essere capito
              </strong>
              . BUR0 lo traduce in parole semplici, così puoi decidere se
              preoccuparti o buttare tutto nel cestino.
            </p>
            <p className="text-lg md:text-xl font-black text-black uppercase tracking-wide border-l-4 border-black pl-4">
              Non è perfetto. Non sostituisce un avvocato. Ma ti dà una prima
              risposta, subito, gratis.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase text-black">
              Istantaneo
            </h3>
            <p className="text-lg font-medium text-gray-700">
              Non aspettare il commercialista. Ottieni risposte in 3 secondi
              netti. Senza appuntamento.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase text-black">
              Analisi Rischi
            </h3>
            <p className="text-lg font-medium text-gray-700">
              Ti diciamo subito se è una multa, una truffa o solo carta
              straccia. Senza giri di parole.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase text-black">
              Azioni Chiare
            </h3>
            <p className="text-lg font-medium text-gray-700">
              "Paga entro domani" o "Butta nel cestino". Istruzioni a prova di
              idiota.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Warning Section */}
      <section className="py-16 bg-orange-100 border-y-4 border-orange-600">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border-4 border-orange-600 shadow-[8px_8px_0px_0px_rgba(234,88,12,1)]">
            <div className="bg-orange-600 text-white px-6 py-4 border-b-4 border-orange-600 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                Stato: Prototipo Demo
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
                Questo è un{" "}
                <span className="bg-orange-200 px-2 py-1 border-2 border-orange-600 font-black">
                  ESPERIMENTO
                </span>
                . Lo stiamo testando per capire se serve davvero.
              </p>
              <div className="bg-orange-50 border-2 border-orange-600 p-6 space-y-4">
                <p className="text-base md:text-lg font-medium text-black">
                  <strong className="font-black text-orange-600">
                    ⚠️ Potresti incontrare limiti:
                  </strong>
                  <br />
                  L'AI costa. Se troppe persone lo usano contemporaneamente,
                  potremmo dover introdurre rate limit o chiudere
                  temporaneamente l'accesso.
                </p>
                <p className="text-base md:text-lg font-medium text-black">
                  <strong className="font-black text-orange-600">
                    💰 Potrebbe NON restare gratis:
                  </strong>
                  <br />
                  Se i costi diventano insostenibili, dovremo valutare un
                  modello a pagamento o donazioni per mantenerlo attivo.
                </p>
                <p className="text-base md:text-lg font-medium text-black">
                  <strong className="font-black text-orange-600">
                    🚧 È in costruzione:
                  </strong>
                  <br />
                  Potrebbero esserci bug, errori nell'analisi o tempi di
                  inattività.
                  <span className="font-black">
                    NON fare affidamento assoluto
                  </span>{" "}
                  su questo strumento per decisioni critiche.
                </p>
              </div>
              <p className="text-lg font-black text-black uppercase text-center pt-4 border-t-2 border-orange-600">
                Usalo adesso finché è gratis. Poi si vedrà.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
