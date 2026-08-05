# Project Structure

## Root

- .eslintrc.config.mjs
- eslint.config.mjs
- global.d.ts
- LandingPage.css
- LandingPage.tsx
- middleware.ts
- next-env.d.ts
- next.config.js
- package.json
- postcss.config.js
- tailwind.config.ts
- tsconfig.json
- calcolo-piva-example.md
- raw-ateco.md

## app/

- globals.css
- layout.tsx
- not-found.tsx
- page.tsx
- robots.ts
- api/
  - notify-ricevuta/
    - route.ts
  - submit-email/
    - route.ts
- calcolatori/
  - acconto/
    - layout.tsx
    - page.tsx
  - ateco/
    - layout.tsx
    - page.tsx
  - cliff/
    - layout.tsx
    - page.tsx
  - fattura/
    - layout.tsx
    - page.tsx
  - forfettario/
    - layout.tsx
    - page.tsx
    - [scenario]/
      - page.tsx
  - ricevuta/
    - page.tsx
    - RicevutaPageClient.tsx
- embed/
  - layout.tsx
  - page.tsx
  - branded/
    - layout.tsx
    - page.tsx
  - docs/
    - page.tsx
  - white-label/
    - layout.tsx
    - page.tsx
- privacy/
  - page.tsx
- sitemap_index.xml/
  - route.ts
- sitemap.xml/
  - route.ts
- termini/
  - page.tsx

## components/

- AccontoCalculator.tsx
- AtecoCombobox.tsx
- AtecoFinder.tsx
- CliffTracker.tsx
- CookieBanner.tsx
- FatturaDocument.tsx
- FatturaGenerator.tsx
- Footer.tsx
- ForfettarioCalculator.tsx
- ForfettarioChart.tsx
- ForfettarioReport.tsx
- InfoTooltip.tsx
- InstallAppButton.tsx
- LandingPage.tsx
- LoadingScreen.tsx
- MobileJourneyDrawer.tsx
- Navigation.tsx
- PageTransition.tsx

## hooks/

- usePWAInstall.ts

## lib/

- acconto-utils.ts
- ateco-data.ts
- ateco-rules-2026.ts
- forfettario-utils.ts
- scenarios.ts
- tax-constants-2026.ts
- tools/
  - README.md
  - ateco/
    - curated-jobs.ts
    - index.ts
    - search.ts
  - forfettario/
    - index.ts
  - shared/
    - index.ts
    - tool-manifest.ts

## public/

- site.webmanifest
- sw.js
- images/
