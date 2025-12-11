"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import NavBar from "@/app/components/NavBar";

export default function AdminPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      router.push("/login");
      return;
    }

    if (data.user.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [data, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!data?.user || data.user.role !== "ADMIN") {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panneau d'administration</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/admin/requests")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Gestion des demandes</h2>
            <p className="text-gray-600">
              Consulter et valider les demandes d'ajout et de modification de
              Pokémon
            </p>
          </div>

          <div
            onClick={() => router.push("/admin/users")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              Gestion des utilisateurs
            </h2>
            <p className="text-gray-600">
              Gérer les utilisateurs et leurs permissions
            </p>
          </div>

          <div
            onClick={() => router.push("/admin/quiz")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Gestion des quiz</h2>
            <p className="text-gray-600">
              Ajouter, modifier et supprimer des questions de quiz
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
