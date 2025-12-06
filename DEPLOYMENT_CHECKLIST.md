# 🚀 Deployment Checklist - BUR⓪

## ✅ Pre-Deployment Verification

### Environment Variables

- [x] `GOOGLE_GENERATIVE_AI_API_KEY` set in `.env.local`
- [x] `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-SNCZMD4CYW` added
- [ ] Both variables added to Vercel dashboard

### Build & Testing

- [x] `npm run build` passes with no errors
- [x] All TypeScript errors resolved
- [x] Rate limiter tested (10 requests work, 11th blocked)
- [x] Analytics script loads (check browser console)
- [x] All pages accessible locally

### Files to Create Before Launch

- [ ] **CRITICAL:** Create `/public/og-image.png` (1200x630px)
  - Yellow background (#fef08a)
  - BUR⓪ logo
  - Tagline: "Il Decodificatore di Burocrazia"
  - Website URL: www.bur0.click
- [ ] Optional: Create `/public/android-chrome-192x192.png`
- [ ] Optional: Create `/public/android-chrome-512x512.png`

### Git & Version Control

- [x] `.gitignore` updated (excludes .env files, node_modules, etc.)
- [ ] All changes committed
- [ ] Push to GitHub
- [ ] Create release tag (e.g., `v1.0.0`)

---

## 🌐 Vercel Deployment

### Initial Deploy

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Set Environment Variables in Vercel

```bash
# Add Google AI API Key
vercel env add GOOGLE_GENERATIVE_AI_API_KEY production
# Paste: AIzaSyD6rmRfcBZ4OXMRnAQfvVBxzzlgCvpbSY0

# Add Google Analytics ID
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
# Paste: G-SNCZMD4CYW
```

**Or via Vercel Dashboard:**

1. Go to project settings
2. Navigate to "Environment Variables"
3. Add both variables for "Production" environment

### Domain Configuration

1. Go to Vercel project → Settings → Domains
2. Add custom domain: `www.bur0.click`
3. Add alias: `bur0.click` (redirects to www)
4. Vercel will provide DNS records
5. Update your domain registrar with Vercel's nameservers

**DNS Records (if using external DNS):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

---

## 🔍 Post-Deployment SEO Setup

### Google Search Console (Within 24 hours)

1. **Verify Ownership:**

   - Go to: https://search.google.com/search-console
   - Add property: `https://www.bur0.click`
   - Choose "HTML tag" method
   - Copy verification code (e.g., `google-site-verification=ABC123`)
   - Update `app/layout.tsx`:
     ```typescript
     verification: {
       google: "ABC123", // Replace this
     }
     ```
   - Redeploy: `vercel --prod`
   - Click "Verify" in Search Console

2. **Submit Sitemap:**

   - In Search Console → Sitemaps
   - Add: `https://www.bur0.click/sitemap.xml`
   - Submit

3. **Request Indexing:**
   - URL Inspection tool
   - Enter: `https://www.bur0.click`
   - Click "Request Indexing"
   - Repeat for: `https://www.bur0.click/decoder`

### Bing Webmaster Tools (Within 48 hours)

1. Go to: https://www.bing.com/webmasters
2. Add site: `https://www.bur0.click`
3. **Easiest:** Import site from Google Search Console
4. Submit sitemap: `https://www.bur0.click/sitemap.xml`

### Schema Markup Validation

1. Test at: https://search.google.com/test/rich-results
2. Enter: `https://www.bur0.click`
3. Verify "WebApplication" schema detected
4. Fix any warnings

### Social Media Preview Testing

**Facebook:**

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://www.bur0.click`
3. Click "Scrape Again"
4. Verify og:image displays

**Twitter:**

1. Go to: https://cards-dev.twitter.com/validator
2. Enter: `https://www.bur0.click`
3. Preview card
4. Verify image and description

**LinkedIn:**

1. Go to: https://www.linkedin.com/post-inspector/
2. Enter: `https://www.bur0.click`
3. Verify preview

---

## 📊 Analytics Setup

### Google Analytics 4

1. **Verify Installation:**

   - Visit: `https://www.bur0.click`
   - Open browser DevTools → Console
   - Check for GA4 script loading
   - No errors about `NEXT_PUBLIC_GA_MEASUREMENT_ID`

2. **Real-Time Testing:**

   - Go to: https://analytics.google.com
   - Navigate to your property (G-SNCZMD4CYW)
   - Go to "Reports" → "Real-time"
   - Visit your site in another tab
   - Verify you appear in real-time view

3. **Create Custom Dashboard:**

   - Add cards for:
     - Decoder usage (event: `decoder_complete`)
     - Persona popularity (dimension: `persona`)
     - Rate limit hits (event: `decoder_rate_limit`)
     - Share downloads (event: `share_image_download`)

4. **Set Up Alerts:**
   - Go to Admin → Data Display → Custom Alerts
   - Alert if `decoder_error` > 10% of total decodes
   - Alert if `decoder_rate_limit` > 50 per day

### Link GA4 to Search Console

1. In Google Analytics → Admin
2. Product Links → Search Console Links
3. Link your Search Console property
4. Enables search query data in GA4

---

## 🛡️ Security & Monitoring

### Rate Limiting Verification

1. **Test Locally First:**

   ```bash
   # Run 11 requests in quick succession
   for i in {1..11}; do curl -X POST https://www.bur0.click/api/chat; done
   ```

   - First 10 should succeed
   - 11th should return 429 error

2. **Monitor in Production:**
   - Check Vercel logs for 429 errors
   - Track `decoder_rate_limit` events in GA4

### API Cost Monitoring

1. **Google AI Studio Dashboard:**

   - Daily check: https://aistudio.google.com
   - Monitor RPD (should stay under 250 on free tier)
   - Set up billing alerts if approaching limit

2. **Vercel Usage:**
   - Check function invocations
   - Monitor bandwidth usage
   - Track serverless function duration

---

## 📈 Growth & Marketing

### Initial Launch (Week 1)

- [ ] Post on ProductHunt
- [ ] Share on Reddit r/italy
- [ ] Post on LinkedIn (Italian audience)
- [ ] Tweet about launch
- [ ] Submit to Italian startup directories
- [ ] Share in relevant Facebook groups

### Content Marketing (Week 2-4)

- [ ] Write blog post: "Come Funziona BUR⓪"
- [ ] Create video demo (Italian)
- [ ] Share user testimonials
- [ ] Submit to tech newsletters

### Backlink Building (Month 2)

- [ ] Reach out to Italian legal blogs
- [ ] Contact accounting influencers
- [ ] Submit to web directories
- [ ] Create guest posts

---

## 🔧 Maintenance Schedule

### Daily (First Week)

- Check Google Analytics real-time
- Monitor Search Console for errors
- Check API usage in Google AI Studio
- Review Vercel logs for errors

### Weekly (First Month)

- Check indexing status in Search Console
- Review GA4 event data
- Monitor rate limit hits
- Check for new feature requests

### Monthly (Ongoing)

- Review SEO rankings
- Analyze top keywords
- Check backlink profile
- Update content based on user feedback
- Review API costs vs. budget

---

## 📞 Emergency Contacts

### If Site Goes Down

1. Check Vercel status: https://vercel.com/status
2. Check domain DNS propagation: https://dnschecker.org
3. Review deployment logs in Vercel dashboard

### If API Hits Quota

1. Google AI Studio: Upgrade to paid tier
2. Implement stricter rate limiting (5 req/hour)
3. Add global daily cap (e.g., 1000/day)

### If Search Console Penalties

1. Check "Manual Actions" in Search Console
2. Review "Security Issues" tab
3. Fix reported problems
4. Request reconsideration

---

## 🎉 Launch Day Checklist

### T-Minus 1 Hour

- [ ] Final build: `npm run build`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Verify site loads at: https://www.bur0.click
- [ ] Test decoder with sample document
- [ ] Test rate limiter (11 requests)
- [ ] Check GA4 real-time view
- [ ] Verify og-image displays on social media

### T-Minus 30 Minutes

- [ ] Clear browser cache
- [ ] Test on mobile device
- [ ] Test on different browser (Chrome, Firefox, Safari)
- [ ] Share with friends for beta testing
- [ ] Monitor Vercel function logs

### Launch Time 🚀

- [ ] Post on social media
- [ ] Send to mailing list (if any)
- [ ] Submit to ProductHunt
- [ ] Monitor analytics dashboard
- [ ] Be ready to fix bugs quickly

### T-Plus 1 Hour

- [ ] Check for any error reports
- [ ] Monitor GA4 real-time users
- [ ] Review Vercel logs for 500 errors
- [ ] Respond to early user feedback

---

## 📊 Success Metrics (First 30 Days)

### Traffic Goals

- [ ] 100+ unique visitors
- [ ] 50+ decoder uses
- [ ] 10+ share image downloads
- [ ] 5+ organic search impressions

### Technical Goals

- [ ] 0 major bugs
- [ ] <2% error rate
- [ ] <3 second page load time
- [ ] 100% uptime

### SEO Goals

- [ ] Indexed in Google (all pages)
- [ ] Indexed in Bing
- [ ] 10+ search impressions in Search Console
- [ ] 1+ click from organic search

---

## 🎯 Next Phase Features (Post-Launch)

### Priority 1 (Month 1)

- [ ] Add user feedback system (thumbs up/down)
- [ ] Create FAQ page
- [ ] Add more persona options
- [ ] Implement Redis for rate limiting

### Priority 2 (Month 2-3)

- [ ] Create blog section
- [ ] Add document templates
- [ ] Multi-language support (English)
- [ ] User accounts (optional, for history)

### Priority 3 (Month 4+)

- [ ] Browser extension
- [ ] API for developers
- [ ] Premium tier ($5/month for 50 req/day)
- [ ] Mobile app

---

**Good luck with the launch! 🎉**

_This checklist was generated on December 6, 2025_
