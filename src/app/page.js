"use client";

import { useEffect, useState } from "react";
import CardPokemon from "./components/CardPokemon";
import { Button } from "flowbite-react";
import { Search } from "lucide-react";

export default function Home() {
  const [pokemons, setPokemons] = useState([]); useEffect(() => {
    async function loadPokemons() {
      const res = await fetch("/api/pokemon"); const data = await res.json(); setPokemons(data);

    } loadPokemons();
  }, []);

  return (
    <main className="flex flex-col">
      <section className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.jpg')", }} >

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-gray-500 bg-opacity-40" />
        {/* Contenu */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg"> PokéDoc </h1>
          <div className="flex w-full max-w-md items-center bg-white rounded-full shadow-md px-4 py-2">
            <input type="text" placeholder="Rechercher un Pokémon..." className="flex-1 border-0 focus:ring-0" />
            <Button color="failure" className="ml-2 rounded-full px-4">
              <Search className="h-5 w-5" /> </Button>
          </div>
        </div>
      </section>
      {/* LISTE POKEMONS */}
      <section className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemons.map((p) => (<CardPokemon key={p.id} pokemon={p} />))}
      </section>
    </main>
  );
}