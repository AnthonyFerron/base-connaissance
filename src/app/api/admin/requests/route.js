import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth-helpers";

export async function GET(request) {
  try {
    const { isAdmin, user } = await checkAdmin(request);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const requests = await prisma.request.findMany({
      include: {
        types: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pokemon: true,
      },
      orderBy: {
        proposedDate: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
