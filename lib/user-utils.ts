import prisma from "./db";
import { Plan, PLANS } from "./plans";

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
