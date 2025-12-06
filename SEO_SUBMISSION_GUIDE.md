# BUR⓪ - SEO Submission Guide

## 🎯 Google Search Console Setup

### 1. Verify Ownership

**Method 1: HTML Tag (Recommended)**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://www.bur0.click`
3. Choose "HTML tag" verification method
4. Copy your verification meta tag
5. Add to `app/layout.tsx` in the `verification` object:

```typescript
verification: {
  google: "your-verification-code-here",
}
```

**Method 2: Domain Verification**

1. Add TXT record to your DNS (Vercel/domain registrar)
2. Value: `google-site-verification=XXXXXXXXXXX`

### 2. Submit Sitemap

After verification:

1. Go to "Sitemaps" in left menu
2. Add new sitemap: `https://www.bur0.click/sitemap.xml`
3. Submit
4. Wait 24-48 hours for indexing

Your sitemap is automatically generated and includes:

- `/` (Priority: 1.0)
- `/decoder` (Priority: 0.9)
- `/disclaimer` (Priority: 0.5)

### 3. Request Indexing

**For Homepage:**

1. Go to "URL Inspection" tool
2. Enter: `https://www.bur0.click`
3. Click "Request Indexing"
4. Repeat for `/decoder`

**Typical Timeline:**

- Mobile indexing: 1-3 days
- Desktop indexing: 3-7 days
- Full ranking: 2-4 weeks

---

## 🔍 Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site: `https://www.bur0.click`
3. Verify via:
   - Import from Google Search Console (easiest), OR
   - Add XML file to `/public/` (they'll provide), OR
   - Add meta tag to `<head>`
4. Submit sitemap: `https://www.bur0.click/sitemap.xml`

---

## 📊 Structured Data Validation

### Test Your Schema.org Markup

1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Enter URL: `https://www.bur0.click`
3. Verify WebApplication schema is detected

**Current Schema (Already Implemented):**

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "BUR⓪ - Il Decodificatore di Burocrazia",
  "applicationCategory": "UtilityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  }
}
```

---

## 🌐 Social Media Meta Tags

### Facebook Debugger

1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter: `https://www.bur0.click`
3. Click "Scrape Again" to refresh cache
4. Verify Open Graph tags display correctly

### Twitter Card Validator

1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter: `https://www.bur0.click`
3. Preview card
4. Verify image and description

**Note:** You need to create `/public/og-image.png` (1200x630px) for social sharing preview.

---

## 📈 SEO Checklist (Already Implemented ✅)

### Technical SEO

- ✅ Sitemap.xml (auto-generated)
- ✅ Robots.txt (blocks AI scrapers)
- ✅ Canonical URLs
- ✅ Schema.org JSON-LD
- ✅ Mobile-responsive
- ✅ Fast loading (Next.js optimization)
- ✅ HTTPS (via Vercel)

### On-Page SEO

- ✅ Unique title tags with templates
- ✅ Meta descriptions (155 chars)
- ✅ H1 tags on each page
- ✅ Alt text for images (to add when you create og-image.png)
- ✅ Internal linking (nav menu)
- ✅ Italian language tags (`lang="it"`)

### Content SEO

- ✅ Target keywords:
  - burocrazia italiana
  - decodifica documenti
  - agenzia delle entrate
  - traduttore burocratese
  - multa decodifica
- ✅ Long-form content (landing page)
- ✅ Clear call-to-action
- ✅ User engagement features (decoder)

### Local SEO (for Italy)

- ✅ `it-IT` locale in Open Graph
- ✅ Italian content throughout
- ✅ `.click` domain (international, memorable)

---

## 🚀 Post-Launch SEO Tasks

### Week 1

- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Validate structured data
- [ ] Test social media previews
- [ ] Create og-image.png (1200x630px)

### Week 2-4

- [ ] Monitor Search Console for crawl errors
- [ ] Check indexing status
- [ ] Add Google Analytics property link in Search Console
- [ ] Monitor keyword rankings

### Month 2-3

- [ ] Create content pages (e.g., /guide, /examples)
- [ ] Build backlinks (submit to directories)
- [ ] Encourage user reviews/testimonials
- [ ] Add FAQ schema markup
- [ ] Create blog for SEO content

---

## 🎨 Create OG Image (Required)

You need to create `/public/og-image.png`:

**Specifications:**

- Size: 1200 x 630 pixels
- Format: PNG or JPG
- Max size: 8 MB (but keep under 300 KB)
- Content: Logo + tagline + website URL

**Suggested Design:**

```
┌─────────────────────────────────┐
│                                 │
│         BUR⓪ Logo (large)      │
│                                 │
│   Il Decodificatore di         │
│   Burocrazia Italiana          │
│                                 │
│   www.bur0.click               │
│                                 │
└─────────────────────────────────┘
```

Use yellow background (#fef08a) with black text to match your brand.

**Tools to create it:**

- Canva (easiest)
- Figma
- Photoshop
- GIMP (free)

Once created, place at: `public/og-image.png`

---

## 📊 Monitoring & Analytics

### Search Console Reports to Watch

1. **Performance Report** - Track impressions, clicks, CTR
2. **Coverage Report** - Ensure all pages indexed
3. **Core Web Vitals** - Monitor speed metrics
4. **Mobile Usability** - Check for mobile issues

### Key Metrics

- **Impressions:** How many times your site appears in search
- **Clicks:** How many people click through
- **CTR (Click-Through Rate):** Clicks ÷ Impressions
- **Average Position:** Your ranking (aim for top 10)

### Target Rankings (3-6 months)

- "burocrazia italiana decoder" → Top 3
- "traduttore burocratese" → Top 10
- "decodifica documenti gratis" → Top 10
- "agenzia entrate spiegazione" → Top 20

---

## 🔗 Link Building Strategy

### Free Directories (Submit to):

- [ProductHunt](https://www.producthunt.com) - Launch page
- [AlternativeTo](https://alternativeto.net) - List as alternative
- [Italian Startup Directories](https://www.startupitalia.eu)
- Reddit r/italy (share as resource)
- Italian tech forums

### Content Marketing

1. Write blog post: "Come Decifrare Lettere dell'Agenzia delle Entrate"
2. Share on LinkedIn (target Italian professionals)
3. Create YouTube tutorial (Italian language)
4. Submit to Italian tech newsletters

### Partnerships

- Reach out to Italian legal blogs
- Contact accounting influencers
- Partner with municipality websites
- Offer widget for consultation websites

---

## ⚠️ Common SEO Mistakes to Avoid

1. ❌ Don't keyword stuff
2. ❌ Don't buy backlinks
3. ❌ Don't duplicate content
4. ❌ Don't ignore mobile optimization
5. ❌ Don't forget alt text on images
6. ❌ Don't use auto-generated thin content

---

## 📞 Need Help?

If search engines don't index after 2 weeks:

1. Check robots.txt isn't blocking (it's not ✅)
2. Verify sitemap is accessible
3. Check for manual penalties in Search Console
4. Ensure Vercel deployment is public (not password-protected)

**Your sitemap URL:** `https://www.bur0.click/sitemap.xml`  
**Your robots.txt URL:** `https://www.bur0.click/robots.txt`

Both should be publicly accessible after deployment.

---

_Last Updated: December 6, 2025_
