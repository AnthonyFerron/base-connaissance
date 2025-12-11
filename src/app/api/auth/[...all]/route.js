import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth.handler);

// Fonction pour traduire les erreurs Better Auth
function translateAuthError(errorMessage) {
  if (!errorMessage) return "Erreur inconnue";

  const msg = errorMessage.toLowerCase();

  // Erreurs de connexion
  if (
    msg.includes("invalid") ||
    msg.includes("incorrect") ||
    msg.includes("wrong")
  ) {
    return "Email ou mot de passe incorrect";
  }
  if (
    msg.includes("not found") ||
    msg.includes("does not exist") ||
    msg.includes("no user")
  ) {
    return "Aucun compte trouvé avec cet email";
  }

  // Erreurs d'inscription
  if (
    msg.includes("already") ||
    msg.includes("exists") ||
    msg.includes("duplicate")
  ) {
    return "Cet email est déjà utilisé";
  }
  if (msg.includes("invalid email")) {
    return "L'adresse email n'est pas valide";
  }
  if (
    msg.includes("password") &&
    (msg.includes("short") || msg.includes("weak") || msg.includes("must be"))
  ) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }

  // Erreurs de champs requis
  if (msg.includes("email") && msg.includes("required")) {
    return "L'email est requis";
  }
  if (msg.includes("password") && msg.includes("required")) {
    return "Le mot de passe est requis";
  }

  // Message par défaut avec le message original pour débogage
  console.log("🔴 Message d'erreur non traduit:", errorMessage);
  return errorMessage;
}

// --- ROUTE /signup ---
async function handleSignup(request) {
  console.log("🔴 SIGNUP: Route appelée");
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    let result;
    try {
      result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: name || email.split("@")[0],
        },
      });
    } catch (authError) {
      // Better Auth a lancé une exception
      console.log("🔴 SIGNUP: Exception de Better Auth =", authError);
      const translatedError = translateAuthError(authError.message);
      return NextResponse.json({ error: translatedError }, { status: 400 });
    }

    const { user, error } = result;

    if (error) {
      const translatedError = translateAuthError(error.message);
      return NextResponse.json({ error: translatedError }, { status: 400 });
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("🔴 SIGNUP: Exception inattendue:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

// --- ROUTE /signin ---
async function handleSignin(request) {
  console.log("🔴 SIGNIN: Route appelée");
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log("🔴 SIGNIN: Email =", email);

    if (!email || !password) {
      console.log("🔴 SIGNIN: Email ou mot de passe manquant");
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    console.log("🔴 SIGNIN: Appel de auth.api.signInEmail...");

    let result;
    try {
      result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });
    } catch (authError) {
      // Better Auth a lancé une exception
      console.log("🔴 SIGNIN: Exception de Better Auth =", authError);
      const translatedError = translateAuthError(authError.message);
      return NextResponse.json({ error: translatedError }, { status: 400 });
    }

    const { user, error } = result;
    console.log("🔴 SIGNIN: user =", user ? "OK" : "null");
    console.log("🔴 SIGNIN: error =", error);

    if (error) {
      const translatedError = translateAuthError(error.message);
      console.log("🔴 SIGNIN: Erreur traduite =", translatedError);
      return NextResponse.json({ error: translatedError }, { status: 400 });
    }

    if (!user) {
      console.log("🔴 SIGNIN: Pas d'utilisateur retourné");
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 400 }
      );
    }

    console.log("🔴 SIGNIN: Connexion réussie");
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("🔴 SIGNIN: Exception inattendue:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
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

export const GET = handler.GET;
