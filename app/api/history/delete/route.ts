import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    if (deleteAll) {
      // Delete all history for user
      await prisma.decodeHistory.deleteMany({
        where: { userId: user.id },
      });

      return NextResponse.json({
        success: true,
        message: "Cronologia eliminata completamente",
      });
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID mancante" },
        { status: 400 }
      );
    }

    // Verify ownership before deleting
    const item = await prisma.decodeHistory.findUnique({
      where: { id },
    });

    if (!item || item.userId !== user.id) {
      return NextResponse.json(
        { error: "Non trovato o non autorizzato" },
        { status: 404 }
      );
    }

    // Delete single item
    await prisma.decodeHistory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Elemento eliminato",
    });
  } catch (error) {
    console.error("Error deleting history:", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione" },
      { status: 500 }
    );
  }
}
