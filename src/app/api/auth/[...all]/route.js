import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth.handler);

// --- ROUTE /signup ---
async function handleSignup(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const { user, error } = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split("@")[0],
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erreur lors de l'inscription" },
        { status: 400 }
      );
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("Erreur signup:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// --- ROUTE /signin ---
async function handleSignin(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const { user, error } = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erreur lors de la connexion" },
        { status: 400 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Erreur signin:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  const url = new URL(request.url);

  if (url.pathname === "/api/auth/signup") {
    return handleSignup(request);
  }

  if (url.pathname === "/api/auth/signin") {
    return handleSignin(request);
  }

  return handler.POST(request);
}
