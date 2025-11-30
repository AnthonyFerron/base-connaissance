"use client";

import { Card } from "flowbite-react";
import Image from "next/image";

export default function CardPokemon({ pokemon }) {
  if (!pokemon) return null;

  const types = pokemon.types || [];

  // Déterminer couleurs
  const color1 = types[0]?.color || "#ccc";
  const color2 = types[1]?.color || color1;

  return (
    // Wrapper qui simule la bordure
    <div
      className="rounded-lg p-[4px] w-66"
      style={{
        background:
          types.length > 1
            ? `linear-gradient(to right, ${color1} 50%, ${color2} 50%) border-box`
            : `${color1} border-box`,
      }}
    >
      <Card className="text-center shadow-md w-64 rounded-lg overflow-hidden !bg-white">
        {/* Image */}
        <div className="relative flex justify-center bg-gray-200 h-35 w-full overflow-hidden">
          <Image
            src={pokemon.photo}
            alt={pokemon.name}
            fill
            objectFit="fill"            
            className="object-cover"
          />
        </div>

        {/* Nom + id */}
        <div className="flex justify-between px-2">
          <p className="text-md font-semibold">{pokemon.name}</p>
          <p className="text-md text-gray-600">N° {pokemon.id}</p>
        </div>

          {/* Génération */}
          <div className="flex  justify-center">
            <p className="text-sm text-gray-500 ">GEN </p>
            <p className="text-sm text-gray-500 "> {pokemon.generation.nom}</p>
          </div>

        {/* Types */}
         <div className="flex justify-center gap-2">
          <div className="flex items-center gap-2 ">
            {pokemon.types?.map((type) => (
              <div
                key={type.id}
                className="flex items-center h-8 gap-2 px-3 py-2 rounded-lg shadow-sm "
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
      </Card>
    </div>
  );
}
