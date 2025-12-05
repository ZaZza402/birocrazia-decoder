# 💳 Stripe Integration Guide for Bur0

This guide explains how to integrate Stripe payments into your Next.js application to support the "Senatore" and "Imperatore" plans.

## 1. Prerequisites

- A [Stripe Account](https://stripe.com) (created and verified).
- Node.js installed.

## 2. Install Stripe Libraries

Run this command in your terminal:

```bash
npm install stripe @stripe/stripe-js
```

## 3. Environment Variables

Add your Stripe keys to `.env.local`. You can find these in the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # You'll get this later
```

## 4. Create Products in Stripe

1.  Go to **Product Catalog** in Stripe Dashboard.
2.  Create two products:
    - **Senatore**: €5.99 / month.
    - **Imperatore**: €15.99 / month.
3.  Copy the **Price ID** for each (starts with `price_...`). You will need these in your code.

## 5. Implementation Steps

### A. Create a Checkout API Route (`app/api/checkout/route.ts`)

This route will create a Stripe Checkout Session.

```typescript
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use latest version
});

export async function POST(req: Request) {
  const { userId } = auth();
  const user = await currentUser();
  const { priceId } = await req.json();

  if (!userId || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/dashboard?success=true",
    cancel_url: "http://localhost:3000/dashboard?canceled=true",
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId,
    },
  });

  return NextResponse.json({ url: session.url });
}
```

### B. Create a Webhook Handler (`app/api/webhook/route.ts`)

This is crucial. Stripe will notify your app when a payment is successful so you can update the user's plan in your database.

**Note:** Since we don't have a database yet, you'll need to set one up (e.g., Prisma + Postgres) to store the user's subscription status.

```typescript
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;

    // TODO: Update user in your database
    // await db.user.update({ where: { id: userId }, data: { plan: "PRO" } })

    console.log(`User ${userId} subscribed!`);
  }

  return new NextResponse(null, { status: 200 });
}
```

### C. Connect the Buttons

In your `app/page.tsx` or `app/dashboard/page.tsx`, update the "Upgrade" buttons to call the checkout API.

```tsx
const handleUpgrade = async (priceId: string) => {
  const res = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({ priceId }),
  });
  const data = await res.json();
  window.location.href = data.url;
};
```

## 6. Testing

1.  Use **Stripe CLI** to forward webhooks to localhost: `stripe listen --forward-to localhost:3000/api/webhook`.
2.  Use Stripe's [Test Cards](https://stripe.com/docs/testing) (e.g., 4242 4242 4242 4242) to simulate payments.
