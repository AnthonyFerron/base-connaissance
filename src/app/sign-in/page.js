"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const [mode, setMode] = useState("in"); // "in" (login) | "up" (signup)
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError("");
    setSuccess("");
    setIsLoading(true);
    const f = new FormData(e.currentTarget);
    const pseudo = String(f.get("pseudo"));
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    try {
      if (mode === "up") {
        // Sign up using authClient
        const { data, error } = await authClient.signUp.email({
          name: pseudo,
          email,
          password,
        });
        if (error) throw new Error(error.message || "Erreur lors de la création du compte");
        setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setMode("in");
      } else {
        // Sign in using authClient (Better Auth expects only email and password)
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message || "Erreur lors de la connexion");
        router.push("/dashboard");
      }
    } catch (err) {
      setLocalError(err?.message || "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }

  const error = localError;

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
      {mode === "up" && (
        <input name="pseudo" type="text" placeholder="pseudo" required />
      )}
      <input
        name="email"
        type="email"
        placeholder="email"
        required={mode === "up"}
        autoComplete="username"
      />
      {/*
        Better Auth expects only email and password for sign-in.
        If you want to allow pseudo, you must implement your own logic to map pseudo to email.
      */}
      <input name="password" type="password" placeholder="mot de passe" required autoComplete="current-password" />
      <button disabled={isLoading}>
        {mode === "up" ? "Créer un compte" : "Se connecter"}
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setLocalError("");
          setSuccess("");
        }}
      >
        {mode === "in" ? "Créer un compte" : "J’ai déjà un compte"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}
