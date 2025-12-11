"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "flowbite-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateUser, deleteAccount, logout } = useAuth();
  const router = useRouter();
  const [pseudo, setPseudo] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Update pseudo
  const handlePseudoUpdate = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);
      await updateUser({ name: pseudo });
      setSuccess("Pseudo mis à jour !");
    } catch (err) {
      setError("Impossible de mettre à jour le pseudo");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  // ✅ Suppression logique du compte
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action marquera votre compte comme supprimé."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteAccount();
      router.push("/login");
    } catch (err) {
      setError("Erreur lors de la suppression du compte");
      console.error("Erreur suppression compte:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white p-6 rounded-xl shadow-md border">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <Image
          src="/images/logo.png"
          alt="PokéDoc logo"
          width={64}
          height={64}
          className="h-auto"
          draggable="false"
          priority
        />
        <h1 className="text-3xl font-bold ml-2">Mon Profil</h1>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500">Adresse e-mail</label>
        <p className="font-medium">{user.email}</p>
      </div>

      {/* Pseudo */}
      <div className="mb-6">
        <label className="block text-sm text-gray-500 mb-1">Pseudo</label>
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#EC533A]"
          disabled={loading}
        />
        <Button
          onClick={handlePseudoUpdate}
          isProcessing={loading}
          className="mt-2 bg-[#EC533A] hover:bg-orange-700 text-white"
        >
          Mettre à jour
        </Button>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <hr className="my-4" />

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleLogout}
          className="w-full bg-gray-200 text-black hover:bg-gray-300"
        >
          Déconnexion
        </Button>

        <Button
          onClick={handleDeleteAccount}
          className="w-full bg-red-500 text-white hover:bg-red-600"
        >
          Supprimer mon compte
        </Button>
      </div>
    </div>
  );
}
