import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-amber-900 mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-amber-800 mt-8 mb-4">{children}</h2>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-amber-700 underline hover:text-amber-900">
      {children}
    </a>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
