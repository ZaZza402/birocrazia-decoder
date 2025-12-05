import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    // Get user's referral code and stats
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        referralCode: true,
        bonusCredits: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    // Count successful referrals
    const referralCount = await prisma.referral.count({
      where: { referrerId: user.id },
    });

    return NextResponse.json({
      referralCode: userData.referralCode,
      bonusCredits: userData.bonusCredits,
      referralCount,
    });
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero delle statistiche" },
      { status: 500 }
    );
  }
}
