import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    let userId = null;
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
            userId = session.user.id;
            userRole = session.user.role;
          }
        } catch (error) {
          console.error("Erreur récupération session:", error);
        }
      }
    }

    if (!userId || userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        _count: {
          select: {
            comments: true,
            requests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
