"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFilters } from "./providers/FiltersProvider";
import CardPokemon from "./components/CardPokemon";
import Image from "next/image";
import { Button } from "flowbite-react";
import { Search } from "lucide-react";


export default function Home() {
  const { filters, setFilters, search } = useFilters();
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

  // Reset des filtres si on quitte la page d’accueil
  useEffect(() => {
    if (pathname !== "/") {
      setFilters({ generation: null, types: [] });
    }
  }, [pathname, setFilters]);

  // helper : renvoie les noms de types en minuscules pour un pokemon
  function getPokemonTypeNamesLower(p) {
    if (!p?.types) return [];
    return p.types
      .map((pt) => {
        if (!pt) return "";
        if (typeof pt === "string") return pt.toLowerCase();
        if (typeof pt === "number") return String(pt);
        // si pt est un objet { name, id } ou { type: { name } }
        if (pt.name) return String(pt.name).toLowerCase();
        if (pt.type && typeof pt.type === "string") return pt.type.toLowerCase();
        if (pt.type && pt.type.name) return String(pt.type.name).toLowerCase();
        return "";
      })
      .filter(Boolean);
  }

  function pokemonMatchesGeneration(p, selectedGeneration) {
    if (!selectedGeneration) return true;
    const pGen = p.generationId ?? p.generation?.id ?? p.generation ?? null;
    if (pGen == null) return false;
    return String(pGen) === String(selectedGeneration);
  }

  function pokemonMatchesTypes(p, selectedTypes) {
    if (!selectedTypes || selectedTypes.length === 0) return true;
    const pTypesLower = getPokemonTypeNamesLower(p);
    // selectedTypes stored as strings (names) in filters
    return selectedTypes.some((sel) =>
      pTypesLower.includes(String(sel).toLowerCase())
    );
  }

  function pokemonMatchesSearch(p, q) {
    if (!q || q.trim() === "") return true;
    const lowerQ = q.toLowerCase().trim();
    const name =
      (p.name ?? p.nom ?? (p.names && p.names.fr) ?? "").toString().toLowerCase();
    return name.includes(lowerQ);
  }

  const filteredPokemons = pokemons.filter((p) => {
    return (
      pokemonMatchesSearch(p, search) &&
      pokemonMatchesGeneration(p, filters.generation) &&
      pokemonMatchesTypes(p, filters.types)
    );
  });


  return (
    <main>
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        <div className="justify-center text-center ">
          <div className="flex items-end p-2 justify-center">
            <Image
              src="/images/logo.png"
              alt="PokéDoc logo"
              width={80}
              height={80}
              className="mr-2"
              draggable="false"
              priority
            />
            <span className="flex text-7xl font-extrabold ml-[-30px] items-end ">
              okéDoc
            </span>
          </div>
          <div className="flex justify-between bg-white rounded-full shadow-md mt-6 border border-black">
            <input
              type="text"
              placeholder="Rechercher ..."
              className="flex justify-start !border-0 rounded-full"
            />
            <Button
              type="submit"
              className="flex justify-end rounded-full px-2 m-0.5 text-gray-700 hover:bg-gray-300 focus:ring-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto bg-gray-200">
        <section className="px-6 py-10 min-h-[300px]">
          {filteredPokemons.length === 0 ? (
            <p className="text-center text-gray-600 text-lg font-medium">
              Aucun Pokémon trouvé 😢
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPokemons.map((p) => (
                <CardPokemon key={p.id} pokemon={p} />
              ))}
            </div>
          )}
        </section>  
      </div>
    </main>
  );

}
