"use client";

import { useEffect, useState, useContext } from "react";
import {
  Button,
  Navbar,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Checkbox,
} from "flowbite-react";
import { ChevronLeft, CirclePlus, Pen, Search, X, Shield } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useFilters } from "../providers/FiltersProvider";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { SidebarContext } from "../layout";

export default function MyNavbar() {
  const { showSidebar, setShowSidebar } = useContext(SidebarContext);
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { filters, setFilters, search, setSearch } = useFilters();
  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);
  const [pseudo, setPseudo] = useState(user?.name || "");


  // Charger l'utilisateur
  useEffect(() => {
    const loadUser = async () => {
      const session = await authClient.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    loadUser();
  }, []);

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
      if (!pseudo || pseudo === user?.name) return; // rien à faire
      await updateUser({ name: pseudo });
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
          <div className="flex flex-col items-center">
            <Button
              onClick={handleCreate}
              className="bg-[#EC533A] hover:bg-orange-700 rounded-full p-0.5"
            >
              <CirclePlus className="h-9 w-9 text-white" />
            </Button>
            <span className="text-sm mt-1">Créer</span>
          </div>
        </div>

        {/* Droite : Barre de recherche (sauf sur accueil) */}
        {pathname !== "/" && (
          <div className="flex items-center rounded-full border w-80 h-10 justify-between">
            <input
              type="text"
              placeholder="Rechercher ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex justify-start border-0 h-full rounded-full px-3 text-sm"
            />
            <Button
              type="submit"
              className="flex justify-end rounded-full p-1 px-3 text-gray-600 hover:bg-gray-200 focus:ring-0"
            >
              <Search className="h-4 w-4" />
            </Button>
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
          <div className="flex items-center gap-4 h-8 bg-[#EC533A] p-4 text-white rounded-md border border-black ">
            <Dropdown
              label="Mon Profil"
              inline
              className="rounded-md shadow-md text-black border border-black"
            >
              <div className="px-3 py-2">
                <div className="flex flex-row gap-1 mb-1 items-center">
                  <span className="block text-sm text-gray-500">Pseudo </span>
                  <Pen className="size-4 text-[#EC533A]" />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)} // écriture locale
                    placeholder="Choisir un pseudo..."
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm font-semibold focus:ring-2 focus:ring-[#EC533A]"
                  />
                  <button
                    onClick={savePseudo}
                    className="bg-[#EC533A] hover:bg-orange-700 text-white px-3 rounded-md text-sm"
                  >
                    Sauvegarder
                  </button>
                </div>

                <span className="block text-sm text-gray-500 mt-2">Adresse e-mail</span>
                <span className="block text-sm font-semibold truncate">
                  {/* {user?.email || ""} */}
                </span>
              </div>
              <DropdownDivider />
              {user?.role === "ADMIN" && (
                <>
                  <DropdownItem onClick={() => router.push("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Administration
                  </DropdownItem>
                  <DropdownDivider />
                </>
              )}
              <DropdownItem>
                <Button
                  onClick={handleLogout}
                  className="w-full h-6 bg-[#EC533A] hover:bg-orange-700 text-white border border-black"
                >
                  Déconnexion
                </Button>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                onClick={handleDeleteAccount}
                className="text-red-600 hover:bg-red-50"
              >
                Supprimer ce compte
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </Navbar>

      {/* SIDEBAR FILTRES */}
      <div
        className={`fixed top-[84px] left-0 h-[calc(100%-64px)]  w-64 bg-white border-r border-black shadow-lg transform transition-transform duration-300 z-50 ${showSidebar ? "translate-x-0" : "-translate-x-full"
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

        <div className="p-4 overflow-y-auto h-full">
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
