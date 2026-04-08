const RSS_URL = "https://api.riverside.fm/hosting/7TYf1H62.rss";

export interface PodcastChannel {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  language: string;
}

export interface Episode {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  duration: string;
  audioUrl: string;
  audioType: string;
  imageUrl: string;
  spotifyUrl: string;
  episodeNumber?: number;
  season?: number;
  episodeType: string;
}

export interface Feed {
  channel: PodcastChannel;
  episodes: Episode[];
}

function cdataText(raw: string): string {
  return raw.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? cdataText(m[1]) : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"[^>]*>`));
  return m ? m[1] : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(pubDate: string): string {
  try {
    return new Date(pubDate).toISOString().split("T")[0];
  } catch {
    return pubDate;
  }
}

export async function fetchFeed(): Promise<Feed> {
  const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  // Extract channel metadata (before first <item>)
  const channelXml = xml.split("<item>")[0];
  const channel: PodcastChannel = {
    title: cdataText(extractTag(channelXml, "title")),
    description: stripHtml(cdataText(extractTag(channelXml, "description"))),
    imageUrl: extractAttr(channelXml, "itunes:image", "href"),
    link: extractTag(channelXml, "link"),
    language: extractTag(channelXml, "language"),
  };

  // Extract episodes
  const itemBlocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  const episodes: Episode[] = itemBlocks.map((item) => {
    const epNumMatch = item.match(/<itunes:episode>([\s\S]*?)<\/itunes:episode>/);
    const seasonMatch = item.match(/<itunes:season>([\s\S]*?)<\/itunes:season>/);
    const imgMatch = item.match(/<itunes:image\s+href="([^"]*)"/);

    // Default to channel image if no per-episode image
    const rawImage = imgMatch ? imgMatch[1] : channel.imageUrl;

    return {
      guid: extractTag(item, "guid"),
      title: cdataText(extractTag(item, "title")).replace(/&apos;/g, "'").replace(/&amp;/g, "&"),
      description: stripHtml(cdataText(extractTag(item, "description")).replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")),
      pubDate: formatDate(extractTag(item, "pubDate")),
      duration: extractTag(item, "itunes:duration"),
      audioUrl: extractAttr(item, "enclosure", "url"),
      audioType: extractAttr(item, "enclosure", "type"),
      imageUrl: rawImage || channel.imageUrl,
      spotifyUrl: extractTag(item, "link"),
      episodeNumber: epNumMatch ? parseInt(epNumMatch[1]) : undefined,
      season: seasonMatch ? parseInt(seasonMatch[1]) : undefined,
      episodeType: extractTag(item, "itunes:episodeType") || "full",
    };
  });

  return { channel, episodes };
}
