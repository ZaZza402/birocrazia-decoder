export type Plan = "FREE" | "STARTER" | "PRO";

export const PLANS = {
  FREE: {
    id: "FREE" as const,
    name: "Cittadino (Plebeo)",
    price: 0,
    stripePriceId: null,
    limits: {
      monthlyDecodes: 3,
      historyEnabled: false,
    },
  },
  STARTER: {
    id: "STARTER" as const,
    name: "Senatore (Corrotto)",
    price: 4.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || null, // Set in .env
    limits: {
      monthlyDecodes: 30,
      historyEnabled: true,
    },
  },
  PRO: {
    id: "PRO" as const,
    name: "Imperatore (Intoccabile)",
    price: 9.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || null, // Set in .env
    limits: {
      monthlyDecodes: Infinity,
      historyEnabled: true,
    },
  },
};

// One-time credit purchase
export const ONE_TIME_CREDITS = {
  amount: 5, // 5 extra decodes
  price: 1.49,
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS || null,
};
