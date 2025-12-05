# 🚨 CRITICAL VERCEL ENVIRONMENT VARIABLES CHECKLIST

## The Problem

Your production app is failing with 500 errors because:

1. ❌ Database connection failing (Prisma configuration was wrong)
2. ❌ Missing environment variables in Vercel
3. ❌ Clerk authentication not properly configured

## ✅ FIXED IN CODE (Commit `6084bd3`)

- ✅ Prisma v7 configuration corrected
- ✅ Database client now uses `datasourceUrl` for Accelerate
- ✅ Schema.prisma cleaned up (removed `url` - now in prisma.config.ts)

---

## 🔥 YOU MUST ADD THESE TO VERCEL NOW

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### **REQUIRED Variables (Copy these EXACTLY):**

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuYnVyMC5jbGljayQ
CLERK_SECRET_KEY=(your secret key starting with sk_live_)

# Clerk Routing (CRITICAL - These fix the CORS errors)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Database (Prisma Accelerate)
PRISMA_DATABASE_URL=(your Prisma Accelerate connection string starting with prisma+postgres://)

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=(your Google API key)

# Stripe Live Keys
STRIPE_SECRET_KEY=(your Stripe secret key starting with sk_live_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=(your Stripe publishable key starting with pk_live_)
STRIPE_WEBHOOK_SECRET=(your webhook secret starting with whsec_)

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_STARTER=(your Starter plan price ID)
NEXT_PUBLIC_STRIPE_PRICE_PRO=(your Pro plan price ID)
NEXT_PUBLIC_STRIPE_PRICE_CREDITS=(your Credits price ID)

# Application URL
NEXT_PUBLIC_URL=https://www.bur0.click
```

---

## ⚡ AFTER ADDING VARIABLES:

1. **Deployments** tab → Click your latest deployment
2. Click **"Redeploy"** button
3. ✅ Check "Use existing build cache"
4. Click **"Redeploy"**
5. Wait 1-2 minutes for deployment to complete

---

## 🔍 HOW TO VERIFY IT'S WORKING:

### Test 1: Database Connection

- Go to `https://www.bur0.click/dashboard`
- If you see referral stats → ✅ Database working
- If you see 500 error → ❌ Check PRISMA_DATABASE_URL in Vercel

### Test 2: Stripe Checkout

- Go to `https://www.bur0.click/dashboard`
- Click any "ABBONATI" button
- Should redirect to Stripe checkout → ✅ Working
- If 500 error → ❌ Check STRIPE_SECRET_KEY in Vercel

### Test 3: Google OAuth

- Go to `https://www.bur0.click/sign-in`
- Click "Continue with Google"
- If it works → ✅ OAuth configured
- If 422 error → ❌ Enable Google in Clerk Dashboard

---

## 🆘 IF STILL BROKEN AFTER REDEPLOY:

### Check Vercel Logs:

1. Go to **Deployments** → Click your deployment
2. Click **"Functions"** tab
3. Find the failing API route (e.g., `/api/checkout`)
4. Read the error message - it will tell you which env var is missing

### Common Errors:

**"STRIPE_SECRET_KEY non configurata"**
→ Missing `STRIPE_SECRET_KEY` in Vercel

**"PrismaClient initialization error"**
→ Missing or wrong `PRISMA_DATABASE_URL` in Vercel

**"401 Unauthorized"**
→ Missing Clerk keys or user not signed in

---

## 📋 QUICK CHECKLIST

Before testing, make sure you've done ALL of these:

- [ ] Added ALL environment variables to Vercel (see list above)
- [ ] Clicked "Redeploy" after adding variables
- [ ] Waited for deployment to finish (green checkmark)
- [ ] Enabled Google OAuth in Clerk Dashboard (if you want Google login)
- [ ] Changed Clerk Paths to "Component" mode (not "Account Portal")
- [ ] Cleared browser cache (Ctrl+Shift+Delete)

---

## 🎯 EXPECTED RESULT

After completing all steps:

✅ Can sign up/sign in at `www.bur0.click/sign-in`
✅ Dashboard loads without 500 errors
✅ Referral stats show correctly
✅ Stripe checkout works
✅ Payments process successfully
✅ Google OAuth works (if enabled in Clerk)

---

## 🔑 WHERE TO FIND YOUR VALUES

**Clerk Keys:** https://dashboard.clerk.com → API Keys
**Prisma URL:** Prisma Dashboard → Your project → Connection string
**Stripe Keys:** https://dashboard.stripe.com → Developers → API keys
**Stripe Prices:** https://dashboard.stripe.com → Products → Copy price IDs
**Google AI:** https://aistudio.google.com/apikey

---

**Latest Code:** Commit `6084bd3` - Prisma configuration fixed
**Next Step:** Add environment variables to Vercel and redeploy
