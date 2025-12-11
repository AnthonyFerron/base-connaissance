import { auth } from "./auth";

/**
 * Vérifie la session et retourne les informations utilisateur
 * @param {Request} request - La requête Next.js
 * @returns {Promise<{user: object|null, session: object|null}>}
 */
export async function getSession(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return session;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return { user: null, session: null };
  }
}

/**
 * Vérifie si l'utilisateur est admin
 * @param {Request} request - La requête Next.js
 * @returns {Promise<{isAdmin: boolean, user: object|null}>}
 */
export async function checkAdmin(request) {
  const { user } = await getSession(request);

  return {
    isAdmin: user?.role === "ADMIN",
    user,
  };
}
