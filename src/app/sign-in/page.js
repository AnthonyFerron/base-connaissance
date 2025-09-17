"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [mode, setMode] = useState("in"); // "in" (login) | "up" (signup)
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  const { signInEmail, isLoading: loadingIn, error: errorIn } = authClient.useSignInEmail();
  const { signUpEmail, isLoading: loadingUp, error: errorUp } = authClient.useSignUpEmail();

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError("");
    setSuccess("");
    const f = new FormData(e.currentTarget);
    const pseudo = String(f.get("pseudo"));
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    try {
      if (mode === "up") {
        await signUpEmail({ pseudo, email, password });
        setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setMode("in");
      } else {
        const loginId = email || pseudo;
        await signInEmail({ login: loginId, password });
        router.push("/dashboard");
      }
    } catch (err) {
      setLocalError(err?.message || "Erreur inconnue");
    }
  }

  const isLoading = loadingIn || loadingUp;
  const error = localError || errorIn?.message || errorUp?.message;

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
      {mode === "in" && (
        <input
          name="pseudo"
          type="text"
          placeholder="pseudo (ou laissez email)"
          autoComplete="username"
        />
      )}
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
