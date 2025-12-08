import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

// Créer une demande de modification de Pokémon (Request)
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extraction des données
    const pokemonId = parseInt(formData.get("pokemonId"));
    const nom = formData.get("nom");
    const idPokedex = parseInt(formData.get("idPokedex"));
    const generationId = parseInt(formData.get("generationId"));
    const description = formData.get("description");
    const typeIds = formData.get("typeIds");
    const photo = formData.get("photo");
    const currentPhoto = formData.get("currentPhoto");

    // Validation des champs requis
    if (
      !pokemonId ||
      !nom ||
      !idPokedex ||
      !generationId ||
      !description ||
      !typeIds
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Parser les IDs des types
    const parsedTypeIds = JSON.parse(typeIds);

    // Valider qu'il y a au moins 1 type et max 2 types
    if (parsedTypeIds.length === 0 || parsedTypeIds.length > 2) {
      return NextResponse.json(
        { error: "Un Pokémon doit avoir entre 1 et 2 types" },
        { status: 400 }
      );
    }

    // Gestion de l'upload de l'image
    let photoUrl = currentPhoto || "";
    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const fileName = `${nom
        .toLowerCase()
        .replace(/\s+/g, "-")}-${timestamp}.${photo.type.split("/")[1]}`;
      const filePath = join(
        process.cwd(),
        "public",
        "images",
        "pokemon",
        fileName
      );

      // Sauvegarder le fichier
      await writeFile(filePath, buffer);
      photoUrl = `/images/pokemon/${fileName}`;
    }

    const cookieHeader = request.headers.get("cookie");
    let userId = null;

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
          }
        } catch (error) {
          console.error("Erreur récupération session:", error);
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Vous devez être connecté pour créer une demande de modification",
        },
        { status: 401 }
      );
    }

    const newRequest = await prisma.request.create({
      data: {
        name: nom,
        photo: photoUrl,
        content: {
          idpokedex: idPokedex,
          description: description,
        },
        generationId: parseInt(generationId),
        actionType: "MODIFICATION",
        status: "EN_ATTENTE",
        authorId: userId,
        pokemonId: pokemonId, // Lié au Pokémon existant
        types: {
          connect: parsedTypeIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        types: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pokemon: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message:
          "Demande de modification envoyée avec succès. Elle sera examinée par un administrateur.",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création", details: error.message },
      { status: 500 }
    );
  }
}
