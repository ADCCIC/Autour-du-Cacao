import Image from "next/image";
import Link from "next/link";
import { fetchYouTubeVideos, YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

export const revalidate = 3600;

export default async function VideosPage() {
  const videos = await fetchYouTubeVideos();

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-cacao-900 mb-1">Vidéos</h1>
          <p className="text-gray-600">
            Toutes nos vidéos YouTube — interviews, portraits et reportages sur le cacao.
          </p>
        </div>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.06 0 12 0 12s0 3.94.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.47 20.5 12 20.5 12 20.5s7.53 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.94 24 12 24 12s0-3.94-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
          </svg>
          S&apos;abonner
        </a>
      </div>

      {videos.length === 0 && (
        <p className="text-gray-500 text-center py-20">
          Aucune vidéo disponible pour le moment. Revenez bientôt.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link
            key={video.videoId}
            href={`/videos/${video.videoId}`}
            className="group bg-white rounded-2xl overflow-hidden border border-cacao-100 shadow-sm hover:shadow-md transition-shadow relative"
          >
            {video.featured && (
              <span className="absolute top-2 left-2 z-10 bg-sage-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                À la une
              </span>
            )}
            <div className="relative aspect-video bg-cacao-50">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{video.publishedAt}</p>
              <h2 className="text-sm font-semibold text-cacao-900 group-hover:text-cacao-700 leading-snug line-clamp-2">
                {video.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
