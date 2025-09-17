"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAuthForm() {
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
        // Sign up: POST to /api/auth/sign-up/email (Better Auth expects only email and password)
        const res = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pseudo, email, password }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.error ||
              data?.message ||
              "Erreur lors de la création du compte"
          );
        setSuccess(
          "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
        );
        setMode("in");
        // TODO: If you want to set pseudo, call a user update endpoint after registration
      } else {
        // Login: POST to /api/auth/sign-in/email
        const loginId = email || pseudo;
        const res = await fetch("/api/auth/sign-in/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: loginId, password }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.error || data?.message || "Erreur lors de la connexion"
          );
        router.refresh();
      }
    } catch (err) {
      setLocalError(err?.message || "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }

  const error = localError;

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "grid", gap: 8, maxWidth: 320 }}
    >
      {/* pseudo field removed for registration */}
      <input
        name="email"
        type="email"
        placeholder="email"
        required={mode === "up"}
        autoComplete="username"
      />
      {/* pseudo field removed for login as well, only email+password allowed */}
      <input
        name="password"
        type="password"
        placeholder="mot de passe"
        required
        autoComplete="current-password"
      />
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
