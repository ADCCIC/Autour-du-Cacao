import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">Blog</h1>
      <p className="text-gray-600 mb-12">
        Insights on cacao by-products, valorization, and the future of sustainable cacao.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Check back soon.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-amber-100 pb-8">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-xl font-semibold text-amber-900 group-hover:text-amber-700 mb-1">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-400 mb-3">
                {post.date} · {post.author}
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
