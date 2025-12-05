# Stripe Payment Setup Checklist

## ✅ Current Status

### Environment Variables Required:
- ✅ `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with sk_live_)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with pk_live_)
- ✅ `STRIPE_WEBHOOK_SECRET` - From Stripe webhook endpoint (starts with whsec_)
- ⚠️ `NEXT_PUBLIC_STRIPE_PRICE_STARTER` - Price ID for €4.99/month Senatore plan
- ⚠️ `NEXT_PUBLIC_STRIPE_PRICE_PRO` - Price ID for €9.99/month Imperatore plan
- ⚠️ `NEXT_PUBLIC_STRIPE_PRICE_CREDITS` - Price ID for €1.49 one-time 5 credits

## 📋 Setup Steps

### 1. Create Stripe Products & Prices
Go to: https://dashboard.stripe.com/products

**Product 1: Senatore (Corrotto)**
- Name: "Piano Senatore - Bur0"
- Price: €4.99
- Billing: Recurring monthly
- Copy the Price ID (price_xxxxx) → Add to `NEXT_PUBLIC_STRIPE_PRICE_STARTER`

**Product 2: Imperatore (Intoccabile)**
- Name: "Piano Imperatore - Bur0"
- Price: €9.99
- Billing: Recurring monthly
- Copy the Price ID (price_xxxxx) → Add to `NEXT_PUBLIC_STRIPE_PRICE_PRO`

**Product 3: 5 Crediti Extra**
- Name: "5 Crediti Extra - Bur0"
- Price: €1.49
- Billing: One-time
- Copy the Price ID (price_xxxxx) → Add to `NEXT_PUBLIC_STRIPE_PRICE_CREDITS`

### 2. Set Up Webhook
Go to: https://dashboard.stripe.com/webhooks

1. Click "Add endpoint"
2. Endpoint URL: `https://www.bur0.click/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the Signing Secret (whsec_xxxxx) → Add to `STRIPE_WEBHOOK_SECRET`

### 3. Add to Vercel Environment Variables
Go to: https://vercel.com/[your-project]/settings/environment-variables

Add all 6 variables listed above.

### 4. Redeploy
After adding env variables, trigger a new deployment in Vercel.

## 🧪 Testing

### Test Payment Flow:
1. Go to https://www.bur0.click
2. Click "Vedi Prezzi" or "Upgrade"
3. Select a plan
4. Use Stripe test card: `4242 4242 4242 4242`
5. Check Vercel logs for webhook events
6. Verify user plan updated in database

### Test Webhook Locally:
```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret and add to .env.local
# STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# Test event
stripe trigger checkout.session.completed
```

## 🔍 Troubleshooting

### Payment doesn't process:
- Check Vercel logs for errors
- Verify all Price IDs are correct
- Ensure webhook secret is set

### Webhook signature verification fails:
- Make sure STRIPE_WEBHOOK_SECRET is correctly set
- Check webhook endpoint URL is exact: `/api/webhooks/stripe`

### User plan doesn't update:
- Check database connection
- Verify userId is in session metadata
- Look at webhook processing logs in Vercel

## 🎯 Payment Flow

```
User clicks "Upgrade" 
→ /api/checkout creates Stripe Checkout Session
→ User completes payment on Stripe
→ Stripe sends webhook to /api/webhooks/stripe
→ Webhook verifies signature
→ Updates user plan in database
→ User redirected to /dashboard?success=true
```

## ✨ Ready for Production!

Once all Price IDs and webhook secret are set in Vercel, your payment system is fully operational!
