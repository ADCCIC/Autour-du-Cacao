import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchFeed } from "@/lib/rss";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { episodes } = await fetchFeed();
  return episodes.map((ep) => ({ id: ep.guid }));
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { channel, episodes } = await fetchFeed();
  const episode = episodes.find((ep) => ep.guid === id);
  if (!episode) notFound();

  const isAudio = episode.audioType.startsWith("audio/");

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <Link
        href="/episodes"
        className="text-sm text-amber-700 hover:text-amber-900 mb-8 inline-flex items-center gap-1"
      >
        ← {channel.title}
      </Link>

      {/* Episode art + meta */}
      <div className="flex gap-5 items-start mt-6 mb-8">
        {episode.imageUrl && (
          <Image
            src={episode.imageUrl}
            alt={episode.title}
            width={120}
            height={120}
            className="rounded-2xl shadow-sm flex-shrink-0 object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          {episode.episodeNumber && (
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
              Episode {episode.episodeNumber}
            </p>
          )}
          <h1 className="text-2xl font-bold text-amber-900 leading-tight mb-2">
            {episode.title}
          </h1>
          <p className="text-sm text-gray-400">
            {episode.pubDate}
            {episode.duration ? ` · ${episode.duration}` : ""}
          </p>
        </div>
      </div>

      {/* Audio player */}
      {episode.audioUrl && isAudio && (
        <div className="mb-8 bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <audio
            controls
            className="w-full"
            preload="metadata"
          >
            <source src={episode.audioUrl} type={episode.audioType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Links */}
      <div className="flex gap-3 mb-8">
        {episode.audioUrl && (
          <a
            href={episode.audioUrl}
            download
            className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors"
          >
            Download MP3
          </a>
        )}
        {episode.spotifyUrl && (
          <a
            href={episode.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
          >
            Listen on Spotify
          </a>
        )}
      </div>

      {/* Description */}
      <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {episode.description}
      </div>
    </div>
  );
}
