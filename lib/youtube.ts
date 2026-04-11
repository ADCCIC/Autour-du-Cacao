import pinnedVideosRaw from "@/content/videos.json";

const CHANNEL_ID = "UCL_qC_RXbWoQ9bonFky5Fhw";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@AutourduCacao";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  embedUrl: string;
  watchUrl: string;
  featured?: boolean;
}

// Statically defined/pinned videos from content/videos.json — always shown
// even when the YouTube RSS feed is unreachable.
const PINNED_VIDEOS: YouTubeVideo[] = pinnedVideosRaw as YouTubeVideo[];

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"[^>]*>`));
  return m ? m[1] : "";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return iso;
  }
}

async function fetchRSSVideos(): Promise<YouTubeVideo[]> {
  const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);

  return entries.map((entry) => {
    const videoId = extractTag(entry, "yt:videoId");
    const title = extractTag(entry, "title");
    const description = extractTag(
      entry.replace(/<media:description>/, "<_desc>").replace(/<\/media:description>/, "</_desc>"),
      "_desc"
    ) || extractTag(entry, "media:description");
    const publishedAt = formatDate(extractTag(entry, "published"));
    const thumbnailUrl =
      extractAttr(entry, "media:thumbnail", "url") ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    return {
      videoId,
      title,
      description: description.slice(0, 300).trim(),
      publishedAt,
      thumbnailUrl,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}

/**
 * Returns videos from YouTube RSS feed merged with pinned videos.
 * Pinned videos (content/videos.json) are always included — they appear first
 * and act as a fallback when the RSS feed is unreachable.
 * RSS videos that duplicate a pinned video ID are deduplicated.
 */
export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  let rssVideos: YouTubeVideo[] = [];

  try {
    rssVideos = await fetchRSSVideos();
  } catch (err) {
    console.warn("[youtube] RSS unavailable, falling back to pinned videos only:", err);
  }

  // Merge: pinned first, then RSS videos not already in pinned list
  const pinnedIds = new Set(PINNED_VIDEOS.map((v) => v.videoId));
  const dedupedRSS = rssVideos.filter((v) => !pinnedIds.has(v.videoId));

  return [...PINNED_VIDEOS, ...dedupedRSS];
}
