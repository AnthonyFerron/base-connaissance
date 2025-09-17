"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function DashboardLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogout}>
      <button type="submit" disabled={loading}>
        {loading ? "Déconnexion..." : "Se déconnecter"}
      </button>
    </form>
  );
}
