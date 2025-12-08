export default function CreditsPage() {
  return (
    <main className=" flex items-center justify-center p-6 mt-10">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40">
        {" "}
        <h1 className="text-4xl font-extrabold text-center mb-6">Crédits</h1>
        <h2 className="text-xl font-bold mt-4">Pokémon</h2>
        <p className="text-gray-700 mb-4">
          Pokémon © Nintendo / Game Freak / The Pokémon Company. Ce site est un
          fansite non officiel.
        </p>
        <h2 className="text-xl font-bold mt-4">Images & assets</h2>
        <p className="text-gray-700 mb-4">
          • Sprites de Pokémon : <strong>PokéAPI</strong>• Icônes des types :
          ressources fans Pokémon • Logo PokéDoc : création originale
        </p>
        <h2 className="text-xl font-bold mt-4">Développement</h2>
        <p className="text-gray-700 mb-4">
          Réalisé avec Next.js, TailwindCSS, Flowbite et amour ❤️
        </p>
        <p className="text-gray-600 text-sm text-center mt-6">
          Merci à toutes les communautés Pokémon pour leur travail incroyable.
        </p>
      </div>
    </main>
  );
}
