"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers"

//Exposer une route /api/auth/me pour retourner l’utilisateur courant.
//Sert au AuthProvider (checkAuth()) pour vérifier si quelqu’un est connecté.

export async function GET(req) {
  const session = await auth.api.getSession({
        headers: await headers()
    });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(session.user), {
    headers: { "Content-Type": "application/json" },
  });
}