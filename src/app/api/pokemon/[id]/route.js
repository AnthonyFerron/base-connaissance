import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/pokemon/[id] : retourne un pokemon par id avec types + generation
export async function GET(request, context) {
  const params = await context.params;
  const { id } = params;
  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: Number(id) },
      include: {
        types: true,
        generation: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!pokemon) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }
    return NextResponse.json(pokemon);
  } catch (error) {
    console.error("Erreur API /pokemon/[id] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
