import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT - Modifier une question
export async function PUT(request, { params }) {
  try {
    // Vérification session admin
    const cookieHeader = request.headers.get("cookie");
    let userRole = null;

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
            userRole = session.user.role;
          }
        } catch (error) {
          console.error("Erreur récupération session:", error);
        }
      }
    }

    if (userRole !== "ADMIN") {
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
    // Vérification session admin
    const cookieHeader = request.headers.get("cookie");
    let userRole = null;

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
            userRole = session.user.role;
          }
        } catch (error) {
          console.error("Erreur récupération session:", error);
        }
      }
    }

    if (userRole !== "ADMIN") {
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
