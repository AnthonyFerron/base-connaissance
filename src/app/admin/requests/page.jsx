"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { FaCheckCircle, FaTimesCircle, FaClock, FaEye } from "react-icons/fa";
import NavBar from "@/app/components/NavBar";

export default function AdminRequestsPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilters, setStatusFilters] = useState({
    VALIDE: true,
    REJETE: false,
    EN_ATTENTE: true,
  });
  const [typeFilters, setTypeFilters] = useState({
    AJOUT: true,
    MODIFICATION: true,
  });

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

    fetchRequests();
  }, [isPending, data, router]);

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

  const toggleStatusFilter = (status) => {
    setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const toggleTypeFilter = (type) => {
    setTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const getStatusKey = (status) => {
    if (status === "ACCEPTEE") return "VALIDE";
    if (status === "REFUSEE") return "REJETE";
    return "EN_ATTENTE";
  };

  const filteredRequests = requests.filter((req) => {
    const statusKey = getStatusKey(req.status);
    const statusMatch = statusFilters[statusKey];
    const typeMatch = typeFilters[req.actionType];
    return statusMatch && typeMatch;
  });

  const getStatusIcon = (status) => {
    if (status === "ACCEPTEE")
      return <FaCheckCircle className="text-green-500 text-2xl" />;
    if (status === "REFUSEE")
      return <FaTimesCircle className="text-red-500 text-2xl" />;
    return <FaClock className="text-orange-500 text-2xl" />;
  };

  const getActionText = (actionType) => {
    if (actionType === "AJOUT") return "A créé la Fiche";
    if (actionType === "MODIFICATION")
      return "A fait une modification sur la Fiche";
    return "A ajouté un commentaire à la Fiche";
  };

  if (isPending || loading) {
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
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Gestion des demandes</h1>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h3 className="font-semibold text-lg mb-4">Status</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilters.VALIDE}
                      onChange={() => toggleStatusFilter("VALIDE")}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-3 text-gray-700">Validé</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilters.REJETE}
                      onChange={() => toggleStatusFilter("REJETE")}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700">Rejeté</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilters.EN_ATTENTE}
                      onChange={() => toggleStatusFilter("EN_ATTENTE")}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">
                      demande de validation
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Type de demande</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={typeFilters.AJOUT}
                      onChange={() => toggleTypeFilter("AJOUT")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">
                      Création de fiche
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={typeFilters.MODIFICATION}
                      onChange={() => toggleTypeFilter("MODIFICATION")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">
                      Modification de fiche
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
              {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
                  Aucune demande ne correspond aux filtres sélectionnés
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6 flex items-center gap-6">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {getStatusIcon(request.status)}
                        </div>

                        {/* User Info */}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {request.author.name || request.author.email}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {getActionText(request.actionType)} {request.name} !
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() =>
                              router.push(`/admin/requests/${request.id}`)
                            }
                            className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                          >
                            Vérifier <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
