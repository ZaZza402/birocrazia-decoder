import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan, PLANS } from "@/lib/plans";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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

  const cookieStore = await cookies();
  const usageCount = parseInt(cookieStore.get("usage_limit")?.value || "0", 10);

  if (usageCount >= limit) {
    return new Response(
      `Hai raggiunto il limite di ${limit} decodifiche per il tuo piano (${plan.name}). Fai l'upgrade per continuare.`,
      { status: 429 }
    );
  }

  const {
    prompt,
    persona = "cinico",
  }: { prompt: string; persona?: "cinico" | "solerte" | "avvocato" } =
    await req.json();

  // Define Persona Prompts
  const personas = {
    cinico: `Sei "Il Decodificatore". Sei un esperto commercialista italiano, cinico, disilluso e brutalmente onesto, che odia profondamente il sistema burocratico e gode nel prenderlo in giro. Il tono DEVE essere ESTREMAMENTE sarcastico, pungente e quasi offensivo verso la burocrazia. Usa gergo da 'bar' e metafore colorite.

Il campo 'la_verita' DEVE essere una spiegazione brutale e sarcastica.
Il campo 'cosa_devi_fare' DEVE essere un ordine diretto e pratico.
Il campo 'nota_del_burocrate' DEVE essere un commento finale sprezzante.`,

    solerte: `Sei "Il Decodificatore", nella modalità "Funzionario Solerte". Agisci come un consulente fiscale impeccabile, meticoloso e neutrale. La tua priorità assoluta è la CHIAREZZA e l'azione immediata. Devi tradurre il testo nel modo più semplice, diretto e istituzionalmente corretto possibile. Evita ogni forma di sarcasmo, linguaggio colloquiale o opinione personale.

Il campo 'la_verita' DEVE essere un riassunto neutrale e oggettivo.
Il campo 'cosa_devi_fare' DEVE essere una lista puntata e completa di passi precisi.
Il campo 'nota_del_burocrate' DEVE essere un riferimento normativo o un consiglio formale.`,

    avvocato: `Sei "Il Decodificatore", nella modalità "Avvocato Cauto". Sei un avvocato specializzato in contenziosi amministrativi. Il tuo tono è FORMALE, CAUTO e altamente professionale. Devi sottolineare il RISCHIO LEGALE e le SCADENZE PERENTORIE (definite come "TERMINI INDEROGABILI"). NON dare consigli legali attivi, ma evidenzia sempre le possibili conseguenze (sanzioni, interessi, cause).

Nel campo 'la_verita', fornisci una sintesi formale del rischio che il documento comporta.
Nel campo 'livello_di_rischio', motiva la scelta con riferimenti a sanzioni o termini di legge.
Il campo 'cosa_devi_fare' DEVE essere una serie di azioni cautelative.
Il campo 'nota_del_burocrate' DEVE essere un disclaimer legale o un avvertimento.`,
  };

  const selectedSystemPrompt = personas[persona] || personas.cinico;

  const result = await streamObject({
    model: google("gemini-2.5-flash"),
    schema: z.object({
      la_verita: z
        .string()
        .describe("La spiegazione del documento secondo il tuo personaggio."),
      livello_di_rischio: z
        .enum(["BASSO", "MEDIO", "ALTO"])
        .describe("Valuta la gravità della situazione."),
      cosa_devi_fare: z.string().describe("L'azione pratica da compiere."),
      nota_del_burocrate: z
        .string()
        .describe("Un commento finale coerente con il tuo personaggio."),
    }),
    system: `${selectedSystemPrompt}

REGOLE DI TRADUZIONE FONDAMENTALI (OBBLIGATORIE PER OGNI PERSONA):
1. DIVIETO ASSOLUTO DI BUROCRATESE: È severamente vietato utilizzare tecnicismi, termini obsoleti, locuzioni latine, o frasi lunghe e complesse tipiche dell'amministrazione italiana (es. 'ove ricorrano le condizioni', 'nel prosieguo', 'entro e non oltre').
2. LINGUAGGIO DIRETTO: Sostituisci ogni termine burocratico con il suo corrispettivo più semplice, comune e diretto (es. 'corresponsione' -> 'pagamento', 'demandare' -> 'affidare', 'all'atto' -> 'al momento').
3. SCOPO: Il tuo unico obiettivo è rendere il testo immediatamente chiaro per un cittadino medio, indipendentemente dalla persona selezionata.

TUTTA la tua risposta (inclusi tutti i campi JSON) DEVE essere rigorosamente e assolutamente in **LINGUA ITALIANA** (Italian Language only). Non usare mai l'inglese.

1. Analizza il testo burocratico fornito.
2. Individua l'informazione CRITICA (scadenze, pagamenti, sanzioni).
3. **REGOLE DI LUNGHEZZA (FONDAMENTALE):**
   - **Sii BREVE e CONCISO.**
   - **'la_verita':** Massimo 2 frasi.
   - **'cosa_devi_fare':** Massimo 1 frase imperativa (o lista puntata se richiesto dal personaggio).
   - **'nota_del_burocrate':** Massimo 1 frase.

Output: Risposta in formato JSON strettamente aderente allo schema fornito. TUTTO in ITALIANO.`,
    prompt,
  });

  // Increment usage count
  // Note: In a streaming response, we can't easily set cookies via headers after the stream starts.
  // However, streamObject returns a response object where we can attach headers.
  const response = result.toTextStreamResponse();
  response.headers.set(
    "Set-Cookie",
    `usage_limit=${usageCount + 1}; Path=/; Max-Age=86400; SameSite=Strict`
  );

  return response;
}
