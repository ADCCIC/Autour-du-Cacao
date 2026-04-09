const MEDIUM_RSS = "https://medium.com/feed/@autourducacao";

export const MEDIUM_PROFILE_URL = "https://medium.com/@autourducacao";

export interface MediumArticle {
  guid: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  thumbnailUrl: string | null;
  tags: string[];
}

function cdataText(raw: string): string {
  return raw.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m ? cdataText(m[1]) : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstImageSrc(html: string): string | null {
  // Prefer cdn-images-1.medium.com images (skip 1x1 tracking pixels)
  const m = html.match(/<img[^>]+src="(https:\/\/cdn-images[^"]+)"[^>]*>/);
  return m ? m[1] : null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function formatDate(rfc: string): string {
  try {
    return new Date(rfc).toISOString().split("T")[0];
  } catch {
    return rfc;
  }
}

export async function fetchMediumArticles(): Promise<MediumArticle[]> {
  const res = await fetch(MEDIUM_RSS, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Medium RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  return items.map((item) => {
    const title = cdataText(extractTag(item, "title"));
    const url = (item.match(/<link>([^<]+)<\/link>/) || [])[1]?.trim() ?? "";
    const guid = extractTag(item, "guid");
    const pubDate = formatDate(extractTag(item, "pubDate"));
    const encodedContent = extractTag(item, "content:encoded");
    const thumbnailUrl = firstImageSrc(encodedContent);
    const rawText = stripHtml(encodedContent);
    const excerpt = rawText.slice(0, 280).trim() + (rawText.length > 280 ? "…" : "");

    // Extract categories (tags)
    const tags = [...item.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)].map(
      (m) => m[1]
    );

    return {
      guid: guid || slugify(title),
      title,
      url,
      publishedAt: pubDate,
      excerpt,
      thumbnailUrl,
      tags,
    };
  });
}
