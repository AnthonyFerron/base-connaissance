"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/providers/AuthProvider";

export default function EditPokemonPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    idPokedex: "",
    generationId: "",
    nom: "",
    typeIds: [],
    description: "",
    photo: null,
  });
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPokemon, setLoadingPokemon] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Charger les données du Pokémon existant
  useEffect(() => {
    if (authLoading || !user || !id) return;

    async function loadPokemon() {
      try {
        const response = await fetch(`/api/pokemon/${id}`);
        if (!response.ok) throw new Error("Pokémon non trouvé");

        const pokemon = await response.json();

        // Extraire les données du content JSON
        const idPokedex = pokemon.content?.idpokedex || pokemon.id;
        const description = pokemon.content?.description || "";

        setFormData({
          idPokedex: idPokedex.toString(),
          generationId: pokemon.generationId.toString(),
          nom: pokemon.name,
          typeIds: pokemon.types.map((t) => t.id),
          description: description,
          photo: null,
        });
        setCurrentPhoto(pokemon.photo);
        setImagePreview(pokemon.photo);
      } catch (error) {
        console.error("Erreur chargement Pokémon:", error);
        setError("Erreur lors du chargement du Pokémon");
      } finally {
        setLoadingPokemon(false);
      }
    }

    loadPokemon();
  }, [authLoading, user, id]);

  // Charger les générations et types
  useEffect(() => {
    if (authLoading || !user) return;

    async function loadData() {
      try {
        const [genRes, typeRes] = await Promise.all([
          fetch("/api/generation"),
          fetch("/api/type"),
        ]);
        const genData = await genRes.json();
        const typeData = await typeRes.json();
        setGenerations(genData);
        setTypes(typeData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    }
    loadData();
  }, [authLoading, user]);

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gestion de l'upload d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de la sélection des types
  const handleTypeToggle = (typeId) => {
    setFormData((prev) => ({
      ...prev,
      typeIds: prev.typeIds.includes(typeId)
        ? prev.typeIds.filter((id) => id !== typeId)
        : prev.typeIds.length < 2
        ? [...prev.typeIds, typeId]
        : prev.typeIds,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (formData.typeIds.length === 0) {
        setError("Veuillez sélectionner au moins un type");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("pokemonId", id);
      submitData.append("nom", formData.nom);
      submitData.append("idPokedex", formData.idPokedex);
      submitData.append("generationId", formData.generationId);
      submitData.append("description", formData.description);
      submitData.append("typeIds", JSON.stringify(formData.typeIds));

      if (formData.photo) {
        submitData.append("photo", formData.photo);
      } else {
        submitData.append("currentPhoto", currentPhoto);
      }

      // Envoyer à l'API de modification
      const response = await fetch("/api/pokemon/update", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la modification");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/pokemon/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/pokemon/${id}`);
  };

  if (authLoading || loadingPokemon) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-2">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">
            {authLoading
              ? "Vérification de la connexion..."
              : "Chargement du Pokémon..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <div className="flex flex-col p-5 w-9/10 bg-white rounded-2xl gap-8 border border-black">
        <h1 className="text-2xl font-bold text-center mb-8">
          Modifier un Pokémon
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Erreur ! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Demande envoyée ! </strong>
            <span className="block sm:inline">
              Votre demande de modification a été envoyée avec succès. Elle sera
              examinée par un administrateur. Redirection en cours...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ligne 1: Id pokédex et Génération */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Id pokédex :
              </label>
              <input
                type="number"
                name="idPokedex"
                value={formData.idPokedex}
                onChange={handleInputChange}
                placeholder="Ex: 1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Génération :
              </label>
              <select
                name="generationId"
                value={formData.generationId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Sélectionner une génération</option>
                {generations.map((gen) => (
                  <option key={gen.id} value={gen.id}>
                    {gen.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2: Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom :
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              placeholder="Ex: Pikachu"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Ligne 3: Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type :{" "}
              <span className="text-gray-500 text-xs">(maximum 2 types)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {types.map((type) => {
                const isSelected = formData.typeIds.includes(type.id);
                const isDisabled = !isSelected && formData.typeIds.length >= 2;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleTypeToggle(type.id)}
                    disabled={isDisabled}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : isDisabled
                        ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? `${type.color}20`
                        : isDisabled
                        ? "#f9fafb"
                        : "white",
                    }}
                  >
                    {type.image && (
                      <Image
                        src={type.image}
                        alt={type.name}
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                      />
                    )}
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image :
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative w-56 h-56 mx-auto overflow-hidden rounded-lg border border-gray-300">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, photo: null }));
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer l'image
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">Modifier l'image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Parcourir les fichiers
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description :
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Entrez la description du Pokémon..."
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              required
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Valider la modification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
