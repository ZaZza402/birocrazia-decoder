import GiornaleCalcolatore from "@/components/GiornaleCalcolatore";
import { TAX_YEAR, FORFETTARIO_EXIT_CLIFF } from "@/lib/tax-constants-2026";

export default function GiornalePage() {
  return (
    <>
      <GiornaleCalcolatore />
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-4">
              Perché registrare ogni incasso separatamente?
            </h2>
            <p className="text-stone-600 leading-relaxed">
              I simulatori fiscali tradizionali ti chiedono il fatturato annuo
              previsto - un numero che di solito non conosci in anticipo. Il
              Registro Incassi ribalta il processo: inserisci ogni pagamento
              appena lo ricevi e il calcolo cresce con te durante l&apos;anno.
              Non servono proiezioni, non servono stime: vedi il reale, in tempo
              reale.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Come funziona il calcolo &quot;netto spendibile&quot;
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Per ogni incasso, il registro stima la quota da accantonare
              sommando imposta sostitutiva e contributi INPS, applicati al
              coefficiente di redditività del tuo codice ATECO. Il risultato non
              è il tuo netto fiscale definitivo - per quello usa il Simulatore
              Forfettario con il totale annuo - ma è una guida pratica e
              immediata per non ritrovarti a corto di liquidità a giugno o
              novembre.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Sincronizzazione con il Tax Cliff Monitor
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Ogni incasso registrato aggiorna automaticamente il totale mensile
              nel Tax Cliff Monitor. Non devi inserire i numeri due volte. Se
              sei vicino alla soglia di €
              {FORFETTARIO_EXIT_CLIFF.toLocaleString("it-IT")}, il monitor ti
              avviserà in tempo reale. I dati restano solo nel tuo browser:
              nessun account, nessun server.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Mesi precedenti sempre accessibili
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Il mese corrente è sempre aperto e pronto per nuovi incassi. I
              mesi passati rimangono visibili e modificabili in qualsiasi
              momento - se hai dimenticato un incasso di luglio, puoi
              aggiungerlo ad agosto senza perdere nulla. Il registro non blocca
              mai i dati storici.
            </p>
          </div>

          <div>
            <h3 className="text-base font-black text-stone-900 mb-2">
              Profilo fiscale: configuralo una volta sola
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Codice ATECO, tipo di gestione previdenziale (Gestione Separata,
              Artigiani, Commercianti) e aliquota (5% startup o 15% ordinario)
              si impostano una volta e vengono ricordati automaticamente. Il
              cassetto del profilo resta collassato per non intralciare
              l&apos;uso quotidiano, ma è sempre raggiungibile con un tap.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
