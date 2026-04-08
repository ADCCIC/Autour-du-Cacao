import Link from "next/link";
import Image from "next/image";
import { fetchFeed } from "@/lib/rss";

export const revalidate = 3600; // ISR: rebuild at most every hour

export default async function EpisodesPage() {
  const { channel, episodes } = await fetchFeed();

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      {/* Show header */}
      <div className="flex gap-5 items-start mb-10">
        {channel.imageUrl && (
          <Image
            src={channel.imageUrl}
            alt={channel.title}
            width={100}
            height={100}
            className="rounded-2xl shadow-sm flex-shrink-0"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-1">{channel.title}</h1>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {channel.description}
          </p>
          <div className="flex gap-3 mt-3">
            <a
              href="https://api.riverside.fm/hosting/7TYf1H62.rss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
            >
              RSS Feed
            </a>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-amber-800 mb-6">
        {episodes.length} Episode{episodes.length !== 1 ? "s" : ""}
      </h2>

      <ul className="space-y-6">
        {episodes.map((ep) => (
          <li key={ep.guid} className="border-b border-amber-100 pb-6 last:border-0">
            <div className="flex gap-4">
              {ep.imageUrl && (
                <Image
                  src={ep.imageUrl}
                  alt={ep.title}
                  width={72}
                  height={72}
                  className="rounded-xl flex-shrink-0 object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/episodes/${ep.guid}`} className="group">
                  <h3 className="text-base font-semibold text-amber-900 group-hover:text-amber-700 leading-snug mb-1">
                    {ep.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mb-2">
                  {ep.pubDate}
                  {ep.duration ? ` · ${ep.duration}` : ""}
                  {ep.episodeNumber ? ` · Ep. ${ep.episodeNumber}` : ""}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {ep.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
