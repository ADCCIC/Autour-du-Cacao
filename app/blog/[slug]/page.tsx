import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts } from "@/lib/posts";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function parseFrontmatter(raw: string): { meta: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const meta: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^"|"$/g, ""));
    } else {
      meta[key] = value.replace(/^"|"$/g, "");
    }
  }
  return { meta, content: match[2] };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const fallbackPath = path.join(POSTS_DIR, `${slug}.md`);
  const resolvedPath = fs.existsSync(filePath)
    ? filePath
    : fs.existsSync(fallbackPath)
    ? fallbackPath
    : null;

  if (!resolvedPath) notFound();

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);

  return (
    <article className="max-w-2xl mx-auto py-16 px-6">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-cacao-900 mb-3 leading-tight">
          {meta.title as string}
        </h1>
        <p className="text-sm text-gray-400">
          {meta.date as string} · {meta.author as string}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {((meta.tags as string[]) ?? []).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-cacao-100 text-cacao-800 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className="prose prose-amber max-w-none">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
