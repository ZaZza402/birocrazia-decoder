# 🔧 Updates - December 5, 2025

## ✅ Changes Implemented

### 1. Admin Access

- **Your user ID** (`user_36O6XglFzqJIEcBuL9wH0Uooi1Z`) now has **unlimited access**
- Bypasses all rate limiting
- Shows 999,999 credits for testing
- Located in: `lib/plans.ts` line 70

### 2. Italian Market Pricing 💰

Updated all prices to be more competitive:

- **Emergency Credits**: ~~€1.99~~ → **€1.49** (5 credits)
- **Senatore Plan**: ~~€7.99~~ → **€4.99/month** (30 decodes)
- **Imperatore Plan**: ~~€12.99~~ → **€9.99/month** (unlimited)
- **Cittadino Plan**: Free - 3 decodes/month (unchanged)

### 3. Removed OCR Features 🗑️

- Removed all file upload functionality
- Removed PDF/Image support (not needed for text-only decoder)
- Cleaned up unused imports (Upload, X, Lock icons)
- Removed `ocrEnabled`, `storageEnabled`, `historyEnabled` flags from plans
- Simplified to **text-only input** - Gemini handles this perfectly

### 4. Mobile UI Fixes 📱

**Referral Card:**

- Fixed OK button breaking out of card on mobile
- Changed from `flex gap-2` to `flex-col sm:flex-row gap-2`
- Button now full width on mobile, auto width on desktop
- Added proper padding and min-width for better touch targets

### 5. Pricing Buttons (No Action Needed) ✨

The loading spinner you saw is **expected behavior**:

- When user clicks a pricing button, it shows spinner while redirecting to Stripe
- Once Stripe is configured, it will redirect properly
- For now, it shows an alert: "Stripe non ancora configurato"

---

## 📝 What You Need to Do

### Step 1: Environment Setup

Since you don't have a `.env.local` file yet, create one:

```bash
# Copy the example
cp .env.example .env.local
```

Then fill in your values:

```env
# Your existing keys
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_key_here
DATABASE_URL=your_postgres_url_here

# New Stripe keys (get from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=(get after creating webhook)

# Create 3 products in Stripe and paste Price IDs:
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_...    # €4.99/month
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...        # €9.99/month
NEXT_PUBLIC_STRIPE_PRICE_CREDITS=price_...    # €1.49 one-time

# Your production URL
NEXT_PUBLIC_URL=https://www.bur0.click
```

### Step 2: Update Database Schema

```bash
npx prisma generate
npx prisma db push
```

This will:

- Add `referralCode`, `bonusCredits`, `stripeCustomerId` to User table
- Create new `Referral` table
- Fix all TypeScript errors

### Step 3: Create Stripe Products

Go to [dashboard.stripe.com/products](https://dashboard.stripe.com/products):

1. **Senatore** - Recurring subscription

   - Price: €4.99/month
   - Copy the Price ID → `NEXT_PUBLIC_STRIPE_PRICE_STARTER`

2. **Imperatore** - Recurring subscription

   - Price: €9.99/month
   - Copy the Price ID → `NEXT_PUBLIC_STRIPE_PRICE_PRO`

3. **5 Crediti Extra** - One-time payment
   - Price: €1.49
   - Copy the Price ID → `NEXT_PUBLIC_STRIPE_PRICE_CREDITS`

### Step 4: Set Up Webhook

In Stripe dashboard → Webhooks → Add endpoint:

- URL: `https://www.bur0.click/api/webhooks/stripe`
- Events: Select these 4:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Copy the Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Step 5: Deploy to Production

```bash
git add .
git commit -m "Update pricing, remove OCR, add admin access"
git push origin main
```

Then in Vercel:

1. Add all environment variables from `.env.local`
2. Redeploy
3. Point `www.bur0.click` to Vercel

---

## 🧪 Testing Checklist

### As Admin User

- [ ] You can decode unlimited times
- [ ] Usage card shows 999,999 credits
- [ ] No rate limiting applied

### For New Users

- [ ] Free tier: 3 decodes per month
- [ ] Pricing shows: €4.99, €9.99, €1.49
- [ ] Referral card looks good on mobile
- [ ] OK button doesn't overflow on mobile
- [ ] Share button generates image with watermark
- [ ] No file upload buttons visible

### Payment Flow

- [ ] Clicking "Scegli Senatore" → Stripe checkout
- [ ] After payment → User upgraded to STARTER
- [ ] Dashboard shows 30/month limit
- [ ] Emergency credits button works

---

## 🚀 Your App is Ready!

All the issues you mentioned are fixed:

- ✅ You have full admin access
- ✅ Prices adjusted for Italian market
- ✅ OCR/file upload completely removed
- ✅ Mobile UI fixed (referral card)
- ✅ Spinner on pricing buttons is normal (waits for Stripe redirect)

Just complete the 5 steps above and you're ready to launch on **www.bur0.click**! 🎉
