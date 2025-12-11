import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth-helpers";

// PUT - Modifier une question
export async function PUT(request, { params }) {
  try {
    const { isAdmin } = await checkAdmin(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const { question, image, difficulty, answers } = await request.json();

    // Validation
    if (!question || !answers || answers.length !== 4) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const correctCount = answers.filter((a) => a.isCorrect).length;
    if (correctCount !== 1) {
      return NextResponse.json(
        { error: "Une seule réponse doit être correcte" },
        { status: 400 }
      );
    }

    // Supprimer les anciennes réponses
    await prisma.quizAnswer.deleteMany({
      where: { questionId: parseInt(id) },
    });

    // Mettre à jour la question avec les nouvelles réponses
    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: parseInt(id) },
      data: {
        question,
        image: image || null,
        difficulty: difficulty || "MOYEN",
        answers: {
          create: answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Erreur PUT quiz:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE - Supprimer une question
export async function DELETE(request, { params }) {
  try {
    const { isAdmin } = await checkAdmin(request);

    if (!isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;

    // Supprimer d'abord les réponses
    await prisma.quizAnswer.deleteMany({
      where: { questionId: parseInt(id) },
    });

    // Puis supprimer la question
    await prisma.quizQuestion.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE quiz:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
