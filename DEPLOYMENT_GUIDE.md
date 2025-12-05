# 🚀 Bur0 - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. **Update Prisma Database**

Run these commands to apply the new schema:

```bash
# Generate Prisma Client with new schema
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# OR create a migration (for production)
npx prisma migrate dev --name add_referrals_and_credits
```

### 2. **Set Up Stripe Products**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create 3 products:

#### **Product 1: Senatore (Subscription)**

- Name: `Senatore - Piano Corrotto`
- Price: `€7.99/month`
- Billing: `Recurring - Monthly`
- Copy the **Price ID** (starts with `price_...`)

#### **Product 2: Imperatore (Subscription)**

- Name: `Imperatore - Piano Intoccabile`
- Price: `€12.99/month`
- Billing: `Recurring - Monthly`
- Copy the **Price ID**

#### **Product 3: Emergency Credits (One-time)**

- Name: `5 Crediti Extra`
- Price: `€1.99`
- Billing: `One-time`
- Copy the **Price ID**

### 3. **Configure Stripe Webhook**

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set URL to: `https://www.bur0.click/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_...`)

### 4. **Update Environment Variables**

Add these to your Vercel project settings:

```bash
# Stripe Keys
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_STARTER="price_..."
NEXT_PUBLIC_STRIPE_PRICE_PRO="price_..."
NEXT_PUBLIC_STRIPE_PRICE_CREDITS="price_..."

# Production URL
NEXT_PUBLIC_URL="https://www.bur0.click"
```

### 5. **Test Payment Flow**

Before going live, test in Stripe Test Mode:

1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any CVC
4. Test subscription flow
5. Test one-time credit purchase
6. Verify webhook receives events
7. Check database updates correctly

---

## 🎯 Key Features Implemented

### ✅ **Fixed Issues**

1. **Rate Limiting** - Now uses database queries (can't be bypassed)
2. **getUserPlan** - Reads from database instead of hardcoded IDs
3. **Stripe Integration** - Full checkout + webhook handler
4. **Referral System** - Working code generation and tracking

### ✅ **New Features**

1. **One-Time Credits** - €1.99 for 5 extra decodes (emergency option)
2. **Referral System**:
   - Each user gets unique code
   - Referrer gets 3 bonus credits
   - New user gets 2 bonus credits
   - Tracked in database
3. **Usage Dashboard** - Real-time display of monthly usage
4. **Bonus Credits** - Accumulate from referrals and one-time purchases

---

## 📊 How It Works

### **Pricing Structure**

- **FREE**: 3 decodes/month (reduced from 7)
- **STARTER**: €7.99/month - 30 decodes + OCR + History
- **PRO**: €12.99/month - Unlimited + All features
- **EMERGENCY**: €1.99 one-time - 5 bonus credits

### **Credit System**

- Monthly credits reset on 1st of each month
- Bonus credits never expire
- Bonus credits used after monthly quota
- Tracked per decode in `onFinish` callback

### **Referral Flow**

1. User shares referral link: `bur0.click/?ref=ABC123`
2. New user signs up and applies code
3. System validates code isn't self-referral
4. Both users receive bonus credits
5. Tracked in `Referral` table

---

## 🔧 Vercel Deployment Steps

### 1. **Connect Domain**

```bash
# In Vercel Dashboard:
Settings > Domains > Add: www.bur0.click
```

### 2. **Set Environment Variables**

Go to: `Settings > Environment Variables`
Copy all variables from `.env.example` with production values

### 3. **Deploy**

```bash
git add .
git commit -m "Add Stripe payments and referral system"
git push origin main
```

Vercel will auto-deploy from GitHub.

### 4. **Run Database Migration**

After first deploy:

```bash
# On Vercel Dashboard, go to your Postgres database
# Or connect locally and run:
npx prisma migrate deploy
```

---

## 🐛 Troubleshooting

### **Issue: Stripe webhook not working**

- Check webhook URL is correct: `https://www.bur0.click/api/webhooks/stripe`
- Verify webhook secret matches in Vercel env vars
- Check Vercel logs for webhook errors

### **Issue: Database errors**

- Ensure `prisma generate` was run
- Check connection string is correct
- Verify database has latest schema

### **Issue: Checkout fails**

- Confirm Price IDs are correct in env vars
- Check Stripe is in live mode (not test mode)
- Verify `NEXT_PUBLIC_URL` is set to production domain

---

## 📈 Post-Launch Monitoring

### **Track These Metrics**

1. Conversion rate (Free → Paid)
2. Referral usage rate
3. One-time credit purchases
4. Monthly churn rate

### **Stripe Dashboard**

Monitor: `https://dashboard.stripe.com`

- Revenue
- Active subscriptions
- Failed payments

### **Database Queries**

```sql
-- Count active paid users
SELECT COUNT(*) FROM "User" WHERE plan IN ('STARTER', 'PRO');

-- Top referrers
SELECT u.email, COUNT(r.id) as referrals
FROM "User" u
LEFT JOIN "Referral" r ON u.id = r."referrerId"
GROUP BY u.id ORDER BY referrals DESC;

-- Total bonus credits given out
SELECT SUM("bonusCredits") FROM "User";
```

---

## 🚨 Important Notes

1. **Test everything in Stripe Test Mode first!**
2. **Webhook must be set up or payments won't update database**
3. **Database migration MUST run before going live**
4. **Keep `.env.local` secure - never commit it**
5. **Monitor Vercel logs for first 24 hours**

---

## 📞 Support Setup

Consider adding:

- Email support: support@bur0.click
- Status page: status.bur0.click
- Monitoring (Sentry, Plausible, etc.)

---

**You're ready to launch! 🎉**
