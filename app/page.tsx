import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-700 text-amber-50 py-24 px-6 text-center">
        <p className="text-sm font-medium text-amber-300 uppercase tracking-widest mb-3">
          Le podcast qui va au-delà du chocolat
        </p>
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Autour du Cacao
        </h1>
        <p className="text-xl text-amber-200 max-w-2xl mx-auto mb-8">
          Deux fois par mois, Willy Gabriel et Axel Emmanuel explorent les multiples vies du cacao —
          cosmétiques, jus, engrais, innovations locales. Produit depuis Abidjan.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/episodes"
            className="inline-block bg-amber-50 text-amber-900 font-semibold px-8 py-3 rounded-full hover:bg-white transition-colors"
          >
            🎙 Écouter les épisodes
          </Link>
          <a
            href="https://open.spotify.com/show/4m30Q74ciNnpPuMalsKVYf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-amber-200 text-amber-100 font-semibold px-8 py-3 rounded-full hover:bg-amber-800 transition-colors"
          >
            Spotify
          </a>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-5xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
          <div className="text-4xl mb-4">🌿</div>
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Valorisation durable</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Des coques aux cosmétiques, en passant par le biochar et les jus — on explore comment
            transformer les sous-produits du cacao en richesse.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
          <div className="text-4xl mb-4">🎙</div>
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Des voix de terrain</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Chercheurs, entrepreneurs, producteurs — on donne la parole aux acteurs de la filière
            qui transforment la cabosse autrement, en Afrique et ailleurs.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Impact et souveraineté</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Le cacao comme levier d&apos;impact, de créativité et de souveraineté économique pour
            les communautés africaines.
          </p>
        </div>
      </section>

      {/* Latest episodes teaser */}
      <section className="bg-amber-100 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-3">
          Nouveaux épisodes chaque mois
        </h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Abonnez-vous sur Spotify ou écoutez directement ici. Le flux RSS est mis à jour automatiquement.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/episodes"
            className="inline-block bg-amber-900 text-amber-50 font-semibold px-8 py-3 rounded-full hover:bg-amber-800 transition-colors"
          >
            Voir tous les épisodes →
          </Link>
          <a
            href="https://api.riverside.fm/hosting/7TYf1H62.rss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-amber-400 text-amber-800 font-semibold px-8 py-3 rounded-full hover:bg-amber-200 transition-colors"
          >
            RSS Feed
          </a>
        </div>
      </section>
    </div>
  );
}
