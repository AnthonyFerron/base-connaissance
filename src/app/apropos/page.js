export default function AProposPage() {
  return (
    <main className="flex items-center justify-center p-6 mt-10">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40">
        {" "}
        <h1 className="text-4xl font-extrabold text-center mb-6">À propos</h1>
        <p className="text-gray-700 mb-4">
          PokéDoc est une application créée par un passionné de Pokémon, dans le
          but d’offrir une interface claire et moderne pour explorer les
          différents Pokémon, leurs statistiques, leurs types et bien plus
          encore.
        </p>
        <p className="text-gray-700 mb-4">
          Le projet n’a aucun but commercial : c’est un **fansite**, conçu pour
          apprendre, s’amuser et rendre hommage à l’univers Pokémon.
        </p>
        <p className="text-gray-700 mb-4">
          Chaque fonctionnalité (fiches Pokémon, recherche, quiz, filtres, etc.)
          a été pensée pour rendre l’exploration fluide et intuitive.
        </p>
        <p className="text-gray-700">
          Merci de faire partie de cette aventure ✨
        </p>
      </div>
    </main>
  );
}
