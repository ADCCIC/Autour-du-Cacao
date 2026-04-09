import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/NewsletterForm";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cacao-900 to-cacao-700 text-cacao-50 py-24 px-6 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.jpg"
            alt="Autour du Cacao"
            width={280}
            height={140}
            className="h-28 w-auto object-contain bg-white/10 rounded-2xl px-4 py-2"
            priority
          />
        </div>
        <p className="text-sm font-medium text-sage-300 uppercase tracking-widest mb-4">
          Le podcast qui va au-delà du chocolat
        </p>
        <p className="text-xl text-cacao-200 max-w-2xl mx-auto mb-8">
          Deux fois par mois, Willy Gabriel et Axel Emmanuel explorent les multiples vies du cacao —
          cosmétiques, jus, engrais, innovations locales. Produit depuis Abidjan.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/episodes"
            className="inline-block bg-cacao-50 text-cacao-900 font-semibold px-8 py-3 rounded-full hover:bg-white transition-colors"
          >
            🎙 Écouter les épisodes
          </Link>
          <a
            href="https://open.spotify.com/show/4m30Q74ciNnpPuMalsKVYf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-cacao-300 text-cacao-100 font-semibold px-8 py-3 rounded-full hover:bg-cacao-800 transition-colors"
          >
            Spotify
          </a>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-5xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cacao-100">
          <div className="text-4xl mb-4">🌿</div>
          <h2 className="text-lg font-semibold text-cacao-900 mb-2">Valorisation durable</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Des coques aux cosmétiques, en passant par le biochar et les jus — on explore comment
            transformer les sous-produits du cacao en richesse.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cacao-100">
          <div className="text-4xl mb-4">🎙</div>
          <h2 className="text-lg font-semibold text-cacao-900 mb-2">Des voix de terrain</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Chercheurs, entrepreneurs, producteurs — on donne la parole aux acteurs de la filière
            qui transforment la cabosse autrement, en Afrique et ailleurs.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cacao-100">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-lg font-semibold text-cacao-900 mb-2">Impact et souveraineté</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Le cacao comme levier d&apos;impact, de créativité et de souveraineté économique pour
            les communautés africaines.
          </p>
        </div>
      </section>

      {/* Newsletter section */}
      <section className="bg-cacao-900 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-cacao-50 mb-3">
          Restez dans la boucle
        </h2>
        <p className="text-cacao-300 mb-8 max-w-xl mx-auto">
          Chaque nouvel épisode directement dans votre boîte mail. Deux fois par mois, pas de spam.
        </p>
        <div className="max-w-sm mx-auto">
          <NewsletterForm variant="compact" />
        </div>
        <Link
          href="/newsletter"
          className="inline-block mt-4 text-sm text-sage-400 hover:text-sage-200 underline"
        >
          En savoir plus
        </Link>
      </section>

      {/* Latest episodes teaser */}
      <section className="bg-cacao-100 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-cacao-900 mb-3">
          Nouveaux épisodes chaque mois
        </h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Abonnez-vous sur Spotify ou écoutez directement ici. Le flux RSS est mis à jour automatiquement.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/episodes"
            className="inline-block bg-cacao-900 text-cacao-50 font-semibold px-8 py-3 rounded-full hover:bg-cacao-800 transition-colors"
          >
            Voir tous les épisodes →
          </Link>
          <a
            href="https://api.riverside.fm/hosting/7TYf1H62.rss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-cacao-400 text-cacao-800 font-semibold px-8 py-3 rounded-full hover:bg-cacao-200 transition-colors"
          >
            RSS Feed
          </a>
        </div>
      </section>
    </div>
  );
}
