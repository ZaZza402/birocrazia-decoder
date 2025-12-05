export type Plan = "FREE" | "STARTER" | "PRO";

export const PLANS = {
  FREE: {
    id: "FREE",
    name: "Cittadino (Plebeo)",
    price: 0,
    limits: {
      monthlyDecodes: 7,
      ocrEnabled: false,
      historyEnabled: false,
      storageEnabled: false,
    },
  },
  STARTER: {
    id: "STARTER",
    name: "Senatore (Corrotto)",
    price: 4.99,
    limits: {
      monthlyDecodes: 30,
      ocrEnabled: true,
      historyEnabled: true,
      storageEnabled: false, // Temporary storage only
    },
  },
  PRO: {
    id: "PRO",
    name: "Imperatore (Intoccabile)",
    price: 9.99,
    limits: {
      monthlyDecodes: Infinity,
      ocrEnabled: true,
      historyEnabled: true,
      storageEnabled: true,
    },
  },
};

// Mock function to check user subscription
// In a real app, this would check a database or Stripe
export async function getUserPlan(userId: string): Promise<Plan> {
  // TODO: Replace with real logic
  // For now, everyone is FREE unless hardcoded

  // Hardcode your user ID here if you want to test PRO features
  // You can find your ID in the dashboard or Clerk user profile
  const ADMIN_IDS = ["user_36O6XglFzqJIEcBuL9wH0Uooi1Z"]; // Add your ID here

  if (ADMIN_IDS.includes(userId)) {
    return "PRO";
  }

  return "FREE";
}
