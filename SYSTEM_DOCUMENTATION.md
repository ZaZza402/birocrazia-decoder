# BUR⓪ - Complete System Documentation

## 🎯 Overview

BUR⓪ is a **free, unlimited** bureaucratic document decoder powered by Google Gemini AI. No authentication, no payments, no database - just pure AI decoding with smart rate limiting and comprehensive analytics.

---

## 🔐 Rate Limiting System

### How It Works

**Technology:** In-memory IP-based rate limiting  
**Limit:** 10 requests per hour per IP address  
**Window:** Sliding 1-hour window  
**Storage:** RAM (resets on deployment)

### Flow Diagram

```
User submits decode request
    ↓
Extract IP from headers (x-forwarded-for on Vercel)
    ↓
Check rate limit store
    ├─ First request? → Create entry (count: 1, resetAt: now + 1h)
    ├─ Within limit? → Increment counter, process request
    └─ Over limit? → Return 429 error with Italian message
    ↓
If allowed: Process with Gemini AI
If blocked: Show error banner in UI
```

### Implementation Details

**File:** `lib/rate-limiter.ts`

```typescript
interface RateLimitEntry {
  count: number; // Number of requests made
  resetAt: number; // Unix timestamp when limit resets
}

const rateLimitStore = new Map<string, RateLimitEntry>();
```

**Key Functions:**

- `checkRateLimit(ip, limit=10, windowMs=3600000)` - Validates request
- `getClientIp(request)` - Extracts IP from Vercel headers

**Error Message:**

```
"Troppe richieste. Hai rotto il cazzo. Torna tra X minuti."
```

**HTTP Headers Returned (429 status):**

- `X-RateLimit-Limit: 10`
- `X-RateLimit-Remaining: 0`
- `X-RateLimit-Reset: <ISO timestamp>`

### User Experience

| Request #    | Outcome                                  |
| ------------ | ---------------------------------------- |
| 1-10         | ✅ Works normally                        |
| 11+          | ❌ Red error banner appears              |
| After 1 hour | ✅ Counter resets, user can make 10 more |

### Limitations & Bypasses

⚠️ **Known Issues:**

- **Deployment resets**: In-memory store clears on every Vercel deployment
- **VPN bypass**: Users can change IP to reset limit
- **Shared networks**: Offices/universities share the same IP limit
- **No persistence**: No database = no historical tracking

💡 **Future Improvements:**

- Use Redis (Upstash) for persistent rate limiting
- Add browser fingerprinting for more accurate tracking
- Implement daily global quota (e.g., 1000 decodes/day total)

---

## 📊 Google Analytics Integration

### Setup

**File:** `app/components/google-analytics.tsx`

Requires environment variable:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Get your ID from: https://analytics.google.com

### Events Tracked

#### Page Events

- `page_view` - Every page load

#### Decoder Events

| Event                | When                   | Data Captured                               |
| -------------------- | ---------------------- | ------------------------------------------- |
| `decoder_start`      | User clicks DECODIFICA | persona, has_image, input_type              |
| `decoder_complete`   | AI finishes processing | persona, has_image, risk_level, duration_ms |
| `decoder_error`      | API/processing fails   | error_message, persona                      |
| `decoder_rate_limit` | User hits rate limit   | persona, minutes_remaining                  |

#### Persona Events

| Event            | When                  | Data Captured         |
| ---------------- | --------------------- | --------------------- |
| `persona_select` | User switches persona | persona, from_persona |

#### Document Events

| Event             | When               | Data Captured           |
| ----------------- | ------------------ | ----------------------- |
| `document_upload` | Image uploaded     | file_name, file_size_kb |
| `document_remove` | User removes image | (no params)             |

#### Share Events

| Event                  | When                          | Data Captured       |
| ---------------------- | ----------------------------- | ------------------- |
| `share_image_generate` | User clicks "Share"           | persona, risk_level |
| `share_image_download` | Image successfully downloaded | persona             |

#### Navigation Events

| Event               | When                       |
| ------------------- | -------------------------- |
| `nav_home_click`    | User clicks HOME in nav    |
| `nav_decoder_click` | User clicks DECODER in nav |

#### Engagement Events

| Event                 | When                        |
| --------------------- | --------------------------- |
| `text_input_start`    | User types first character  |
| `disclaimer_click`    | User clicks disclaimer link |
| `external_link_click` | User clicks external links  |

### Usage Example

```typescript
import { trackDecoderStart } from "@/lib/analytics";

// Track decoder usage
trackDecoderStart("cinico", true); // persona, hasImage

// Track completion with duration
const startTime = Date.now();
// ... processing ...
trackDecoderComplete("cinico", true, "ALTO", Date.now() - startTime);
```

### Analytics Dashboard Insights

**Key Metrics to Monitor:**

1. **Decoder Completion Rate** = `decoder_complete` / `decoder_start`
2. **Average Processing Time** = AVG(`duration_ms`)
3. **Most Popular Persona** = GROUP BY `persona`
4. **Rate Limit Hit Rate** = `decoder_rate_limit` / `decoder_start`
5. **Image Upload Percentage** = COUNT(`has_image=true`) / TOTAL
6. **Share Conversion Rate** = `share_image_download` / `decoder_complete`

---

## 🔍 SEO Optimization

### Metadata (app/layout.tsx)

**Enhanced Features:**

- ✅ Dynamic title templates: `%s | BUR⓪`
- ✅ Rich keywords targeting Italian bureaucracy search terms
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card metadata
- ✅ Schema.org WebApplication structured data
- ✅ robots.txt with GPT bot blocking
- ✅ sitemap.xml with priority weighting

### Schema.org JSON-LD

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
  },
  "inLanguage": "it-IT"
}
```

### Sitemap Structure

| URL           | Priority | Update Frequency |
| ------------- | -------- | ---------------- |
| `/`           | 1.0      | Weekly           |
| `/decoder`    | 0.9      | Daily            |
| `/disclaimer` | 0.5      | Monthly          |

### robots.txt Configuration

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /
```

**Why block GPT bots?** Prevent AI scrapers from training on our content without attribution.

### Target Keywords

Primary:

- burocrazia italiana
- decodifica documenti
- agenzia delle entrate
- traduttore burocratese

Secondary:

- multa decodifica
- OCR italiano
- consulenza documenti gratis
- semplificazione amministrativa

---

## 🚀 Deployment Checklist

### Environment Variables

**Production (.env.local or Vercel):**

```env
# REQUIRED
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD...

# OPTIONAL (for analytics)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Pre-Deployment Steps

1. ✅ Build passes: `npm run build`
2. ✅ No TypeScript errors
3. ✅ Rate limiter tested (10 requests work, 11th blocked)
4. ✅ Analytics tracking events verified in dev
5. ⚠️ Add Google Search Console verification code to layout.tsx
6. ⚠️ Create og-image.png (1200x630px) for social sharing
7. ⚠️ Get Google Analytics 4 Measurement ID

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
```

### Post-Deployment Monitoring

**Google AI Studio Dashboard:**

- Monitor daily request count (250/day limit on free tier)
- Check token usage (should be ~500-2000 tokens/request)
- Set up billing alerts if approaching limits

**Google Analytics:**

- Verify events are being received (Real-Time view)
- Create custom dashboard for key metrics
- Set up alerts for error rate spikes

**Vercel Analytics:**

- Monitor function execution time
- Check error rates
- Track bandwidth usage

---

## 📈 API Usage & Costs

### Google Gemini 2.5 Flash Free Tier

**Limits:**

- 10 requests per minute (RPM)
- 250K tokens per minute (TPM)
- 250 requests per day (RPD)

**Current Usage (Dec 6, 2025):**

- Peak RPM: 2/10 ✅
- Peak TPM: 3.54K/250K ✅
- Peak RPD: 35/250 ✅

### Cost Estimation

**Free Tier (Current):**

- Cost: $0/month
- Capacity: ~7,500 requests/month
- Perfect for MVP and initial launch

**Paid Tier (After Free Tier):**

- Input: $0.00025 per 1K tokens (~$0.0005/request)
- Output: $0.0005 per 1K tokens (~$0.001/request)
- Image: $0.00025 per image
- **Estimated:** ~$0.002-0.005 per decode

**Monthly Cost Projections:**

| Daily Users | Decodes/Day | Monthly Cost   |
| ----------- | ----------- | -------------- |
| 50          | 250         | $0 (free tier) |
| 200         | 1,000       | $75-150        |
| 500         | 2,500       | $187-375       |
| 1,000       | 5,000       | $375-750       |

### Optimization Strategies

1. **Prompt Engineering** - Shorter prompts = lower costs
2. **Caching** - Cache common documents (not implemented yet)
3. **Rate Limiting** - Already implemented (10/hour)
4. **Image Compression** - Reduce image token usage

---

## 🛡️ Security & Privacy

### Data Handling

**What We DON'T Store:**

- ❌ User accounts/emails
- ❌ Uploaded documents
- ❌ Decoded results
- ❌ IP addresses (only used for rate limiting, discarded after 1 hour)
- ❌ Personal information

**What We DO Track (Anonymous):**

- ✅ Page views (GA4)
- ✅ Button clicks (GA4)
- ✅ Decoder usage patterns (GA4)
- ✅ Error rates (GA4)

### Image Upload Flow

```
1. User uploads image →
2. Converted to base64 in browser →
3. Sent to API →
4. Forwarded to Gemini AI →
5. AI processes OCR →
6. Response returned →
7. Image DELETED from memory (never saved)
```

**Privacy Guarantee:** Images are processed in-memory only. No file storage.

### Rate Limiting Privacy

**IP Address Storage:**

- Stored: Only for rate limit duration (1 hour max)
- Format: Hashed (could be implemented for extra privacy)
- Purpose: Prevent API abuse
- Deletion: Automatic cleanup every 10 minutes for expired entries

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Troppe richieste" Error

**Problem:** User hit 10 requests/hour limit  
**Solution:** Wait for timer to reset (displayed in error message)  
**Prevention:** Educate users about limits in UI

#### 2. Rate Limit Resets After Deployment

**Problem:** In-memory store clears on Vercel redeployments  
**Solution:** Move to Redis (Upstash) for persistent storage  
**Workaround:** Deploy during low-traffic hours

#### 3. Analytics Not Working

**Problem:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` not set  
**Solution:** Add environment variable in Vercel dashboard  
**Verify:** Check browser console for `gtag` function

#### 4. Images Not Uploading

**Problem:** File too large (>10MB)  
**Solution:** Compress image before upload  
**Future:** Add client-side compression library

#### 5. Build Fails with "Expected '}'"

**Problem:** Syntax error in decoder-client.tsx  
**Solution:** Check for unclosed function brackets  
**Prevention:** Use ESLint and Prettier

---

## 📚 File Structure Reference

```
burocrazia-decoder/
├── app/
│   ├── layout.tsx                 # Root layout with SEO + GA
│   ├── page.tsx                   # Landing page
│   ├── sitemap.ts                 # Auto-generated sitemap
│   ├── robots.ts                  # Auto-generated robots.txt
│   ├── decoder/
│   │   └── page.tsx              # Decoder route wrapper
│   ├── decoder-client.tsx        # Main decoder logic (CLIENT)
│   ├── components/
│   │   ├── google-analytics.tsx  # GA4 integration
│   │   ├── sticky-nav.tsx        # Navigation with tracking
│   │   └── footer.tsx            # Reusable footer
│   └── api/
│       └── chat/
│           └── route.ts          # AI API with rate limiting
├── lib/
│   ├── rate-limiter.ts           # IP-based rate limiting
│   ├── analytics.ts              # GA4 event tracking helpers
│   └── generate-share-image.ts   # Share image generator
├── .env.local                     # Environment variables (NEVER COMMIT)
├── .env.example                   # Template for env vars
└── package.json                   # Dependencies
```

---

## 🎓 Best Practices

### For Development

1. Always test rate limiting in production-like environment
2. Use TypeScript strict mode
3. Track every user interaction with GA4
4. Monitor Google AI Studio dashboard daily
5. Keep prompts concise to minimize token usage

### For Users

1. Educate about rate limits upfront
2. Show clear error messages in Italian
3. Provide context for why limits exist
4. Make disclaimer prominent (legal protection)
5. Offer share functionality for viral growth

### For Monitoring

1. Set up Vercel error alerts
2. Monitor GA4 real-time dashboard during launch
3. Track decoder completion rate (quality metric)
4. Watch for unusual IP patterns (abuse detection)
5. Check Google AI billing weekly

---

## 📞 Support & Contact

**Creator:** Alecs Design  
**Website:** https://alecsdesign.xyz  
**Project:** BUR⓪ (https://www.bur0.click)

**Documentation Last Updated:** December 6, 2025

---

## 🚀 What's Next?

**Potential Features:**

- [ ] Redis-based rate limiting (persistent)
- [ ] User feedback system (thumbs up/down)
- [ ] Document templates (comune letters, INPS, etc.)
- [ ] Multi-language support (English, Spanish)
- [ ] Browser extension for inline decoding
- [ ] API for third-party integrations
- [ ] Advanced OCR with form field extraction
- [ ] Historical trending of bureaucracy complexity

**Revenue Options (if needed later):**

- Premium tier: 50 requests/day for €5/month
- Enterprise API: Bulk processing for consultants
- White-label licensing for municipalities
- Sponsored personas (e.g., "Il Consulente TIM")

---

_Built with frustration towards Italian bureaucracy, powered by AI, tracked obsessively._
