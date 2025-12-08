"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFilters } from "./providers/FiltersProvider";
import CardPokemon from "./components/CardPokemon";
import Image from "next/image";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { filters, setFilters } = useFilters();
  const search = filters.search;
  const [pokemons, setPokemons] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    async function loadPokemons() {
      const res = await fetch("/api/pokemon");
      const data = await res.json();
      setPokemons(data);
    }
    loadPokemons();
  }, []);

  // Reset filters when leaving home
  useEffect(() => {
    if (pathname !== "/") {
      setFilters({ generation: null, types: [], search: "" });
    }
  }, [pathname, setFilters]);

  // Type helpers
  function getPokemonTypeNamesLower(p) {
    if (!p?.types) return [];
    return p.types
      .map((pt) => {
        if (!pt) return "";
        if (typeof pt === "string") return pt.toLowerCase();
        if (typeof pt === "number") return String(pt);
        if (pt.name) return pt.name.toLowerCase();
        if (pt.type?.name) return pt.type.name.toLowerCase();
        return "";
      })
      .filter(Boolean);
  }

  function pokemonMatchesGeneration(p, selectedGeneration) {
    if (!selectedGeneration) return true;
    const pGen = p.generationId ?? p.generation?.id ?? p.generation ?? null;
    return pGen != null && String(pGen) === String(selectedGeneration);
  }

  function pokemonMatchesTypes(p, selectedTypes) {
    if (!selectedTypes || selectedTypes.length === 0) return true;
    const pTypesLower = getPokemonTypeNamesLower(p);
    return selectedTypes.some((sel) => pTypesLower.includes(sel.toLowerCase()));
  }

  function pokemonMatchesSearch(p, q) {
    if (!q || q.trim() === "") return true;
    const lowerQ = q.toLowerCase().trim();
    const name = (p.name ?? p.nom ?? p?.names?.fr ?? "")
      .toString()
      .toLowerCase();
    return name.includes(lowerQ);
  }

  const filteredPokemons = pokemons.filter(
    (p) =>
      pokemonMatchesSearch(p, search) &&
      pokemonMatchesGeneration(p, filters.generation) &&
      pokemonMatchesTypes(p, filters.types)
  );

  return (
    <main>
      {/* HERO */}
      <section
        className="
          relative 
          h-[40vh] sm:h-[55vh] 
          flex items-center justify-center
        "
      >
        <div className="text-center px-4">
          {/* Logo + Title */}
          <div className="flex items-end justify-center gap-1 sm:gap-2">
            <Image
              src="/images/logo.png"
              alt="PokéDoc logo"
              width={80}
              height={80}
              className="sm:w-[80px] h-auto"
              draggable="false"
              priority
            />
            <span className="text-5xl sm:text-7xl font-extrabold -ml-4 sm:-ml-6">
              okéDoc
            </span>
          </div>

          {/* 🔍 Accessible Search Bar */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <label htmlFor="searchHome" className="sr-only">
              Recherche de Pokémon
            </label>

            <div className="flex items-center bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full shadow-lg mt-6 px-4 py-2 w-[350px] mx-auto">
              <Search className="h-6 w-6 text-gray-500 mr-2" />

              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="
                  flex-1 
                  bg-transparent 
                  border-none 
                  outline-none 
                  focus:outline-none 
                  focus:ring-0 
                  text-gray-800 
                  placeholder-gray-500
                  shadow-none
                "
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-md mx-auto my-8">
        <Link href="/quiz">
          <div
            className="bg-[#EC533A] text-white p-6 rounded-xl shadow-lg 
                          hover:bg-orange-700 cursor-pointer transition transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold mb-2">🎮 Quiz Pokémon</h2>
            <p>Teste tes connaissances avec un quiz aléatoire !</p>
          </div>
        </Link>
      </div>

      {/* LISTE */}
      <div className="px-4 sm:px-10 bg-gray-200 flex justify-center">
        <section className="py-10 w-full max-w-7xl">
          {filteredPokemons.length === 0 ? (
            <p className="text-center text-gray-600 text-lg font-medium">
              Aucun Pokémon trouvé 😢
            </p>
          ) : (
            <div
              className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-6 sm:gap-10
            "
            >
              {filteredPokemons.map((p) => (
                <Link
                  key={p.id}
                  href={`/pokemon/${p.id}`}
                  className="block hover:scale-105 transition-transform"
                >
                  <CardPokemon pokemon={p} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
