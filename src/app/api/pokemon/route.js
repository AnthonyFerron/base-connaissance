import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        types: true,
        generation: true,
      },
    });

    // Trier par numéro de Pokédex (dans content.idpokedex)
    const sortedPokemons = pokemons.sort((a, b) => {
      const idA = a.content?.idpokedex || 0;
      const idB = b.content?.idpokedex || 0;
      return idA - idB;
    });

    return NextResponse.json(sortedPokemons);
  } catch (error) {
    console.error("Erreur API /pokemons:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const nom = formData.get("nom");
    const idPokedex = parseInt(formData.get("idPokedex"));
    const generationId = parseInt(formData.get("generationId"));
    const description = formData.get("description");
    const typeIds = formData.get("typeIds");
    const photo = formData.get("photo");

    if (!nom || !idPokedex || !generationId || !description || !typeIds) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const parsedTypeIds = JSON.parse(typeIds);

    if (parsedTypeIds.length === 0 || parsedTypeIds.length > 2) {
      return NextResponse.json(
        { error: "Un Pokémon doit avoir entre 1 et 2 types" },
        { status: 400 }
      );
    }

    const existingPokemon = await prisma.pokemon.findUnique({
      where: { name: nom },
    });

    if (existingPokemon) {
      return NextResponse.json(
        { error: "Un Pokémon avec ce nom existe déjà" },
        { status: 409 }
      );
    }

    let photoUrl = "";
    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

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

      await writeFile(filePath, buffer);
      photoUrl = `/images/pokemon/${fileName}`;
    } else {
      photoUrl = "/images/pokemon/default.png";
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
        { error: "Vous devez être connecté pour créer une demande" },
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
          generationId: generationId,
        },
        actionType: "AJOUT",
        status: "EN_ATTENTE",
        authorId: userId,
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
      },
    });

    return NextResponse.json(
      {
        message:
          "Demande de création envoyée avec succès. Elle sera examinée par un administrateur.",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du Pokémon:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création", details: error.message },
      { status: 500 }
    );
  }
}
