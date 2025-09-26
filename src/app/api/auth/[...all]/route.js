import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth.handler);

// Ajout de la gestion de la route /me
async function handleMe(request) {
  const session = await auth.handleRequest(request);
  
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(session.user), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export const GET = async (request) => {
  const url = new URL(request.url);
  
  // Si c'est une requête vers /me
  if (url.pathname === '/api/auth/me') {
    return handleMe(request);
  }
  
  // Sinon, utiliser le handler par défaut
  return handler.GET(request);
};

export const POST = handler.POST;