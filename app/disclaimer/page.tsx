import Link from "next/link";
import { AlertTriangle, Scale, ShieldOff, FileWarning } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] font-mono p-4 md:p-8 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-red-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-black uppercase text-white">
              DISCLAIMER IMPORTANTE
            </h1>
          </div>
          <p className="text-xl font-bold text-white">
            LEGGI ATTENTAMENTE PRIMA DI USARE QUESTO SERVIZIO
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 space-y-8">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-black text-yellow-300 p-2">
                <ShieldOff className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase text-black">
                1. NON È CONSULENZA LEGALE
              </h2>
            </div>
            <div className="border-l-4 border-black pl-6 space-y-3 text-lg leading-relaxed text-black">
              <p>
                <strong>Bur0</strong> è uno strumento di{" "}
                <span className="bg-yellow-300 px-1 font-bold">
                  TRADUZIONE E SEMPLIFICAZIONE
                </span>{" "}
                del linguaggio burocratico italiano.
              </p>
              <p>
                <strong className="text-red-600">
                  NON FORNIAMO CONSULENZA LEGALE, FISCALE O PROFESSIONALE.
                </strong>
              </p>
              <p>
                Il servizio utilizza intelligenza artificiale (Google Gemini)
                per interpretare documenti burocratici e presentarli in un
                linguaggio più accessibile.
              </p>
              <p className="bg-red-100 border-2 border-red-600 p-4 font-bold">
                ⚠️ Le risposte generate sono INDICATIVE e potrebbero contenere
                imprecisioni, errori o interpretazioni non corrette.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 border-t-4 border-dashed border-gray-300 pt-8">
            <div className="flex items-center gap-3">
              <div className="bg-black text-yellow-300 p-2">
                <Scale className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase text-black">
                2. CONSULTA SEMPRE UN PROFESSIONISTA
              </h2>
            </div>
            <div className="border-l-4 border-black pl-6 space-y-3 text-lg leading-relaxed text-black">
              <p>
                Per questioni legali, fiscali o amministrative che richiedono
                una decisione ufficiale, devi SEMPRE consultare:
              </p>
              <ul className="space-y-2 list-disc list-inside font-bold">
                <li>Un avvocato qualificato</li>
                <li>Un commercialista o consulente fiscale</li>
                <li>Un consulente del lavoro</li>
                <li>
                  Un professionista abilitato nell'area specifica del tuo
                  problema
                </li>
              </ul>
              <p className="bg-yellow-100 border-2 border-yellow-600 p-4 font-bold">
                💡 Bur0 ti aiuta a CAPIRE il documento, non a SOSTITUIRE un
                esperto.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 border-t-4 border-dashed border-gray-300 pt-8">
            <div className="flex items-center gap-3">
              <div className="bg-black text-yellow-300 p-2">
                <FileWarning className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase text-black">
                3. LIMITAZIONI DEL SERVIZIO
              </h2>
            </div>
            <div className="border-l-4 border-black pl-6 space-y-3 text-lg leading-relaxed text-black">
              <p className="font-bold">Questo servizio:</p>
              <ul className="space-y-2 list-none">
                <li className="flex gap-2">
                  <span className="text-red-600 font-black">✗</span>
                  <span>
                    NON sostituisce un avvocato, commercialista o consulente
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-black">✗</span>
                  <span>NON fornisce pareri legali vincolanti</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-black">✗</span>
                  <span>
                    NON garantisce l'accuratezza al 100% delle interpretazioni
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-black">✗</span>
                  <span>NON può essere usato come prova legale</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-black">✗</span>
                  <span>
                    NON si assume responsabilità per decisioni prese sulla base
                    delle sue risposte
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4 border-t-4 border-dashed border-gray-300 pt-8">
            <div className="flex items-center gap-3">
              <div className="bg-black text-yellow-300 p-2">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase text-black">
                4. USO DEL SERVIZIO A TUO RISCHIO
              </h2>
            </div>
            <div className="border-l-4 border-black pl-6 space-y-3 text-lg leading-relaxed text-black">
              <p>Utilizzando Bur0, accetti che:</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  Sei l'unico responsabile di qualsiasi decisione presa sulla
                  base delle informazioni fornite
                </li>
                <li>
                  Verificherai sempre le informazioni con fonti ufficiali o
                  professionisti qualificati
                </li>
                <li>
                  L'AI può commettere errori, omissioni o fornire
                  interpretazioni incomplete
                </li>
                <li>
                  Bur0 e i suoi creatori non sono responsabili per danni diretti
                  o indiretti derivanti dall'uso del servizio
                </li>
              </ol>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4 border-t-4 border-dashed border-gray-300 pt-8">
            <h2 className="text-2xl font-black uppercase text-black">
              5. COSA FA EFFETTIVAMENTE BUR0?
            </h2>
            <div className="border-l-4 border-green-600 bg-green-50 pl-6 p-4 space-y-3 text-lg leading-relaxed text-black">
              <p className="font-bold text-green-900">
                ✓ Bur0 è uno strumento di COMPRENSIONE, non di DECISIONE.
              </p>
              <p>Ti aiuta a:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Capire il significato di documenti burocratici complessi
                </li>
                <li>Identificare le azioni che POTREBBERO essere necessarie</li>
                <li>
                  Valutare il livello di urgenza PRESUNTO di una comunicazione
                </li>
                <li>Prepararti meglio prima di consultare un professionista</li>
              </ul>
            </div>
          </div>

          {/* Tone Notice */}
          <div className="bg-yellow-50 border-4 border-yellow-400 p-6 space-y-3 text-black">
            <h3 className="text-xl font-black uppercase flex items-center gap-2 text-black">
              <AlertTriangle className="w-6 h-6" />
              NOTA SUL TONO DELLA RISPOSTA "CINICO"
            </h3>
            <p className="text-lg leading-relaxed">
              La persona <strong>"Il Commercialista Cinico"</strong> utilizza un
              tono <span className="font-bold">sarcastico e provocatorio</span>{" "}
              per rendere più accessibile e memorabile l'interpretazione
              burocratica.
            </p>
            <p className="text-lg leading-relaxed font-bold">
              Se questo stile ti offende, utilizza le altre personas disponibili
              (Funzionario Solerte o Avvocato Cauto) che offrono risposte
              formali e professionali.
            </p>
            <p className="text-base text-black font-medium">
              Il sarcasmo è uno strumento stilistico, non un parere sulla
              serietà della tua situazione.
            </p>
          </div>

          {/* Final Warning */}
          <div className="bg-black text-white p-8 space-y-4">
            <h3 className="text-2xl font-black uppercase text-yellow-300">
              ⚠️ RESPONSABILITÀ FINALE
            </h3>
            <p className="text-lg font-bold">
              Continuando a usare Bur0, dichiari di aver letto e compreso questo
              disclaimer e accetti di utilizzare il servizio ESCLUSIVAMENTE come
              strumento di comprensione preliminare, non come sostituto di
              consulenza professionale qualificata.
            </p>
            <p className="text-base text-white">
              Se hai dubbi sulla corretta interpretazione di un documento
              ufficiale, contatta SEMPRE un professionista abilitato.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Link
            href="/dashboard"
            className="flex-1 bg-black text-white py-4 text-xl font-black uppercase text-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] hover:bg-gray-800 transition-all"
          >
            HO CAPITO, TORNA AL DECODER
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white text-black py-4 text-xl font-black uppercase text-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-all"
          >
            TORNA ALLA HOME
          </Link>
        </div>

        {/* Last Updated */}
        <p className="text-center text-sm text-black mt-8 font-bold">
          Ultimo aggiornamento: 5 Dicembre 2025
        </p>
      </div>
    </div>
  );
}
