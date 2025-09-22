import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Récupérer tous les pokemons avec leurs types + génération
export async function GET() {
  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        types: true,
        generation: true,
      },
      orderBy: {
        id: "asc", // pour trier par numéro de pokedex
      },
    });

    return NextResponse.json(pokemons);
  } catch (error) {
    console.error("Erreur API /pokemons:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
