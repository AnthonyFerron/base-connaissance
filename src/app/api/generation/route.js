import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Récupérer toutes les générations
export async function GET() {
  try {
    const generations = await prisma.generation.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(generations);
  } catch (error) {
    console.error("Erreur API /generations:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
