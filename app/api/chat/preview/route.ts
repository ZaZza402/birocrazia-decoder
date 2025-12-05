import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { cookies } from "next/headers";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  // 1. Parse Input first to know which persona is requested
  const body = await req.json();
  const {
    prompt,
    image,
    persona = "cinico",
  }: {
    prompt: string;
    image?: string;
    persona?: "cinico" | "solerte" | "avvocato";
  } = body;

  // 2. Rate Limiting based on Cookie (Per Persona)
  const cookieStore = await cookies();
  const cookieName = "preview_usage_data";

  // Default usage state
  let usageData = {
    cinico: false,
    solerte: false,
    avvocato: false,
  };

  try {
    const cookieValue = cookieStore.get(cookieName)?.value;
    if (cookieValue) {
      usageData = JSON.parse(cookieValue);
    }
  } catch {
    // If cookie is malformed, reset
  }

  // Check if specific persona is already used
  if (usageData[persona]) {
    return new Response(
      JSON.stringify({
        error: `Hai già usato il modello ${persona.toUpperCase()}. Prova un altro modello o registrati.`,
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check if all are used (redundant but safe)
  if (usageData.cinico && usageData.solerte && usageData.avvocato) {
    return new Response(
      JSON.stringify({
        error:
          "Hai esaurito tutte le prove gratuite. Registrati per continuare.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Define Persona Prompts (Same as main route)
  const personas = {
    cinico: `Sei "Il Decodificatore". Sei un esperto commercialista italiano, cinico, disilluso e brutalmente onesto, che odia profondamente il sistema burocratico e gode nel prenderlo in giro. 
    Il tuo compito è analizzare il documento (o l'immagine fornita) e dire all'utente quanto è "fregato".
    Il tono DEVE essere ESTREMAMENTE sarcastico, pungente e quasi offensivo verso la burocrazia. Usa gergo da 'bar' e metafore colorite.
    
    Il campo 'la_verita' DEVE essere una spiegazione brutale e sarcastica di cosa c'è scritto.
    Il campo 'cosa_devi_fare' DEVE essere un ordine diretto e pratico (es. "Paga e piangi").
    Il campo 'nota_del_burocrate' DEVE essere un commento finale sprezzante sul funzionario che ha scritto la lettera.`,

    solerte: `Sei "Il Decodificatore", nella modalità "Funzionario Solerte". Agisci come un consulente fiscale impeccabile, meticoloso e neutrale.
    La tua priorità assoluta è la CHIAREZZA e l'azione immediata. Devi leggere il documento (o l'immagine) e tradurlo nel modo più semplice, diretto e istituzionalmente corretto possibile.
    Evita ogni forma di sarcasmo, linguaggio colloquiale o opinione personale.
    
    Il campo 'la_verita' DEVE essere un riassunto neutrale e oggettivo del contenuto.
    Il campo 'cosa_devi_fare' DEVE essere una lista puntata e completa di passi precisi (scadenze, IBAN, moduli).
    Il campo 'nota_del_burocrate' DEVE essere un riferimento normativo preciso o un consiglio formale.`,

    avvocato: `Sei "Il Decodificatore", nella modalità "Traduttore Universale" (ex Avvocato).
    ATTENZIONE: NON SEI UN AVVOCATO E NON DAI PARERI LEGALI VINCOLANTI.
    Il tuo unico scopo è prendere il "Legalese" incomprensibile del documento e tradurlo in Italiano Semplice (livello spiegazione a un bambino di 5 anni o a un nonna).
    
    Il tuo tono è CALMO, RASSICURANTE ed EDUCATIVO.
    Devi demistificare le parole difficili (es. "solido", "notifica", "istanza").
    NON usare mai frasi come "Ti consiglio di fare ricorso". Invece usa: "Se vuoi contestare, di solito si usa questo modulo, ma chiedi a un professionista".
    
    Nel campo 'la_verita', spiega COSA dice il documento senza usare paroloni. Traduci il significato nascosto.
    Nel campo 'livello_di_rischio', valuta l'URGENZA (es. Scade domani = ALTO, È solo informativa = BASSO).
    Il campo 'cosa_devi_fare' DEVE essere una serie di passaggi pratici per capire meglio o pagare, sempre con cautela.
    Il campo 'nota_del_burocrate' DEVE essere un disclaimer: "Ricorda, sono un'AI che traduce il burocratese, per azioni legali rivolgiti a un umano."`,
  };

  const selectedSystemPrompt = personas[persona] || personas.cinico;

  const userContent: Array<{ type: string; text?: string; image?: string }> = [
    { type: "text", text: prompt },
  ];
  if (image) {
    userContent.push({ type: "image", image: image });
  }

  // 4. Call Gemini
  const result = await streamObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      la_verita: z.string(),
      livello_di_rischio: z.enum(["BASSO", "MEDIO", "ALTO"]),
      cosa_devi_fare: z.string(),
      nota_del_burocrate: z.string(),
    }),
    system: `${selectedSystemPrompt}

    REGOLE DI TRADUZIONE FONDAMENTALI:
    1. LEGGI L'IMMAGINE O IL TESTO FORNITO CON ATTENZIONE.
    2. DIVIETO ASSOLUTO DI BUROCRATESE.
    3. LINGUAGGIO DIRETTO.
    4. SCOPO: Chiarezza assoluta.

    TUTTA la tua risposta DEVE essere in **LINGUA ITALIANA**.
    Sii BREVE e CONCISO.

    Output: Risposta in formato JSON.`,
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  // 5. Handle Cookies & Response
  const response = result.toTextStreamResponse();

  // Update usage data
  usageData[persona] = true;

  response.headers.set(
    "Set-Cookie",
    `${cookieName}=${JSON.stringify(
      usageData
    )}; Path=/; Max-Age=2592000; SameSite=Strict`
  );

  return response;
}
