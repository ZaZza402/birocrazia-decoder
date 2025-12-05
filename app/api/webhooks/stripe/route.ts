import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { ONE_TIME_CREDITS } from "@/lib/plans";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY non configurata");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover",
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret non configurato" },
      { status: 500 }
    );
  }
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        // Handle subscription
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const priceId = subscription.items.data[0]?.price.id;
          let plan = "FREE";

          // Determine plan based on price ID
          if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER) {
            plan = "STARTER";
          } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) {
            plan = "PRO";
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              stripeSubscriptionId: subscription.id,
            },
          });

          console.log(`✅ User ${userId} upgraded to ${plan}`);
        }

        // Handle one-time credit purchase
        if (
          session.mode === "payment" &&
          session.metadata?.type === "credits"
        ) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              bonusCredits: {
                increment: ONE_TIME_CREDITS.amount,
              },
            },
          });

          console.log(
            `✅ User ${userId} purchased ${ONE_TIME_CREDITS.amount} credits`
          );
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) break;

        // Check if subscription was cancelled
        if (subscription.cancel_at_period_end) {
          console.log(
            `⚠️ User ${user.id} subscription will cancel at period end`
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) break;

        // Downgrade to FREE
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "FREE",
            stripeSubscriptionId: null,
          },
        });

        console.log(`⬇️ User ${user.id} downgraded to FREE`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.error("Payment failed for invoice:", invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
