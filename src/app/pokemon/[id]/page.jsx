"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PokemonPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/pokemon/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du Pokémon");
        const data = await res.json();
        setPokemon(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUser() {
      setSessionLoading(true);
      try {
        const sessionRes = await fetch("/api/auth/get-session", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.user) {
            setUser(sessionData.user);
            return;
          }
        }

        const session = await authClient.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setSessionLoading(false);
      }
    }

    if (id) fetchPokemon();
    fetchUser();
  }, [id]);

  // Écouter les changements de focus pour rafraîchir la session
  useEffect(() => {
    const handleFocus = () => {
      async function refetchUser() {
        try {
          const session = await authClient.getSession();
          if (session?.user && !user) {
            setUser(session.user);
          }
        } catch (e) {
          // Session non disponible
        }
      }
      refetchUser();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setCommentLoading(true);
    try {
      const response = await fetch(`/api/pokemon/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texte: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du commentaire");
      }

      const newCommentData = await response.json();

      // Ajouter le nouveau commentaire à la liste
      setPokemon((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newCommentData],
      }));

      // Réinitialiser le formulaire
      setNewComment("");
      setShowCommentForm(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout du commentaire");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!pokemon)
    return <div className="text-center py-12">Aucun Pokémon trouvé.</div>;

  // Lecture des champs du JSON en base (idpokedex, description)
  let idPokedex = pokemon.id;
  let description = "";
  if (pokemon.content && typeof pokemon.content === "object") {
    if (pokemon.content.idpokedex) idPokedex = pokemon.content.idpokedex;
    if (pokemon.content.description) description = pokemon.content.description;
  } else if (typeof pokemon.content === "string") {
    description = pokemon.content;
  }

  // Créer le dégradé basé sur les types du Pokémon
  let backgroundGradient = "linear-gradient(to bottom, #f3f4f6, #e5e7eb)"; // fond par défaut

  if (pokemon.types && pokemon.types.length > 0) {
    const primaryColor = pokemon.types[0].color;

    if (pokemon.types.length === 1) {
      // Un seul type : dégradé continu de 70% à 30%
      backgroundGradient = `linear-gradient(135deg, ${primaryColor}B3, ${primaryColor}4D)`;
    } else {
      // Deux types : dégradé du coin haut gauche vers bas droit
      const secondaryColor = pokemon.types[1].color;
      backgroundGradient = `linear-gradient(135deg, ${primaryColor}B3, ${secondaryColor}B3)`;
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-8 px-2"
      style={{
        background: backgroundGradient,
      }}
    >
      <div className="flex flex-col p-5 w-9/10 bg-white rounded-2xl gap-8 border border-black">
        {/* Image à gauche */}
        <div className="flex flex-row w-full">
          <div className="flex-shrink-0 flex flex-col p-3 bg-[#D9D9D9] rounded-[24px] items-center justify-center w-1/2 md:w-1/3">
            <div className="relative w-56 h-56 overflow-hidden rounded-lg">
              <Image
                src={pokemon.photo}
                alt={pokemon.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Bloc infos à droite */}
          <div className="flex-1 flex flex-col gap-2 p-3">
            <div className="flex flex-col justify-between h-full gap-0">
              <div className="pb-2 border-b border-gray-200">
                <span className="text-gray-500 text-sm">Id pokédex:</span>
                <span className="font-bold text-[24px] ml-2 align-middle">
                  n°{idPokedex}
                </span>
              </div>
              <div className="py-2 border-b border-gray-200">
                <span className="text-gray-500 text-sm">Génération:</span>
                <span className="font-bold text-[24px] ml-2 align-middle">
                  {pokemon.generation?.name}
                </span>
              </div>
              <div className="py-2 border-b border-gray-200">
                <span className="text-gray-500 text-sm">Nom :</span>
                <span className="font-bold text-[24px] ml-2 align-middle">
                  {pokemon.name}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-gray-500 text-sm">Type :</span>
                {pokemon.types?.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border"
                    style={{ backgroundColor: type.color }}
                  >
                    {type.image && (
                      <Image
                        src={type.image}
                        alt={type.name}
                        width={20}
                        height={20}
                        className="flex-shrink-0"
                      />
                    )}
                    <span className="text-white font-semibold text-sm">
                      {type.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4">
            <span className="font-bold text-lg">Description :</span>
            <p
              className="text-gray-700 text-sm mt-1 bg-gray-50 rounded p-2 border border-gray-200"
              style={{ maxHeight: 120, overflowY: "auto" }}
            >
              {description}
            </p>
          </div>
          <div className="flex gap-2 mt-10">
            {sessionLoading ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-semibold">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Vérification...
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-2.686 9-6V7.5c0-3.314-4.03-6-9-6s-9 2.686-9 6v6.75c0 3.314 4.03 6 9 6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 10.5h7.5"
                    />
                  </svg>
                  {showCommentForm ? "Annuler" : "Commenter"}
                </button>
                <button
                  onClick={() => router.push(`/pokemon/${id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Modifier
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-gray-700 rounded-lg text-sm font-semibold transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                Connectez-vous pour commenter
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout de commentaire */}
      {showCommentForm && user && (
        <div className="w-9/10 bg-white rounded-xl shadow p-6 mt-6 border border-black">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Ajouter un commentaire</h3>
              <p className="text-sm text-gray-600">
                En tant que {user.name || user.email}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows="4"
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition"
              >
                {commentLoading ? "Envoi..." : "Publier"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section Commentaires */}
      <div className="w-9/10 mt-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Commentaires ({pokemon.comments?.length || 0})
        </h2>

        {pokemon.comments && pokemon.comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pokemon.comments.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-black hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {(c.author?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {c.author?.name || "Utilisateur inconnu"}
                      </div>
                      {c.createdAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed">{c.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center border border-black">
            <div className="text-gray-400 text-lg mb-2">💬</div>
            <p className="text-gray-600">Aucun commentaire pour le moment.</p>
            <p className="text-gray-500 text-sm mt-1">
              Soyez le premier à commenter ce Pokémon !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
