"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // 'signup' or 'login'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = await authClient.getSession();
      if (session?.user) {
        router.replace("/");
      }
    })();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    try {
      if (mode === "signup") {
        const { data, error } = await authClient.signUp.email({
          name: email.split("@")[0], // ou demander un champ prénom/pseudo
          email,
          password,
        });
        if (error)
          throw new Error(
            error.message || "Erreur lors de la création du compte"
          );
        setSuccess(
          "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
        );
        setMode("login");
      } else {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error)
          throw new Error(error.message || "Erreur lors de la connexion");
        router.push("/");
      }
    } catch (err) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[448px] h-[557px] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center px-8">
        <div className="flex items-end mb-8 -mt-4 select-none">
          <Image
            src="/images/logo.png"
            alt="PokéDoc logo"
            width={80}
            height={80}
            className="mr-2"
            draggable="false"
            priority
          />
          <span className="text-5xl font-bold ml-[-50px]">okéDoc</span>
        </div>
        <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EC533A] text-base"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EC533A] text-base"
              required
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#EC533A] hover:bg-[#d94a32] text-white font-semibold py-2 rounded-lg transition-colors text-lg shadow-sm border border-[#EC533A]"
            disabled={isLoading}
          >
            {isLoading
              ? mode === "signup"
                ? "Inscription..."
                : "Connexion..."
              : mode === "signup"
              ? "S’inscrire"
              : "Se connecter"}
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mt-2 text-sm">{success}</p>
        )}
        {mode === "signup" ? (
          <button
            type="button"
            className="w-full mt-4 border border-[#EC533A] text-[#EC533A] font-semibold py-2 rounded-lg hover:bg-[#fff4f2] transition-colors text-base"
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            disabled={isLoading}
          >
            J’ai déjà un compte ?
          </button>
        ) : (
          <button
            type="button"
            className="w-full mt-4 border border-[#EC533A] text-[#EC533A] font-semibold py-2 rounded-lg hover:bg-[#fff4f2] transition-colors text-base"
            onClick={() => {
              setMode("signup");
              setError("");
              setSuccess("");
            }}
            disabled={isLoading}
          >
            Je n’ai pas de compte
          </button>
        )}
      </div>
    </div>
  );
}
