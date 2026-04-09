import Image from "next/image";
import { fetchMediumArticles, MEDIUM_PROFILE_URL } from "@/lib/medium";

export const revalidate = 3600;

export default async function ArticlesPage() {
  const articles = await fetchMediumArticles();

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-cacao-900 mb-1">Articles</h1>
          <p className="text-gray-600">
            Nos articles approfondis sur Medium — analyses, portraits et innovations cacao.
          </p>
        </div>
        <a
          href={MEDIUM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
          </svg>
          Suivre sur Medium
        </a>
      </div>

      <div className="space-y-8">
        {articles.map((article) => (
          <a
            key={article.guid}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-6 bg-white rounded-2xl border border-cacao-100 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            {article.thumbnailUrl && (
              <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-cacao-50">
                <Image
                  src={article.thumbnailUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-1">{article.publishedAt} · Medium</p>
              <h2 className="text-lg font-semibold text-cacao-900 group-hover:text-cacao-700 leading-snug mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {article.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-cacao-100 text-cacao-800 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-shrink-0 self-center text-cacao-400 group-hover:text-cacao-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
