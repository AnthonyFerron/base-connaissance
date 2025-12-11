import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth-helpers";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    const { isAdmin } = await checkAdmin(request);

    if (!isAdmin) {
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
        // Le content ne contient que idpokedex et description
        const parsedContent =
          typeof requestData.content === "object"
            ? requestData.content
            : JSON.parse(requestData.content);

        const pokemonContent = {
          idpokedex: parsedContent.idpokedex,
          description: parsedContent.description,
        };

        const newPokemon = await prisma.pokemon.create({
          data: {
            name: requestData.name,
            photo: requestData.photo,
            content: pokemonContent,
            generation: {
              connect: { id: requestData.generationId },
            },
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

        // Le content ne contient que idpokedex et description
        const parsedContent =
          typeof requestData.content === "object"
            ? requestData.content
            : JSON.parse(requestData.content);

        const pokemonContent = {
          idpokedex: parsedContent.idpokedex,
          description: parsedContent.description,
        };

        const updatedPokemon = await prisma.pokemon.update({
          where: { id: requestData.pokemonId },
          data: {
            name: requestData.name,
            photo: requestData.photo,
            content: pokemonContent,
            generation: {
              connect: { id: requestData.generationId },
            },
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
