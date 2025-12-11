import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/auth/delete-account
export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;

    // Suppression logique : modifier le compte pour le marquer comme supprimé
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: "deletedUser",
        email: `deleted-${userId}@pokeme.com`, // Email unique pour éviter les conflits
        role: "deleted",
      },
    });

    // Déconnecter l'utilisateur
    await auth.api.signOut({
      headers: Object.fromEntries(req.headers),
    });

    return NextResponse.json(
      { message: "Compte supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}
