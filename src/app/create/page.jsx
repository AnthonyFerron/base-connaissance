"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreatePokemonPage() {
  const router = useRouter();
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
  const [imagePreview, setImagePreview] = useState(null);

  // Charger les générations et types
  useEffect(() => {
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
  }, []);

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

      // Créer un aperçu
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
        : [...prev.typeIds, typeId],
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ici, vous ajouterez la logique pour envoyer les données à l'API
      console.log("Données à envoyer:", formData);

      // Redirection après création réussie
      // router.push("/");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setLoading(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <div className="flex flex-col p-5 w-9/10 bg-white rounded-2xl gap-8 border border-black">
        <h1 className="text-2xl font-bold text-center mb-8">
          Créer un Pokémon
        </h1>

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
              Type :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeToggle(type.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                    formData.typeIds.includes(type.id)
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    backgroundColor: formData.typeIds.includes(type.id)
                      ? `${type.color}20`
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
              ))}
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
                  <Image
                    src={imagePreview}
                    alt="Aperçu"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg"
                  />
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
                  <p className="text-gray-600 mb-2">Ajouter une image</p>
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
                  Création...
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
                  Valider
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
