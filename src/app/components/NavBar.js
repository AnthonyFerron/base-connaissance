"use client";

import { useEffect, useState, useContext } from "react";
import {
  Button,
  Navbar,
  Checkbox,
} from "flowbite-react";
import { ChevronLeft, CirclePlus, Pen, Search, X, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useFilters } from "@/app/providers/FiltersProvider";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { SidebarContext } from "@/app/layout";
import { useAuth } from "@/app/providers/AuthProvider";

export default function MyNavbar() {
  const { showSidebar, setShowSidebar } = useContext(SidebarContext);
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const { filters, setFilters } = useFilters();
  const [openProfile, setOpenProfile] = useState(false);

  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);
  const { updateUser, user } = useAuth();
  const [pseudo, setPseudo] = useState(user?.name || "");
  const [allPokemons, setAllPokemons] = useState([]);
  const [showResults, setShowResults] = useState(false);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!filters.search) return;
    if (pathname !== '/') {
      router.push('/'); // La Home lira filters.search
    }
  };
  // ✅ Déconnexion
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
          onError: (ctx) => {
            console.error("Logout failed:", ctx.error);
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Rediriger quand même vers la page de login
      router.push("/login");
    }
  };


  // 🔄 Synchroniser quand user change (connexion/déconnexion)
  useEffect(() => {
    setPseudo(user?.name || "");
  }, [user]);

  // ✅ Sauvegarde pseudo uniquement au clic
  const savePseudo = async () => {
    try {
      if (!pseudo || pseudo === user?.name) return;
      await updateUser({ name: pseudo });
      setOpenProfile(false);
    } catch (error) {
      console.error("Erreur update pseudo:", error);
    }
  };

  // ✅ Suppression logique du compte
  const handleDeleteAccount = async () => {
    try {
      await updateUser({
        name: "deletedUser",
        email: "deleted@pokeme.com",
        role: "deleted",
      },
        handleLogout()
      );
    } catch (error) {
      console.error("Erreur suppression compte:", error);
    }
  };

  // Charger données API
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

  useEffect(() => {
    async function loadNavPokemons() {
      try {
        const res = await fetch("/api/pokemon");
        const data = await res.json();
        setAllPokemons(data);
      } catch (err) {
        console.error("Erreur fetch pokemons navbar:", err);
      }
    }
    loadNavPokemons();
  }, []);

  // ✅ Gestion toggle type
  const toggleType = (type) => {
    if (filters.types.includes(type)) {
      setFilters({
        ...filters,
        types: filters.types.filter((t) => t !== type),
      });
    } else {
      setFilters({
        ...filters,
        types: [...filters.types, type],
      });
    }
  };

  // ✅ Reset des filtres
  const resetFilters = () => {
    setFilters({
      generation: null,
      types: [],
    });
    setSearch("");
  };

  if (pathname === "/login") {
    return null;
  }

  const handleCreate = () => {
    router.push("/create");
  };

  const handleGoBack = () => {
    router.back();
  };

  const filteredResults = allPokemons
    .filter((p) =>
      p.name?.toLowerCase().includes(filters.search.toLowerCase())
    )
    .slice(0, 6);



  return (
    <>
      {/* NAVBAR */}
      <Navbar className="!bg-white shadow-md px-4 flex justify-between fixed top-0 w-full z-50">
        {/* Gauche : Sidebar ou Retour */}
        <div className="flex items-center gap-6">
          {pathname === "/" ? (
            <Button
              onClick={openSidebar}
              className="bg-[#EC533A] hover:bg-orange-700 h-8 text-white rounded-lg px-2 py-1 border border-black"
            >
              Filtres
            </Button>
          ) : (
            <Button
              className="bg-[#EC533A] hover:bg-orange-700 h-8 text-white rounded-lg px-2 py-1 border border-black"
              onClick={handleGoBack}
            >
              <ChevronLeft className="size-5 mr-1" /> Retour
            </Button>
          )}

          {/* Bouton Créer */}
          {user && (
            <div className="flex flex-col items-center">
              <Button
                onClick={handleCreate}
                className="bg-[#EC533A] hover:bg-orange-700 rounded-full p-0.5"
              >
                <CirclePlus className="h-9 w-9 text-white" />
              </Button>
              <span className="text-sm mt-1">Créer</span>
            </div>
          )}
        </div>

        {/* Droite : Barre de recherche (sauf sur accueil) */}
        {pathname !== "/" && (
          <div className="relative w-full max-w-md">
            <div
              className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-gray-300"
            >
              <Search className="w-5 h-5 text-gray-500" />

              <input
                type="text"
                placeholder="Rechercher un Pokémon..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="ml-2 bg-transparent focus:outline-none border-0 focus:ring-0 text-sm flex-1"
              />

              {filters.search.length > 0 && (
                <button
                  onClick={() => {
                    setFilters({ ...filters, search: "" });
                    setShowResults(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 🔽 Résultats de la recherche */}
            {showResults && filters.search.length > 0 && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-xl z-50 max-h-64 overflow-y-auto">
                {filteredResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowResults(false);
                      router.push(`/pokemon/${p.id}`);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Image
                      src={p.photo}
                      alt={p.name}
                      width={40}
                      height={40}
                      objectFit="fill"
                    />
                    <span className="font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {showResults && filters.search.length > 0 && filteredResults.length === 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-xl z-50 p-3 text-center text-gray-500">
                Aucun résultat
              </div>
            )}
          </div>
        )}

        <div className="flex flex-row gap-10 items-center">
          <Image
            src="/images/logo.png"
            alt="PokéDoc logo"
            width={40}
            height={40}
            draggable="false"
            priority
          />

          {/* Profil */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="bg-[#EC533A] text-white px-4 py-2 rounded-md border border-black"
              >
                Mon Profil
              </button>

              {openProfile && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white shadow-md border border-black rounded-md p-3 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Pseudo</span>
                    <input
                      type="text"
                      value={pseudo}
                      onChange={(e) => setPseudo(e.target.value)}
                      className="w-full border rounded-md px-2 py-1 mt-1 text-sm"
                    />
                    <button
                      onClick={savePseudo}
                      className="mt-2 w-full bg-[#EC533A] text-white rounded-md py-1 hover:bg-gray-500"
                    >
                      Sauvegarder
                    </button>
                  </div>

                  <hr className="my-2" />

                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-sm font-semibold">{user?.email}</p>

                  <hr className="my-2" />

                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="w-full text-left py-1 hover:bg-gray-100 "
                    >
                      Administration
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 bg-[#EC533A] text-white rounded-md py-1 hover:bg-gray-500"
                  >
                    Déconnexion
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="w-full mt-2 p-1 text-red-600 text-left rounded-lg hover:bg-gray-300"
                  >
                    Supprimer ce compte
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Si PAS connecté : bouton "Se connecter" */
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#EC533A] hover:bg-orange-700 text-white rounded-md px-4 py-2 border border-black"
            >
              Se Connecter
            </Button>
          )}

        </div>
      </Navbar>

      {/* SIDEBAR FILTRES */}
      <div
        className={`fixed top-[84px] 
          pb-30
          left-0 
          h-full
           w-64 bg-white 
           border-r
            border-black 
            shadow-lg 
            transform transition-transform 
            duration-300 
            ${showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-1 border-b">
          <h2 className="text-lg font-semibold">Filtres</h2>
          <div className="flex justify-end gap-2">
            <button onClick={resetFilters} className="p-1 bg-red-200 rounded-lg border">
              Reset
            </button>
            <button onClick={closeSidebar}>
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        <div className="p-4 overflow-y-auto max-h-full pb-6">
          <h3 className="text-sm font-semibold mb-3">Générations</h3>
          <div className="flex flex-col gap-3 ">
            {generations.map((g) => (
              <label
                key={g.id}
                className="flex gap-2 cursor-pointer items-start"
              >
                <input
                  type="radio"
                  name="generation"
                  className="text-[#EC533A]"
                  checked={filters.generation === g.id}
                  onChange={() => setFilters({ ...filters, generation: g.id })}
                />
                <div className="flex flex-col ">
                  <p className="flex text-sm font-medium">Génération {g.id}</p>
                  <p className="flex text-sm font-medium text-gray-400">
                    {g.nom}
                  </p>
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
                  checked={filters.types.includes(t.name)}
                  onChange={() => toggleType(t.name)}
                  className="text-[#EC533A]"
                />
                <p className="text-sm font-medium text-black">{t.name}</p>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
