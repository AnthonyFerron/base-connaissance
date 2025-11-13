"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function AdminRequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("EN_ATTENTE");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Utiliser l'API pour récupérer le rôle
        const response = await fetch("/api/auth/test-session");

        console.log("Response status:", response.status);

        if (!response.ok) {
          console.log("Pas authentifié, redirection vers login");
          router.push("/login");
          return;
        }

        const data = await response.json();
        console.log("Données utilisateur:", data);
        console.log("Role:", data.user?.role);

        if (!data.user) {
          console.log("Pas d'utilisateur, redirection vers login");
          router.push("/login");
          return;
        }

        if (data.user.role !== "ADMIN") {
          console.log(
            "Pas admin (role =",
            data.user.role,
            "), redirection vers accueil"
          );
          router.push("/");
          return;
        }

        console.log("Admin vérifié, chargement des requests");
        setUser(data.user);
        fetchRequests();
      } catch (error) {
        console.error("Erreur checkAuth:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchRequests();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
      alert("Erreur lors de l'action");
    }
  };

  const filteredRequests = requests.filter((req) => req.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des demandes</h1>
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Retour
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter("EN_ATTENTE")}
          className={`px-4 py-2 rounded ${
            filter === "EN_ATTENTE"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          En attente ({requests.filter((r) => r.status === "EN_ATTENTE").length}
          )
        </button>
        <button
          onClick={() => setFilter("ACCEPTEE")}
          className={`px-4 py-2 rounded ${
            filter === "ACCEPTEE"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Acceptées ({requests.filter((r) => r.status === "ACCEPTEE").length})
        </button>
        <button
          onClick={() => setFilter("REFUSEE")}
          className={`px-4 py-2 rounded ${
            filter === "REFUSEE"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Refusées ({requests.filter((r) => r.status === "REFUSEE").length})
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucune demande{" "}
          {filter === "EN_ATTENTE"
            ? "en attente"
            : filter === "ACCEPTEE"
            ? "acceptée"
            : "refusée"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4"
              style={{
                borderLeftColor:
                  request.status === "EN_ATTENTE"
                    ? "#3b82f6"
                    : request.status === "ACCEPTEE"
                    ? "#10b981"
                    : "#ef4444",
              }}
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={request.photo}
                    alt={request.name}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {request.name}
                        <span
                          className={`ml-3 text-sm px-3 py-1 rounded ${
                            request.actionType === "AJOUT"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {request.actionType}
                        </span>
                      </h2>
                      <p className="text-gray-600">
                        Par {request.author.name || request.author.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.proposedDate).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      <strong>N° Pokédex:</strong> {request.content.idpokedex}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Description:</strong>{" "}
                      {request.content.description}
                    </p>
                    <div className="flex gap-2 mb-2">
                      <strong>Types:</strong>
                      {request.types.map((type) => (
                        <span
                          key={type.id}
                          className="px-3 py-1 rounded text-white"
                          style={{ backgroundColor: type.color }}
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {request.status === "EN_ATTENTE" && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleAction(request.id, "accept")}
                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => handleAction(request.id, "reject")}
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
