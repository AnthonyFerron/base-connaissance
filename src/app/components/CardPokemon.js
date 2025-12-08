"use client";

import Image from "next/image";
import { Card } from "flowbite-react";

export default function CardPokemon({ pokemon }) {
  if (!pokemon) return null;

  const types = pokemon.types || [];
  const color1 = types[0]?.color || "#ccc";
  const color2 = types[1]?.color || color1;

  return (
    <article
      role="article"
      aria-label={`Carte du Pokémon ${pokemon.name}`}
      className="
        rounded-lg 
        p-[4px]
        w-full
        max-w-[280px]
        mx-auto
      "
      style={{
        background:
          types.length > 1
            ? `linear-gradient(to right, ${color1} 50%, ${color2} 50%)`
            : color1,
      }}
    >
      <Card
        className="
          text-center 
          shadow-lg 
          w-full
          rounded-lg 
          overflow-hidden 
          !bg-white
        "
      >
        {/* Image */}
        <div
          className="
            relative 
            w-full 
            aspect-[4/3]
            sm:aspect-[5/4]
            bg-gray-200 
            overflow-hidden
          "
        >
          <Image
            src={pokemon.photo}
            alt={`Image de ${pokemon.name}`}
            fill
            sizes="(max-width: 640px) 100vw, 280px"
            className="object-contain"
            priority
          />
        </div>

        {/* Nom + id */}
        <div
          className="flex justify-between items-center px-3 mt-2"
          aria-label="Nom et numéro du Pokémon"
        >
          <h2 className="text-lg font-bold text-gray-800">
            {pokemon.name}
          </h2>
          <p className="text-sm text-gray-600">N° {pokemon.id}</p>
        </div>

        {/* Génération */}
        <p
          className="text-sm text-gray-500 mt-1"
          aria-label={`Génération ${pokemon.generation?.nom}`}
        >
          GEN {pokemon.generation?.nom}
        </p>

        {/* Types */}
        <div
          className="flex justify-center gap-2 mt-3 flex-wrap"
          aria-label="Types du Pokémon"
        >
          {types.map((type) => (
            <div
              key={type.id}
              className="
                flex 
                items-center 
                gap-2 
                px-3 
                py-1.5 
                rounded-lg 
                shadow-sm 
                text-white 
                font-semibold 
                text-xs
              "
              style={{ backgroundColor: type.color }}
            >
              {type.image && (
                <Image
                  src={type.image}
                  alt={`Type ${type.name}`}
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
              )}
              <span>{type.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </article>
  );
}
