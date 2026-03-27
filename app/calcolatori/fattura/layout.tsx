import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generatore Pro-Forma / Avviso di Parcella 2025 - PDF Gratuito | BurZero",
  description:
    "Crea un Avviso di Parcella (Pro-Forma) in PDF gratis. Non è una fattura elettronica: la fattura viene emessa solo a pagamento ricevuto. Forfettario, ritenuta d'acconto, marca da bollo. Nessun account.",
  keywords:
    "avviso di parcella, pro-forma freelance, generatore pro-forma pdf, fattura pro-forma partita iva, avviso parcella regime forfettario, ritenuta d'acconto 20%, marca da bollo, documento non fiscale freelance",
  alternates: {
    canonical: "/calcolatori/fattura",
  },
  openGraph: {
    title: "Generatore Pro-Forma / Avviso di Parcella | BurZero",
    description:
      "Avviso di Parcella PDF gratis. La fattura ufficiale parte solo a pagamento ricevuto.",
    url: "https://bur0.click/calcolatori/fattura",
    type: "website",
  },
};

export default function FatturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Generatore Pro-Forma / Avviso di Parcella BurZero",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Genera un Avviso di Parcella (Pro-Forma) PDF. Documento non fiscale: la fattura elettronica viene emessa solo all'atto del pagamento.",
    featureList: [
      "Pro-Forma PDF scaricabile",
      "Avviso di Parcella professionale",
      "Supporto Regime Forfettario (esenzione IVA)",
      "Ritenuta d'acconto 20%",
      "Marca da bollo automatica >€77.47",
      "Upload logo drag & drop",
      "Dati salvati in localStorage",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
