import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie");

    console.log("=== TEST SESSION ===");
    console.log("Cookie header:", cookieHeader);

    if (!cookieHeader) {
      return NextResponse.json({ error: "Pas de cookies" }, { status: 401 });
    }

    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

    const rawSessionToken =
      cookies["better-auth.session_token"] ||
      cookies["better_auth.session_token"] ||
      cookies["session_token"];

    if (!rawSessionToken) {
      return NextResponse.json(
        { error: "Pas de token de session" },
        { status: 401 }
      );
    }

    const sessionToken = rawSessionToken.split(".")[0];

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    console.log("Session trouvée:", session);

    if (!session) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Session valide",
      user: session.user,
      sessionInfo: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Erreur test session:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
