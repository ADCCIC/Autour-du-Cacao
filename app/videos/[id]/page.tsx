import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchYouTubeVideos, YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

export const revalidate = 3600;

export async function generateStaticParams() {
  const videos = await fetchYouTubeVideos();
  return videos.map((v) => ({ id: v.videoId }));
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const videos = await fetchYouTubeVideos();
  const video = videos.find((v) => v.videoId === id);
  if (!video) notFound();

  const related = videos.filter((v) => v.videoId !== id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <Link
        href="/videos"
        className="text-sm text-cacao-700 hover:text-cacao-900 mb-6 inline-flex items-center gap-1"
      >
        ← Toutes les vidéos
      </Link>

      {/* Embed */}
      <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-6 mt-6">
        <iframe
          src={`${video.embedUrl}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Meta */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cacao-900 leading-tight mb-2">{video.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>{video.publishedAt}</span>
          <a
            href={video.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Voir sur YouTube ↗
          </a>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            @AutourduCacao
          </a>
        </div>
        {video.description && (
          <p className="text-gray-700 leading-relaxed">{video.description}</p>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-cacao-900 mb-4">Autres vidéos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((v) => (
              <Link key={v.videoId} href={`/videos/${v.videoId}`} className="group">
                <div className="aspect-video bg-cacao-50 rounded-xl overflow-hidden relative mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <p className="text-xs font-medium text-cacao-900 group-hover:text-cacao-700 line-clamp-2 leading-snug">
                  {v.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
