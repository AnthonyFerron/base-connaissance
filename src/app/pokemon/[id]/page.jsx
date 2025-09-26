"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PokemonPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (id) fetchPokemon();
  }, [id]);

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

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center py-8 px-2">
      <div className="flex flex-col p-5 w-9/10 bg-white rounded-2xl gap-8">
        {/* Image à gauche */}
        <div className="flex flex-row w-full">
          <div className="flex-shrink-0 flex flex-col p-3 bg-[#D9D9D9] rounded-[24px] items-center justify-center w-1/2 md:w-1/3">
            <Image
              src={pokemon.photo}
              alt={pokemon.name}
              width={220}
              height={220}
              className="w-56 h-56 object-contain"
              priority
            />
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
                  {pokemon.generation?.nom}
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
          <div className="flex gap-2 mt-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow transition">
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
              Commenter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold shadow transition">
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
                  d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.25H3.75v-3.75L16.862 4.487z"
                />
              </svg>
              Modifier
            </button>
          </div>
        </div>
      </div>
      {/* Commentaires (si présents) */}
      {pokemon.comments && pokemon.comments.length > 0 && (
        <div className="w-full max-w-4xl flex flex-col gap-4 mt-8">
          {pokemon.comments.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border-l-4 border-green-500"
            >
              <div className="font-bold flex items-center gap-2 text-gray-800">
                <span>👤</span> {c.author?.name || "Utilisateur inconnu"}
              </div>
              <div className="text-gray-700 text-sm">{c.texte}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
