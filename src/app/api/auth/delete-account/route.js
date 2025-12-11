import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST /api/auth/delete-account
export async function POST(req) {
  console.log("🔴 DELETE ACCOUNT: Route appelée");
  try {
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    console.log("🔴 DELETE ACCOUNT: Session =", session?.user?.id);

    if (!session?.user) {
      console.log("🔴 DELETE ACCOUNT: Non authentifié");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("🔴 DELETE ACCOUNT: Suppression de l'utilisateur", userId);

    // Suppression logique : modifier le compte pour le marquer comme supprimé
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: "deletedUser",
        email: `deleted-${userId}@pokeme.com`, // Email unique pour éviter les conflits
        role: "DELETED", // Utiliser la valeur de l'enum
      },
    });

    console.log("🔴 DELETE ACCOUNT: Utilisateur supprimé avec succès");

    // Pas besoin d'appeler signOut ici, le client s'en chargera
    return NextResponse.json(
      { message: "Compte supprimé avec succès", user: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔴 DELETE ACCOUNT: Erreur suppression compte:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}
