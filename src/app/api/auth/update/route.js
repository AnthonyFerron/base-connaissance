import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/auth/update
export async function POST(req) {
  try {
    const session = await auth.api.getSession({ req });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await req.json();

    //On ne prend que les champs qu'on autorise
    const allowedFields = ["name", "email", "role"];
    const updateData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée valide à mettre à jour" },
        { status: 400 }
      );
    }

    // ✅ Mettre à jour dans la DB via better-auth
    const updatedUser = await auth.api.updateUser({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Utilisateur mis à jour", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur update user:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
