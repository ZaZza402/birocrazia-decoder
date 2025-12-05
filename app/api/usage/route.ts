import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan, getUserUsage, PLANS } from "@/lib/plans";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const planType = await getUserPlan(user.id);
    const plan = PLANS[planType];
    const usage = await getUserUsage(user.id);

    return NextResponse.json({
      ...usage,
      planName: plan.name,
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dei dati" },
      { status: 500 }
    );
  }
}
