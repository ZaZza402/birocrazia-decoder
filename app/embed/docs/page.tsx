export default function EmbedDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Embed del Calcolatore Forfettario</h1>
      
      <div className="space-y-8">
        {/* White Label Version */}
        <section className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">White Label (Senza Brand)</h2>
          <p className="text-gray-700 mb-4">
            Versione completamente priva di branding Bur0 - ideale per commercialisti che vogliono
            integrare il calcolatore nel proprio sito mantenendo la propria identità visiva.
          </p>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-600">Codice Embed:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`<iframe
  src="https://bur0.click/embed/white-label"
  width="100%"
  height="1200"
  frameborder="0"
  scrolling="yes"
  style="border: none; border-radius: 8px;"
  title="Calcolatore Forfettario"
></iframe>`}
            </pre>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              <strong>Raccomandazioni:</strong> Altezza consigliata 1200px. Adatta secondo il tuo layout.
            </p>
          </div>
        </section>

        {/* Branded Version */}
        <section className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">Versione con Brand Bur0</h2>
          <p className="text-gray-700 mb-4">
            Include footer con logo e link "Powered by Bur0" - gratuita per uso illimitato.
            Ottima per blog, community e risorse gratuite.
          </p>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h3 className="font-semibold mb-2 text-sm text-gray-600">Codice Embed:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`<iframe
  src="https://bur0.click/embed/branded"
  width="100%"
  height="1250"
  frameborder="0"
  scrolling="yes"
  style="border: none; border-radius: 8px;"
  title="Calcolatore Forfettario by Bur0"
></iframe>`}
            </pre>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <p className="text-sm text-purple-800">
              <strong>Nota:</strong> Altezza leggermente maggiore (1250px) per includere il footer di branding.
            </p>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
          <h2 className="text-2xl font-bold mb-4">Linee Guida</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Responsive:</strong> Usa <code className="bg-white px-2 py-1 rounded">width="100%"</code> 
                per adattamento automatico ai dispositivi mobili
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Performance:</strong> Il calcolatore è ottimizzato e carica in meno di 1.5 secondi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Privacy:</strong> Nessun dato utente viene raccolto o inviato a server esterni
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">ℹ</span>
              <span>
                <strong>White Label:</strong> Per accesso contattare <a href="mailto:info@bur0.click" className="text-indigo-600 underline">info@bur0.click</a>
              </span>
            </li>
          </ul>
        </section>

        {/* Live Preview */}
        <section className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Anteprima Live</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-purple-600">Versione Branded</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: "400px" }}>
                <iframe
                  src="/embed/branded"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Preview Branded"
                ></iframe>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-indigo-600">Versione White Label</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: "400px" }}>
                <iframe
                  src="/embed/white-label"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Preview White Label"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
