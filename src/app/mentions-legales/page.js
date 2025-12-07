export default function MentionsLegalesPage() {
  return (
    <main
       className="flex items-center justify-center bg-cover bg-center p-6 mt-10"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40">  <h1 className="text-4xl font-extrabold text-center mb-6">
          Mentions légales
        </h1>

        <h2 className="text-2xl font-bold mt-4">Éditeur du site</h2>
        <p className="text-gray-700">
          Ce site est un projet personnel non commercial.  
          Nom de l’éditeur : **PokéDoc**  
          Email : contact@pokedoc.fr
        </p>

        <h2 className="text-2xl font-bold mt-6">Hébergement</h2>
        <p className="text-gray-700">
          Le site est hébergé par :  
          **Vercel Inc.** – 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        </p>

        <h2 className="text-2xl font-bold mt-6">Propriété intellectuelle</h2>
        <p className="text-gray-700">
          Pokémon est une marque appartenant à **Nintendo / Game Freak / The Pokémon Company**.  
          Ce site n’est **pas officiel** et n’a aucun lien avec ces entreprises.  
          Les images et noms de Pokémon sont utilisés à titre de fansite.
        </p>

        <h2 className="text-2xl font-bold mt-6">Données personnelles</h2>
        <p className="text-gray-700">
          PokéDoc ne collecte aucune donnée personnelle.  
          Aucun cookie de tracking n’est utilisé sur le site.
        </p>

        <h2 className="text-2xl font-bold mt-6">Responsabilité</h2>
        <p className="text-gray-700">
          L’auteur ne peut être tenu responsable en cas d’erreur, d’imprécision
          ou d’indisponibilité du service.
        </p>
      </div>
    </main>
  );
}
