import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth-helpers";

// PATCH - Modifier le rôle d'un utilisateur
export async function PATCH(request, { params }) {
  try {
    const { isAdmin } = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { role } = await request.json();

    if (!["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher un admin de se retirer ses propres droits
    if (user.id === admin.id && role === "USER") {
      return NextResponse.json(
        {
          error:
            "Vous ne pouvez pas retirer vos propres droits d'administrateur",
        },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Rôle modifié avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la modification du rôle:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request, { params }) {
  try {
    const { isAdmin, user: adminUser } = await checkAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher un admin de se supprimer lui-même
    if (user.id === adminUser.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      );
    }

    // Supprimer l'utilisateur (cascade sur comments et requests)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
