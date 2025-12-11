"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaUserCircle, FaPen } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AdminHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [pseudoValue, setPseudoValue] = useState("");

  // Initialiser le pseudo quand le user change
  useEffect(() => {
    if (user?.name) {
      setPseudoValue(user.name);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Force le rechargement complet pour nettoyer la session
            window.location.href = "/login";
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  const handleSavePseudo = async () => {
    // TODO: Implement save pseudo API call
    console.log("Saving pseudo:", pseudoValue);
    setIsEditingPseudo(false);
    // API call here to update user name
  };

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openProfile && !e.target.closest(".profile-menu")) {
        setOpenProfile(false);
        setIsEditingPseudo(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openProfile]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center gap-3"
          >
            <Image
              src="/images/logo.png"
              alt="PokéDoc logo"
              width={40}
              height={40}
              className="h-auto"
              draggable="false"
              priority
            />
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>

          {/* Profile Button */}
          <div className="relative profile-menu">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaUserCircle className="text-2xl text-gray-700" />
              <span className="text-gray-700 font-medium">
                {user?.name || user?.email || "Admin"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {openProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Pseudo section */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-500 text-sm">Pseudo</p>
                    {!isEditingPseudo && (
                      <button
                        onClick={() => setIsEditingPseudo(true)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaPen className="text-sm" />
                      </button>
                    )}
                  </div>

                  {!isEditingPseudo ? (
                    <p className="text-gray-900 font-semibold text-lg">
                      {user?.name || "Admin"}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={pseudoValue}
                        onChange={(e) => setPseudoValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-semibold"
                        autoFocus
                      />
                      <button
                        onClick={handleSavePseudo}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  )}
                </div>

                {/* Email section */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <p className="text-gray-500 text-sm mb-1">Adresse e-mail</p>
                  <p className="text-gray-900 font-semibold">
                    {user?.email || "email@example.com"}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 mb-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Déconnexion
                  </button>

                  <button
                    onClick={() => {
                      // TODO: Implement account deletion
                      if (
                        confirm(
                          "Êtes-vous sûr de vouloir supprimer votre compte ?"
                        )
                      ) {
                        console.log("Delete account");
                      }
                    }}
                    className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Supprimer ce compte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
