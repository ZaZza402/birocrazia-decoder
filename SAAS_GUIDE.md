# 🚀 Bureaucracy Decoder: SaaS & Technical Setup Guide

This guide outlines the steps to transform "Il Decodificatore" into a multi-tier, subscription-based SaaS with OCR capabilities.

## 1. 🏗️ Architecture Overview

To support file uploads, OCR, and subscriptions, you need to expand your stack:

- **Frontend:** Next.js (Current)
- **AI:** Vercel AI SDK + Gemini (Current)
- **Database:** PostgreSQL (via Supabase or Neon) - _To store user credits, subscription status, and history._
- **Auth:** Clerk or NextAuth - _To manage user accounts and tiers._
- **Payments:** Stripe or LemonSqueezy - _To handle subscriptions._
- **OCR:** Google Cloud Vision API or AWS Textract - _To convert PDFs/Images to text._
- **Storage:** AWS S3 or Supabase Storage - _To temporarily store uploaded files for processing._

---

## 2. 📄 OCR Implementation (The "Cost Driver")

Since LLMs need text, you must convert images/PDFs first.

### Recommended Tool: Google Cloud Vision API (Document Text Detection)

It's robust for Italian bureaucracy and handles dense layouts well.

**Workflow:**

1.  **Upload:** User uploads file to your API route.
2.  **Buffer:** Convert file to base64 or buffer.
3.  **API Call:** Send buffer to Google Cloud Vision.
4.  **Extract:** Receive full text string.
5.  **Clean:** Remove excess newlines/headers.
6.  **Inject:** Pass cleaned text to Gemini.

**Code Snippet (Conceptual):**

```typescript
// app/api/ocr/route.ts
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  // ... convert file to buffer ...

  const [result] = await client.documentTextDetection(buffer);
  const fullText = result.fullTextAnnotation.text;

  return Response.json({ text: fullText });
}
```

---

## 3. 💳 Subscription Model (SaaS)

You need to gate features based on tiers.

### Tiers Strategy

1.  **Free / Trial:**
    - Persona: "Il Commercialista Cinico" only.
    - Limit: 3 decodings/month.
    - Input: Text paste only (No OCR).
2.  **Pro (The "Solerte" Tier):**
    - Personas: Cinico + Funzionario Solerte.
    - Limit: 50 decodings/month.
    - Input: OCR enabled (Images/PDFs).
3.  **Business (The "Avvocato" Tier):**
    - Personas: All (including Avvocato Cauto).
    - Limit: Unlimited.
    - Feature: Legal risk highlighting, PDF export.

### Implementation Steps

1.  **Set up Stripe:** Create products for "Pro" and "Business".
2.  **Database Schema:**
    ```prisma
    model User {
      id             String   @id
      email          String
      subscription   String   @default("free") // free, pro, business
      credits        Int      @default(3)
      stripeCustomerId String?
    }
    ```
3.  **Middleware:** Check user tier before calling `/api/chat` or `/api/ocr`.

---

## 4. 🎭 Multi-Persona System (Implementation Plan)

We will implement this immediately in your code.

**Logic:**
The `system` prompt in `route.ts` will become a function of the user's selection.

- **Cinico:** Focus on sarcasm, insults, and "bar slang".
- **Solerte:** Focus on clarity, bullet points, and neutrality.
- **Avvocato:** Focus on legal risks, deadlines, and formal warnings.

---

## 5. 📱 Mobile & Upload UI

**Best Practices:**

- **Mobile:** Use `<input type="file" capture="environment">` to trigger the camera directly.
- **Feedback:** Show a progress bar during OCR processing (it can take 2-5 seconds).
- **Preview:** Show a thumbnail of the uploaded document.

---

## Next Steps for You

1.  **Sign up for Google Cloud Console** and enable Vision API.
2.  **Set up a Supabase project** for the database.
3.  **Register on Clerk.com** for authentication.
