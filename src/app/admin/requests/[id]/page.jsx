"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import NavBar from "@/app/components/NavBar";
import ConfirmModal from "@/app/components/ConfirmModal";
import AlertModal from "@/app/components/AlertModal";
import { authClient } from "@/lib/auth-client";

export default function RequestDetailPage({ params }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    message: "",
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const getImageSrc = () => {
    if (!request) return "";

    // Si erreur d'image ou chemin local invalide, utiliser Pokemon.com
    if (imgError || !request.photo || request.photo.startsWith("/pokemon/")) {
      const pokedexId = request.content?.idpokedex || 1;
      const paddedId = String(pokedexId).padStart(3, "0");
      return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png`;
    }
    return request.photo;
  };

  useEffect(() => {
    const loadRequest = async () => {
      if (isPending) return;

      if (!data?.user || data.user.role !== "ADMIN") {
        router.push("/login");
        return;
      }

      try {
        const { id } = await params;

        // Charger la requête
        const response = await fetch(`/api/admin/requests`);
        if (response.ok) {
          const requestsData = await response.json();
          const foundRequest = requestsData.find((r) => r.id === parseInt(id));
          setRequest(foundRequest);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [params, router, isPending, data]);

  const handleAction = (action) => {
    if (!request) return;

    const message =
      action === "accept"
        ? "Êtes-vous sûr de vouloir accepter cette demande ?"
        : "Êtes-vous sûr de vouloir refuser cette demande ?";

    setConfirmModal({ isOpen: true, action, message });
  };

  const confirmAction = async () => {
    if (!confirmModal.action) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/requests/${request.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: confirmModal.action }),
      });

      if (response.ok) {
        setAlertModal({
          isOpen: true,
          message:
            confirmModal.action === "accept"
              ? "Demande acceptée avec succès !"
              : "Demande refusée avec succès !",
          type: "success",
        });
        setTimeout(() => {
          router.push("/admin/requests");
        }, 1500);
      } else {
        const error = await response.json();
        setAlertModal({
          isOpen: true,
          message: `Erreur: ${error.error}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setAlertModal({
        isOpen: true,
        message: "Erreur lors de l'action",
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Demande non trouvée</div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (request.status === "ACCEPTEE") {
      return (
        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Validée
        </span>
      );
    }
    if (request.status === "REFUSEE") {
      return (
        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Refusée
        </span>
      );
    }
    return (
      <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
        En attente
      </span>
    );
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

  if (!request) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p>Demande introuvable</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/admin/requests")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft /> Retour aux demandes
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Détails de la demande</h1>
              {getStatusBadge()}
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Pokemon Image */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 flex justify-center">
              <Image
                src={getImageSrc()}
                alt={request.name}
                width={250}
                height={250}
                className="rounded-lg object-contain"
                onError={() => setImgError(true)}
                unoptimized={getImageSrc().startsWith("http")}
              />
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Pokemon Name & Type */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold">{request.name}</h2>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      request.actionType === "AJOUT"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {request.actionType === "AJOUT"
                      ? "Création de fiche"
                      : "Modification de fiche"}
                  </span>
                </div>

                <div className="flex gap-2">
                  {request.types.map((type) => (
                    <span
                      key={type.id}
                      className="px-4 py-2 rounded-full text-white font-medium"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    N° Pokédex
                  </h3>
                  <p className="text-lg font-medium">
                    #{String(request.content.idpokedex).padStart(3, "0")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Proposé par
                  </h3>
                  <p className="text-lg font-medium">
                    {request.author.name || request.author.email}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Date de proposition
                  </h3>
                  <p className="text-lg font-medium">
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

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {request.content.description}
                </p>
              </div>

              {/* Actions */}
              {request.status === "EN_ATTENTE" && (
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={() => handleAction("accept")}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-colors"
                  >
                    <FaCheckCircle />
                    {processing ? "Traitement..." : "Accepter la demande"}
                  </button>
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-colors"
                  >
                    <FaTimesCircle />
                    {processing ? "Traitement..." : "Refuser la demande"}
                  </button>
                </div>
              )}

              {request.status !== "EN_ATTENTE" && (
                <div className="pt-6 border-t text-center text-gray-500">
                  Cette demande a déjà été traitée
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: null, message: "" })
        }
        onConfirm={confirmAction}
        title={
          confirmModal.action === "accept"
            ? "Accepter la demande"
            : "Refuser la demande"
        }
        message={confirmModal.message}
        confirmText={confirmModal.action === "accept" ? "Accepter" : "Refuser"}
        cancelText="Annuler"
        confirmColor={confirmModal.action === "accept" ? "blue" : "red"}
      />

      {/* Modal d'alerte */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() =>
          setAlertModal({ isOpen: false, message: "", type: "info" })
        }
        title={alertModal.type === "success" ? "Succès" : "Erreur"}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}
