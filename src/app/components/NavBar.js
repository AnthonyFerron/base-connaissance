"use client"; 

import { useState, useEffect } from "react"; 
import { Button, 
          Navbar, 
          Dropdown, 
          DropdownItem, 
          DropdownDivider, 
          ToggleSwitch, 
          Checkbox, } from "flowbite-react"; 
import { CirclePlus, Pen } from "lucide-react"; 

export default function MyNavbar() {
  const [showFilters, setShowFilters] = useState(false);
  const [pseudo, setPseudo] = useState("Darksasukedu69");
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);

  // Charger les données depuis l’API
  useEffect(() => {
    async function loadData() {
      try {
        const resGen = await fetch("/api/generation");
        const gens = await resGen.json();
        setGenerations(gens);

        const resTypes = await fetch("/api/type");
        const tps = await resTypes.json();
        setTypes(tps);
      } catch (err) {
        console.error("Erreur fetch Navbar:", err);
      }
    }
    loadData();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <Navbar className="bg-white shadow-md px-4 justify-between">
        {/* Gauche : Filtres + Créer */}
        <div className="flex items-center gap-6">
          {/* Toggle Filtres */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium">Filtres</span>
            <ToggleSwitch
              checked={showFilters}
              onChange={() => setShowFilters(!showFilters)}
              className="text-[#EC533A]"
            />
          </div>
          {/* Bouton Créer */}
          <div className="flex flex-col items-center">
            <Button className="bg-[#EC533A] hover:bg-red-600 rounded-full p-0.5">
              <CirclePlus className="h-9 w-9 text-white" />
            </Button>
            <span className="text-sm mt-1">Créer</span>
          </div>
        </div>
        {/* Droite : Profil */}
        <div className="flex items-center gap-4 h-8 bg-[#EC533A] p-4 text-white rounded-md border border-black">
          <Dropdown
            label="Mon Profil"
            inline
            className="rounded-md shadow-md text-black border border-black"
          >
            <div className="px-3 py-2">
              <div className="flex flex-row gap-1 items-center">
                <span className="block text-sm text-gray-500">Pseudo</span>
                <Pen className="size-4 text-[#EC533A]" />
              </div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm font-semibold focus:ring-2 focus:ring-[#EC533A]"
              />
              <span className="block text-sm text-gray-500 mt-1">
                Adresse e-mail
              </span>
              <span className="block text-sm font-semibold truncate">
                darksasukedu69@yahoo.fr
              </span>
            </div>
            <DropdownDivider />
            <DropdownItem>
              <Button className="w-full h-6 bg-[#EC533A] hover:bg-red-600 text-white border border-black">
                Déconnexion
              </Button>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem className="text-red-600 hover:bg-red-50">
              Supprimer ce compte
            </DropdownItem>
          </Dropdown>
        </div>
      </Navbar>
      {/* MENU FILTRES */}
      {showFilters && (
        <aside className="absolute top-16 left-0 w-60 bg-white rounded-lg border-solid border-black border-1 shadow-lg p-4 z-40">
          <h3 className="text-sm font-semibold mb-3">Générations</h3>
          <div className="flex flex-col gap-3">
            {generations.map((g) => (
              <label
                key={g.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="generation"
                  className="text-[#EC533A]"
                />
                <div>
                  <p className="text-sm font-medium">{g.nom}</p>
                </div>
              </label>
            ))}
          </div>
          <hr className="my-4 border-gray-300" />
          <h3 className="text-sm font-semibold my-3">Types</h3>
          <div className="flex flex-col gap-3">
            {types.map((t) => (
              <label
                key={t.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  id={`type-${t.id}`}
                  className="text-[#EC533A]"
                />
                <div>
                  <p className="text-sm font-medium text-black">{t.name}</p>
                </div>
              </label>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}