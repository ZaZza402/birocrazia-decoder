import type { Metadata } from "next";
import DecoderClient from "../decoder-client";

export const metadata: Metadata = {
  title: "Decoder - Decodifica Documenti Burocratici Online Gratis",
  description:
    "Decodifica istantaneamente lettere dell'Agenzia delle Entrate, multe, notifiche e documenti burocratici. AI-powered, gratis, nessuna registrazione richiesta.",
  keywords: [
    "decoder documenti",
    "decodifica burocrazia",
    "traduttore documenti burocratici",
    "OCR documenti italiani",
    "analisi documenti gratis",
  ],
  openGraph: {
    title: "BUR⓪ Decoder - Decodifica Documenti Burocratici",
    description:
      "Strumento gratuito per decodificare documenti burocratici italiani con intelligenza artificiale.",
    url: "https://www.bur0.click/decoder",
  },
  alternates: {
    canonical: "https://www.bur0.click/decoder",
  },
};

export default function DecoderPage() {
  return <DecoderClient />;
}
