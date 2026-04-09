export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-cacao-900 mb-6">À propos</h1>
      <p className="text-gray-700 leading-relaxed mb-4">
        <strong>Autour du Cacao</strong> est le podcast qui va au-delà du chocolat. Deux fois par
        mois, <strong>Willy Gabriel Mboukem II</strong> et <strong>Axel Emmanuel</strong> explorent
        les multiples vies du cacao : cosmétiques, jus, engrais, innovations locales…
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Produit depuis Abidjan, Côte d&apos;Ivoire, le podcast donne la parole aux acteurs de la
        filière qui transforment la cabosse autrement — en Afrique et ailleurs. Un rendez-vous
        inspirant pour penser le cacao comme levier d&apos;impact, de souveraineté et de créativité.
      </p>

      <h2 className="text-2xl font-semibold text-cacao-800 mt-10 mb-4">Ce qu&apos;on couvre</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Pulpe, coques et mucilage — applications et innovations</li>
        <li>Agriculture durable et agroforesterie</li>
        <li>Transformation locale et entrepreneuriat africain</li>
        <li>Recherche scientifique et bioéconomie</li>
        <li>Portraits d&apos;acteurs qui réinventent la filière cacao</li>
      </ul>

      <h2 className="text-2xl font-semibold text-cacao-800 mt-10 mb-4">Écouter</h2>
      <ul className="space-y-2 text-gray-700">
        <li>
          <a
            href="https://open.spotify.com/show/4m30Q74ciNnpPuMalsKVYf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cacao-700 underline"
          >
            Spotify
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/@AutourduCacao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cacao-700 underline"
          >
            YouTube — @AutourduCacao
          </a>
        </li>
        <li>
          <a
            href="https://medium.com/@autourducacao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cacao-700 underline"
          >
            Medium — Articles approfondis
          </a>
        </li>
        <li>
          <a
            href="https://api.riverside.fm/hosting/7TYf1H62.rss"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cacao-700 underline"
          >
            RSS Feed
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-cacao-800 mt-10 mb-4">Contact</h2>
      <p className="text-gray-700">
        Collaboration, invitations, questions ?{" "}
        <a href="mailto:autourducacao@gmail.com" className="text-cacao-700 underline">
          autourducacao@gmail.com
        </a>
      </p>
    </div>
  );
}
