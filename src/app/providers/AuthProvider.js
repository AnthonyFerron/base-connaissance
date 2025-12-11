"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ Vérifie l’utilisateur courant
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Déconnexion
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await checkAuth();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Inscription
  const signup = async ({ email, password }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur lors de l'inscription");
    }

    return await res.json();
  };

  // ✅ Connexion
  const signin = async ({ email, password }) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur lors de la connexion");
    }

    await checkAuth(); // recharge l’utilisateur
    return await res.json();
  };

  // ✅ Update utilisateur (pseudo, suppression logique, etc.)
  const updateUser = async (data) => {
    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update user");

      await checkAuth();

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // ✅ Suppression de compte
  const deleteAccount = async () => {
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la suppression du compte"
        );
      }

      setUser(null);
      return await response.json();
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        signup,
        signin,
        updateUser,
        deleteAccount,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
