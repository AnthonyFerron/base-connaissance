import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/pokemon/[id]/comments : récupère tous les commentaires du pokemon
export async function GET(request, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const comments = await prisma.commentaire.findMany({
      where: { pokemonId: Number(id) },
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
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erreur API /pokemon/[id]/comments :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/pokemon/[id]/comments : ajoute un nouveau commentaire
export async function POST(request, context) {
  const params = await context.params;
  const { id } = params;

  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { texte } = body;

    if (!texte) {
      return NextResponse.json({ error: "Texte requis" }, { status: 400 });
    }

    // Vérifier que le pokemon existe
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: Number(id) },
    });

    if (!pokemon) {
      return NextResponse.json(
        { error: "Pokemon non trouvé" },
        { status: 404 }
      );
    }

    // Créer le commentaire
    const newComment = await prisma.commentaire.create({
      data: {
        text: texte,
        authorId: session.user.id,
        pokemonId: Number(id),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Erreur API POST /pokemon/[id]/comments :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
