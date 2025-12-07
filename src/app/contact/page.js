export default function ContactPage() {
  return (
    <main
      className="flex items-center justify-center bg-cover bg-center p-6 mt-10"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40">

        <h1 className="text-3xl font-extrabold text-center">
          📩 Contact
        </h1>

        <p className="text-gray-700 mt-4">
          Une question, une idée ou une suggestion ?  
          N’hésite pas à m’envoyer un message :
        </p>

        <div className="mt-6 space-y-3 text-gray-700">
          <p><strong>Email :</strong> contact@pokedoc.com</p>
          <p><strong>Instagram :</strong> @pokedoc</p>
          <p><strong>Discord :</strong> PokeDoc Community</p>
        </div>

      </div>
    </main>
  );
}
