import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter — Autour du Cacao",
  description:
    "Abonnez-vous à la newsletter Autour du Cacao et recevez chaque nouvel épisode directement dans votre boîte mail.",
};

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="text-center mb-10">
        <span className="text-5xl block mb-4">🍫</span>
        <h1 className="text-4xl font-bold text-cacao-900 mb-4">Newsletter</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Recevez chaque nouvel épisode et nos articles exclusifs directement dans
          votre boîte mail. Deux fois par mois — pas de spam.
        </p>
      </div>

      <div className="bg-white border border-cacao-100 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-cacao-900 mb-2">
          Rejoignez la communauté
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Des analyses approfondies sur la valorisation du cacao : cosmétiques, jus,
          biomatériaux, agroforesterie… Réservé aux abonnés.
        </p>

        <NewsletterForm variant="hero" />
      </div>

      <ul className="mt-10 space-y-3 text-sm text-gray-500">
        <li className="flex items-center gap-2">
          <span className="text-cacao-600">✓</span> Gratuit, pour toujours
        </li>
        <li className="flex items-center gap-2">
          <span className="text-cacao-600">✓</span> Deux fois par mois, pas plus
        </li>
        <li className="flex items-center gap-2">
          <span className="text-cacao-600">✓</span> Désabonnement en un clic
        </li>
      </ul>
    </div>
  );
}
