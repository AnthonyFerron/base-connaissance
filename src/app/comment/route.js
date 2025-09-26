import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Récupérer tous les commentaires avec auteur et pokemon
export async function GET() {
  try {
    const commentaires = await prisma.commentaire.findMany({
      include: {
        author: { select: { id: true, name: true } },
        pokemon: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(commentaires);
  } catch (error) {
    console.error("Erreur API /comment:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
