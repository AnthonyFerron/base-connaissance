import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT /api/pokemon/[id]/comments/[commentId] : modifier un commentaire
export async function PUT(request, context) {
  const params = await context.params;
  const { commentId } = params;

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

    if (!texte?.trim()) {
      return NextResponse.json({ error: "Texte requis" }, { status: 400 });
    }

    // Récupérer le commentaire
    const comment = await prisma.commentaire.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur du commentaire
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez modifier que vos propres commentaires" },
        { status: 403 }
      );
    }

    // Mettre à jour le commentaire
    const updatedComment = await prisma.commentaire.update({
      where: { id: Number(commentId) },
      data: { text: texte },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Erreur API PUT /comments/[commentId] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/pokemon/[id]/comments/[commentId] : supprimer un commentaire
export async function DELETE(request, context) {
  const params = await context.params;
  const { commentId } = params;

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

    // Récupérer le commentaire
    const comment = await prisma.commentaire.findUnique({
      where: { id: Number(commentId) },
      include: {
        author: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur OU admin
    if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Vous ne pouvez supprimer que vos propres commentaires" },
        { status: 403 }
      );
    }

    // Supprimer le commentaire
    await prisma.commentaire.delete({
      where: { id: Number(commentId) },
    });

    return NextResponse.json({ message: "Commentaire supprimé" });
  } catch (error) {
    console.error("Erreur API DELETE /comments/[commentId] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
