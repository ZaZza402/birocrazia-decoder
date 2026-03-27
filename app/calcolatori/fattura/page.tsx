import FatturaGenerator from "@/components/FatturaGenerator";

export default function FatturaPage() {
  return (
    <>
      <FatturaGenerator />
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              Pro-Forma e Avviso di Parcella: non sono fatture fiscali
            </h2>
            <p className="text-stone-600 leading-relaxed">
              In Italia, la <strong>fattura elettronica</strong> deve essere
              emessa tramite il Sistema di Interscambio (SDI) dell&#8217;Agenzia
              delle Entrate e fa scattare immediatamente gli obblighi fiscali
              (IVA se dovuta, registrazione, liquidazione). Un{" "}
              <strong>Avviso di Parcella</strong> o <strong>Pro-Forma</strong> è
              invece un documento non fiscale: serve a comunicare al cliente
              l&#8217;importo da pagare, ma non costituisce fattura ai sensi del
              D.P.R. 633/72. La fattura vera viene emessa{" "}
              <em>solo dopo aver ricevuto il pagamento</em>.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Quando usare un Pro-Forma invece di una fattura
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Il pro-forma è lo strumento ideale per i freelance e i
              professionisti che lavorano in regime forfettario o come privati e
              vogliono richiedere il pagamento prima di emettere la fattura
              ufficiale. È particolarmente utile quando si lavora con nuovi
              clienti, per anticipi su progetti lunghi, o per accordarsi sulle
              modalità di pagamento prima di impegnarsi fiscalmente.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Regime Forfettario: nessun obbligo di IVA né ritenuta
            </h3>
            <p className="text-stone-600 leading-relaxed">
              I contribuenti forfettari sono esenti dall&#8217;applicazione
              dell&#8217;IVA (art. 1 c. 58 L. 190/2014) e non sono soggetti a
              ritenuta d&#8217;acconto. Sulla fattura (o sul pro-forma) devono
              indicare la dicitura &#8220;Operazione effettuata ai sensi
              dell&#8217;art. 1, commi 54-89, L. 190/2014 - Regime
              Forfettario&#8221;. In questo strumento la dicitura viene aggiunta
              automaticamente quando attivi il toggle Forfettario.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
