import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    const cookieHeader = request.headers.get("cookie");
    let userId = null;
    let userRole = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});

      const rawSessionToken =
        cookies["better-auth.session_token"] ||
        cookies["better_auth.session_token"] ||
        cookies["session_token"];

      if (rawSessionToken) {
        try {
          const sessionToken = rawSessionToken.split(".")[0];

          const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true },
          });

          if (session && session.user) {
            userId = session.user.id;
            userRole = session.user.role;
          }
        } catch (error) {
          console.error("Erreur récupération session:", error);
        }
      }
    }

    if (!userId || userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const requestData = await prisma.request.findUnique({
      where: { id: parseInt(id) },
      include: {
        types: true,
      },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: "Demande non trouvée" },
        { status: 404 }
      );
    }

    if (requestData.status !== "EN_ATTENTE") {
      return NextResponse.json(
        { error: "Cette demande a déjà été traitée" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      await prisma.request.update({
        where: { id: parseInt(id) },
        data: { status: "REFUSEE" },
      });

      return NextResponse.json({
        message: "Demande refusée avec succès",
      });
    }

    if (action === "accept") {
      if (requestData.actionType === "AJOUT") {
        const newPokemon = await prisma.pokemon.create({
          data: {
            name: requestData.name,
            photo: requestData.photo,
            content: requestData.content,
            generationId: requestData.content.generationId,
            types: {
              connect: requestData.types.map((type) => ({ id: type.id })),
            },
          },
        });

        await prisma.request.update({
          where: { id: parseInt(id) },
          data: {
            status: "ACCEPTEE",
            pokemonId: newPokemon.id,
          },
        });

        return NextResponse.json({
          message: "Pokémon créé avec succès",
          pokemon: newPokemon,
        });
      } else if (requestData.actionType === "MODIFICATION") {
        if (!requestData.pokemonId) {
          return NextResponse.json(
            { error: "Pokémon cible non spécifié" },
            { status: 400 }
          );
        }

        const updatedPokemon = await prisma.pokemon.update({
          where: { id: requestData.pokemonId },
          data: {
            name: requestData.name,
            photo: requestData.photo,
            content: requestData.content,
            generationId: requestData.content.generationId,
            types: {
              set: [],
              connect: requestData.types.map((type) => ({ id: type.id })),
            },
          },
        });

        await prisma.request.update({
          where: { id: parseInt(id) },
          data: { status: "ACCEPTEE" },
        });

        return NextResponse.json({
          message: "Pokémon modifié avec succès",
          pokemon: updatedPokemon,
        });
      }
    }

    return NextResponse.json({ error: "Action non valide" }, { status: 400 });
  } catch (error) {
    console.error("Erreur lors du traitement de la demande:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
