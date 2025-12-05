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

import prisma from "./db";

// Get user's plan from database
export async function getUserPlan(userId: string): Promise<Plan> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    return (user?.plan as Plan) || "FREE";
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "FREE";
  }
}

// Calculate user's available decodes for current month
export async function getUserUsage(userId: string): Promise<{
  used: number;
  limit: number;
  bonusCredits: number;
  canDecode: boolean;
}> {
  // Admin bypass - full access for testing
  if (userId === "user_36O6XglFzqJIEcBuL9wH0Uooi1Z") {
    return {
      used: 0,
      limit: 999999,
      bonusCredits: 999999,
      canDecode: true,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, bonusCredits: true },
    });

    if (!user) {
      return { used: 0, limit: 3, bonusCredits: 0, canDecode: true };
    }

    const plan = PLANS[(user.plan as Plan) || "FREE"];
    const limit = plan.limits.monthlyDecodes;

    // If unlimited, always can decode
    if (limit === Infinity) {
      return {
        used: 0,
        limit: Infinity,
        bonusCredits: user.bonusCredits,
        canDecode: true,
      };
    }

    // Count decodes in current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const used = await prisma.decodeHistory.count({
      where: {
        userId,
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    const totalAvailable = limit + user.bonusCredits;
    const canDecode = used < totalAvailable;

    return {
      used,
      limit,
      bonusCredits: user.bonusCredits,
      canDecode,
    };
  } catch (error) {
    console.error("Error calculating user usage:", error);
    return { used: 0, limit: 3, bonusCredits: 0, canDecode: false };
  }
}
