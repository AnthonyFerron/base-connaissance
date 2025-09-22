import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Récupérer tous les types
export async function GET() {
  try {
    const types = await prisma.type.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(types);
  } catch (error) {
    console.error("Erreur API /types:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
