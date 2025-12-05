import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { referralCode } = await req.json();

    if (!referralCode || typeof referralCode !== "string") {
      return NextResponse.json(
        { error: "Codice referral non valido" },
        { status: 400 }
      );
    }

    // Check if user already has a referrer
    const currentUserData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { referredBy: true },
    });

    if (currentUserData?.referredBy) {
      return NextResponse.json(
        { error: "Hai già usato un codice referral" },
        { status: 400 }
      );
    }

    // Find referrer by code
    const referrer = await prisma.user.findUnique({
      where: { referralCode: referralCode.toUpperCase() },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Codice referral non trovato" },
        { status: 404 }
      );
    }

    // Can't refer yourself
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: "Non puoi usare il tuo stesso codice!" },
        { status: 400 }
      );
    }

    // Update current user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        referredBy: referralCode.toUpperCase(),
        bonusCredits: { increment: 2 }, // Give 2 bonus credits to new user
      },
    });

    // Give 3 bonus credits to referrer
    await prisma.user.update({
      where: { id: referrer.id },
      data: {
        bonusCredits: { increment: 3 },
      },
    });

    // Track referral
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredEmail: user.emailAddresses[0]?.emailAddress || "unknown",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Codice applicato! Hai ricevuto 2 decodifiche bonus!",
    });
  } catch (error) {
    console.error("Referral apply error:", error);
    return NextResponse.json(
      { error: "Errore nell'applicazione del codice" },
      { status: 500 }
    );
  }
}
