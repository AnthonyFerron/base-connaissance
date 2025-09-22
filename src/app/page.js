"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFilters } from "./providers/FiltersProvider";
import CardPokemon from "./components/CardPokemon";

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

  const filteredPokemons = pokemons.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchGen =
      !filters.generation || p.generationId === filters.generation;
    const matchTypes =
      filters.types.length === 0 ||
      filters.types.every((t) => p.types.includes(t));
    return matchSearch && matchGen && matchTypes;
  });

  return (
    <main>
      {/* hero */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-gray-500 bg-opacity-40" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
            PokéDoc
          </h1>
        </div>
      </section>

      {/* liste */}
      <section className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((p) => (
          <CardPokemon key={p.id} pokemon={p} />
        ))}
      </section>
    </main>
  );
}
