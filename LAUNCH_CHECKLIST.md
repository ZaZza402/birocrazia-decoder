# ✅ Bur0 Launch Checklist

## 🔧 Technical Setup

### Database

- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (or migrate)
- [ ] Verify new tables exist: `User`, `DecodeHistory`, `Referral`
- [ ] Test database connection

### Stripe Configuration

- [ ] Create Stripe account (if needed)
- [ ] Create "Senatore" product (€7.99/month)
  - [ ] Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_STARTER`
- [ ] Create "Imperatore" product (€12.99/month)
  - [ ] Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_PRO`
- [ ] Create "5 Crediti" product (€1.99 one-time)
  - [ ] Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_CREDITS`
- [ ] Set up webhook endpoint
  - [ ] URL: `https://www.bur0.click/api/webhooks/stripe`
  - [ ] Events: `checkout.session.completed`, `customer.subscription.*`
  - [ ] Copy Webhook Secret → `STRIPE_WEBHOOK_SECRET`

### Environment Variables

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Add `CLERK_SECRET_KEY`
- [ ] Add `DATABASE_URL`
- [ ] Add `STRIPE_SECRET_KEY`
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Add `STRIPE_WEBHOOK_SECRET`
- [ ] Add all 3 Stripe Price IDs
- [ ] Set `NEXT_PUBLIC_URL` to `https://www.bur0.click`

---

## 🧪 Testing (Local)

### Basic Functionality

- [ ] App runs without errors (`npm run dev`)
- [ ] Can sign up new user
- [ ] User gets auto-generated referral code
- [ ] Dashboard shows usage card
- [ ] Dashboard shows referral card
- [ ] Can apply someone else's referral code
- [ ] Bonus credits show correctly

### Decoder

- [ ] Can submit text for decoding
- [ ] Free users limited to 3/month
- [ ] Usage counter increments
- [ ] Bonus credits used after monthly limit
- [ ] Share button generates image correctly

### Payments (Test Mode)

- [ ] Pricing page buttons work
- [ ] Stripe checkout opens
- [ ] Test card works: `4242 4242 4242 4242`
- [ ] After payment, webhook fires
- [ ] User plan updates in database
- [ ] Dashboard shows new plan
- [ ] One-time credit purchase works
- [ ] Bonus credits increment correctly

### Referral System

- [ ] New users can apply referral code
- [ ] Referrer gets 3 bonus credits
- [ ] New user gets 2 bonus credits
- [ ] Can't self-refer
- [ ] Can't apply code twice

---

## 🚀 Deployment

### Vercel Setup

- [ ] Push code to GitHub
- [ ] Connect repo to Vercel
- [ ] Add all environment variables
- [ ] Deploy successfully
- [ ] Check Vercel logs for errors

### Domain Configuration

- [ ] Connect `www.bur0.click` to Vercel
- [ ] Verify SSL certificate active
- [ ] Test site loads at `https://www.bur0.click`

### Stripe Webhook (Production)

- [ ] Update webhook URL to production domain
- [ ] Use live mode (not test mode)
- [ ] Test webhook with real payment
- [ ] Verify events received in Stripe dashboard

---

## 📊 Post-Launch Monitoring

### Day 1

- [ ] Monitor Vercel logs for errors
- [ ] Check Stripe dashboard for payments
- [ ] Verify webhooks are firing
- [ ] Test sign-up flow from clean browser
- [ ] Check database for new users

### Week 1

- [ ] Track conversion rate (Free → Paid)
- [ ] Monitor referral usage
- [ ] Check for failed payments
- [ ] Review error logs
- [ ] Gather user feedback

---

## 📢 Marketing Prep

### Content

- [ ] Write launch announcement
- [ ] Prepare social media posts
- [ ] Create demo video (optional)
- [ ] Set up email for support@bur0.click

### Legal

- [ ] Add Terms of Service page
- [ ] Add Privacy Policy page
- [ ] Add Cookie consent (if needed for EU)
- [ ] Add refund policy

### SEO

- [ ] Add meta descriptions
- [ ] Create sitemap
- [ ] Submit to Google Search Console
- [ ] Add OpenGraph images

---

## 🎯 Success Metrics

Track these weekly:

- [ ] Total signups
- [ ] Free → Paid conversion rate (target: 3-5%)
- [ ] MRR (Monthly Recurring Revenue)
- [ ] One-time credit sales
- [ ] Active referral rate (target: 20%+)
- [ ] Average bonus credits per user
- [ ] Churn rate (target: <5%)

---

## 🔒 Security

- [ ] `.env.local` is in `.gitignore`
- [ ] Stripe keys are secure
- [ ] Database access is restricted
- [ ] Webhook signature verified
- [ ] Rate limiting works
- [ ] No sensitive data in logs

---

## 🆘 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Database Support**: [Your provider]

---

**Ready to launch when all checkboxes are complete! 🎉**
