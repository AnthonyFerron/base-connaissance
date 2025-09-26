import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Récupérer toutes les requests avec auteur, types et pokemon
export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      include: {
        author: { select: { id: true, name: true } },
        types: true,
        pokemon: { select: { id: true, name: true } },
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Erreur API /requests:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
