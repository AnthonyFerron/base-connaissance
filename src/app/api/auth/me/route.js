import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.handleRequest(req);

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