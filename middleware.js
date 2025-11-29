import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // ✅ ton instance Better Auth côté serveur

export async function middleware(req) {
  const session = await auth.api.getSession({ headers: req.headers });

  const { pathname } = req.nextUrl;

  // ✅ Pages accessibles sans connexion
  const publicPaths = ["/login", "/signup", "/api/auth"];

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // 🔒 Si pas connecté et page non publique → redirection signup
  if (!session?.user && !isPublic) {
    const signupUrl = new URL("/login", req.url);
    return NextResponse.redirect(signupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
