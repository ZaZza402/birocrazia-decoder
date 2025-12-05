import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan, PLANS } from "@/lib/plans";
import prisma from "@/lib/db";

// Allow streaming responses up to 60 seconds (OCR might take a second longer)
export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response("Devi essere loggato per usare il decoder.", {
      status: 401,
    });
  }

  // 1. Rate Limiting based on Plan
  const planType = await getUserPlan(user.id);
  const plan = PLANS[planType];
  const limit = plan.limits.monthlyDecodes;

  const cookieName = `usage_limit_${user.id}`;
  const cookieStore = await cookies();
  const usageCount = parseInt(cookieStore.get(cookieName)?.value || "0", 10);

  // Check limits (unless unlimited)
  if (limit !== Infinity && usageCount >= limit) {
    return new Response(
      `Hai raggiunto il limite di ${limit} decodifiche per il tuo piano (${plan.name}). Fai l'upgrade per continuare.`,
      { status: 429 }
    );
  }

  // 2. Parse Input (Prompt + Image for OCR)
  const {
    prompt,
    image, // Expecting Base64 string from client
    persona = "cinico",
  }: {
    prompt: string;
    image?: string;
    persona?: "cinico" | "solerte" | "avvocato";
  } = await req.json();

  // 3. Define Persona Prompts (Updated Avvocato)
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

  // 4. Construct Content for Multimodal Model
  // If an image is provided, we send it as part of the 'user' message content
  const userContent: any[] = [{ type: "text", text: prompt }];

  if (image) {
    userContent.push({
      type: "image",
      image: image, // Base64 data
    });
  }

  // 5. Call Gemini 2.5 Flash
  const result = await streamObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      la_verita: z
        .string()
        .describe(
          "La spiegazione del documento secondo il tuo personaggio (Traduzione o Sarcasmo)."
        ),
      livello_di_rischio: z
        .enum(["BASSO", "MEDIO", "ALTO"])
        .describe(
          "Valuta l'urgenza o la gravità della situazione (scadenze imminenti, multe alte)."
        ),
      cosa_devi_fare: z
        .string()
        .describe("L'azione pratica da compiere (passi concreti)."),
      nota_del_burocrate: z
        .string()
        .describe(
          "Un commento finale o disclaimer coerente con il personaggio."
        ),
    }),
    system: `${selectedSystemPrompt}

    REGOLE DI TRADUZIONE FONDAMENTALI (OBBLIGATORIE PER OGNI PERSONA):
    1. LEGGI L'IMMAGINE O IL TESTO FORNITO CON ATTENZIONE.
    2. DIVIETO ASSOLUTO DI BUROCRATESE: È severamente vietato utilizzare tecnicismi senza spiegarli.
    3. LINGUAGGIO DIRETTO: Sostituisci termini come 'obbligato in solido' con 'devi pagare anche tu se l'altro non paga'.
    4. SCOPO: Il tuo unico obiettivo è rendere il testo immediatamente chiaro per un cittadino medio.

    TUTTA la tua risposta (inclusi tutti i campi JSON) DEVE essere rigorosamente in **LINGUA ITALIANA**.

    REGOLE DI LUNGHEZZA:
    - **Sii BREVE e CONCISO.**
    - **'la_verita':** Massimo 2-3 frasi chiare.
    - **'cosa_devi_fare':** Istruzioni azionabili.
    - **'nota_del_burocrate':** Massimo 1 frase.

    Output: Risposta in formato JSON.`,
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
    onFinish: async ({ object }) => {
      if (!object) return;

      try {
        // Ensure user exists in DB
        await prisma.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            email:
              user.emailAddresses[0]?.emailAddress || "no-email@example.com",
          },
          update: {
            email:
              user.emailAddresses[0]?.emailAddress || "no-email@example.com",
          },
        });

        // Save history
        await prisma.decodeHistory.create({
          data: {
            userId: user.id,
            prompt: prompt.substring(0, 5000),
            image: image, // Save base64 image
            persona: persona,
            response: object,
          },
        });
      } catch (error) {
        console.error("Failed to save history:", error);
      }
    },
  });

  // 6. Handle Cookies & Response
  const response = result.toTextStreamResponse();

  // Update cookie usage count if not unlimited
  if (limit !== Infinity) {
    response.headers.set(
      "Set-Cookie",
      `${cookieName}=${
        usageCount + 1
      }; Path=/; Max-Age=2592000; SameSite=Strict` // Increased Max-Age to 30 days
    );
  }

  return response;
}
