import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Récupérer toutes les questions
export async function GET(request) {
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

    const questions = await prisma.quizQuestion.findMany({
      include: {
        answers: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Erreur GET quiz:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Créer une nouvelle question
export async function POST(request) {
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

    // Créer la question avec ses réponses
    const newQuestion = await prisma.quizQuestion.create({
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

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Erreur POST quiz:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
