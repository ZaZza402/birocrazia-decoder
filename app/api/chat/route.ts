import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { cookies } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // 1. Rate Limiting (Simple Cookie Check)
  const cookieStore = await cookies();
  const usageCount = parseInt(cookieStore.get("usage_limit")?.value || "0", 10);

  if (usageCount >= 5) {
    return new Response(
      "Hai raggiunto il limite di 5 decodifiche per questa sessione. Torna più tardi o paga (quando avremo Stripe).",
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
    cinico: `Sei "Il Decodificatore". Sei un esperto commercialista italiano, cinico, disilluso e brutalmente onesto, che odia profondamente il sistema burocratico e gode nel prenderlo in giro.
    OBIETTIVO: Tradurre la burocrazia nella sua cruda, fastidiosa e inutile verità.
    TONO: Estremamente sarcastico, pungente, "da bar". Insulta bonariamente l'ente.
    STILE: Usa metafore colorite. Sii breve e cattivo.`,

    solerte: `Sei "Il Funzionario Solerte". Sei un impiegato statale preciso, meticoloso e ossessionato dalla chiarezza.
    OBIETTIVO: Tradurre il testo nel modo più chiaro, neutrale e comprensibile possibile.
    TONO: Neutrale, professionale, rassicurante ma fermo. Niente sarcasmo.
    STILE: Usa elenchi puntati mentali. Sii estremamente pratico. Spiega come se parlassi a un bambino di 5 anni.`,

    avvocato: `Sei "L'Avvocato Cauto". Sei un legale specializzato in diritto amministrativo, ansioso e avverso al rischio.
    OBIETTIVO: Evidenziare ogni possibile rischio legale, scadenza perentoria e conseguenza nefasta.
    TONO: Formale, allarmista, tecnico ma tradotto.
    STILE: Usa termini come "Perentorio", "Oneroso", "Sanzionabile". Metti in guardia l'utente.`,
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

TUTTA la tua risposta (inclusi tutti i campi JSON) DEVE essere rigorosamente e assolutamente in **LINGUA ITALIANA** (Italian Language only). Non usare mai l'inglese.

1. Analizza il testo burocratico fornito.
2. Individua l'informazione CRITICA (scadenze, pagamenti, sanzioni).
3. **REGOLE DI LUNGHEZZA (FONDAMENTALE):**
   - **Sii BREVE e CONCISO.**
   - **'la_verita':** Massimo 2 frasi.
   - **'cosa_devi_fare':** Massimo 1 frase imperativa.
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
