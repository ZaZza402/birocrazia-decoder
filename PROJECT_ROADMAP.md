# 🗺️ PROJECT ROADMAP: Il Decodificatore

> "La burocrazia è l'arte di rendere l'impossibile possibile, ma solo in triplice copia."

Questo documento serve come guida per lo sviluppo, il mantenimento e l'espansione de "Il Decodificatore".

## 🏗️ Tech Stack Attuale

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Neo-Brutalism Design System)
- **AI**: Vercel AI SDK + Google Gemini 1.5 Flash
- **Auth**: Clerk (`@clerk/nextjs`)
- **PWA**: Native Next.js Metadata Route (`manifest.ts`)
- **Icons**: Lucide React

## 🚀 Setup & Installazione

### 1. Variabili d'Ambiente (.env.local)

Per far funzionare tutto, hai bisogno di queste chiavi:

```bash
# AI (Google AI Studio)
GOOGLE_GENERATIVE_AI_API_KEY="tua_chiave_gemini"

# Auth (Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 2. Comandi Utili

```bash
# Installazione dipendenze
npm install

# Avvio server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## 📱 PWA (Progressive Web App)

L'app è configurata per essere installabile su mobile.

- **Manifest**: `app/manifest.ts` gestisce nome, colori e icone.
- **Icone**: Assicurati di avere `icon.png` (512x512) in `/public` per l'icona dell'app.

## 🔐 Autenticazione (Clerk)

- **Middleware**: `middleware.ts` protegge le route (attualmente configurato per permettere l'accesso pubblico alla home, ma proteggere il resto se necessario).
- **Dashboard**: `app/dashboard/page.tsx` è un esempio di pagina protetta (Server Component) che legge i dati dell'utente.
- **Layout**: `app/layout.tsx` avvolge l'app nel `<ClerkProvider>`.

## 🔮 Prossimi Passi (Future Features)

### Fase 1: Monetizzazione (Il vero obiettivo)

- [ ] **Stripe Integration**: Aggiungere pagamenti per "crediti di decodifica".
- [ ] **Piani Premium**: "Cittadino Modello" (Illimitato) vs "Plebeo" (3 richieste/giorno).

### Fase 2: Persistenza Dati

- [ ] **Database (Postgres/Prisma)**: Salvare la cronologia delle decodifiche degli utenti.
- [ ] **Salvataggio Documenti**: Permettere l'upload di PDF reali (OCR) invece del solo testo.

### Fase 3: Espansione AI

- [ ] **Fine-tuning**: Addestrare un modello specifico sul "Burocratese" italiano.
- [ ] **Voice Mode**: Insultare la burocrazia a voce e ricevere risposte audio.

## 🛠️ Manutenzione

- Aggiornare regolarmente `@clerk/nextjs` e `ai` sdk.
- Controllare i limiti di rate-limit di Gemini (attualmente Free Tier).

---

_Documento generato da GitHub Copilot - Agente "Il Cinico"_
