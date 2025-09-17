
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";

let auth;
try {
  auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      // Removed custom onSignUp handler, revert to default Better Auth behavior
    },
    plugins: [
      nextCookies() // toujours laisser en dernier
    ],
  });
} catch (e) {
  console.error("Better Auth initialization error:", e);
}

export { auth };
