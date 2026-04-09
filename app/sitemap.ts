import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { fetchFeed } from "@/lib/rss";
import { fetchYouTubeVideos } from "@/lib/youtube";
import { fetchMediumArticles } from "@/lib/medium";

const BASE_URL = "https://autourducacao.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const [{ episodes }, videos] = await Promise.all([fetchFeed(), fetchYouTubeVideos()]);
  // Medium articles link out to medium.com — include /articles index in sitemap only

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/episodes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((ep) => ({
    url: `${BASE_URL}/episodes/${ep.guid}`,
    lastModified: new Date(ep.pubDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const videoRoutes: MetadataRoute.Sitemap = videos.map((v) => ({
    url: `${BASE_URL}/videos/${v.videoId}`,
    lastModified: new Date(v.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...episodeRoutes, ...videoRoutes, ...postRoutes];
}
