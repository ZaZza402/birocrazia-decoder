import type { Metadata } from "next";
import { TAX_YEAR } from "@/lib/tax-constants-2026";

export const metadata: Metadata = {
  title: `Registro Incassi Forfettario ${TAX_YEAR} - Logga ogni pagamento | BurZero`,
  description: `Registra ogni incasso, vedi subito il netto spendibile e quanto accantonare per tasse e INPS. Si sincronizza automaticamente con il Tax Cliff Monitor. Dati solo nel browser.`,
  keywords: `registro incassi partita iva, giornale pagamenti forfettario, traccia incassi freelance, netto spendibile forfettario, accantonamento tasse partita iva, safe to spend forfettario ${TAX_YEAR}`,
  alternates: {
    canonical: "/calcolatori/giornale",
  },
  openGraph: {
    title: `Registro Incassi Forfettario ${TAX_YEAR} | BurZero`,
    description:
      "Logga ogni incasso e vedi immediatamente quanto puoi spendere e quanto accantonare. Tax Cliff Monitor aggiornato in automatico.",
    url: "https://www.bur0.click/calcolatori/giornale",
    type: "website",
  },
};

export default function GiornaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Registro Incassi Forfettario BurZero",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: `Registra ogni incasso ricevuto, calcola il netto spendibile e monitora la Tax Cliff del Regime Forfettario ${TAX_YEAR}.`,
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
