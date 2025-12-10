import { Metadata } from "next";
import RicevutaPageClient from "./RicevutaPageClient";

export const metadata: Metadata = {
  title: "Generatore Ricevute Prestazione Occasionale 2025 | Bur0",
  description:
    "Crea ricevute perfette per prestazioni occasionali. Calcolo automatico ritenuta 20%, alert marca da bollo, monitoraggio limite €5.000. PDF professionale in 3 click.",
  keywords:
    "ricevuta prestazione occasionale, calcolo ritenuta d'acconto, marca da bollo ricevuta, limite 5000 euro prestazioni, generatore ricevute pdf, ricevuta professionale, prestazione occasionale 2025, calcolo netto lordo prestazione, ritenuta 20%, ricevuta fiscale",
  openGraph: {
    title: "Generatore Ricevute Prestazione Occasionale | Bur0",
    description:
      "Smetti di usare template Word rotti. Crea ricevute fiscalmente perfette con calcolo automatico della ritenuta e monitoraggio dei limiti.",
    url: "https://bur0.click/calcolatori/ricevuta",
    type: "website",
  },
};

export default function RicevutaPage() {
  return <RicevutaPageClient />;
}
