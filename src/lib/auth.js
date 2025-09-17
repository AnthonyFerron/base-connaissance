
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

console.log("Better Auth config", {
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true }
});


let auth;
try {
  auth = betterAuth({
    basePath: "/api/auth",
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      // Removed custom onSignUp handler, revert to default Better Auth behavior
    },
    plugins: [nextCookies()],
  });
  console.log("Better Auth initialized", auth);
} catch (e) {
  console.error("Better Auth initialization error:", e);
}

export { auth };
