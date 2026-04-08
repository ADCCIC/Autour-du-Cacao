#!/usr/bin/env node
/**
 * AI Content Pipeline — Cacao Rise
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts blog    --topic "cacao husk uses in cosmetics"
 *   npx tsx scripts/generate-content.ts social  --topic "cacao pulp drinks" --platform linkedin
 *   npx tsx scripts/generate-content.ts product --topic "cacao pulp concentrate" --by-product "pulp"
 *
 * Requires: ANTHROPIC_API_KEY in environment (or .env.local)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Load .env.local if present
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CONTENT_DIR = path.join(process.cwd(), "content");
const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");

// ─── Prompts ─────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the editorial AI for Cacao Rise — a media company promoting the valorization of cacao by-products (pulp, husk, nibs, butter, husks, and more). Your writing is:
- Authoritative, data-driven, and grounded in real science and market data
- Optimistic about innovation without being promotional or salesy
- Accessible to a broad audience (food enthusiasts, entrepreneurs, researchers, investors)
- Always mindful of the impact on smallholder farmers in cacao-growing regions
- SEO-aware but natural-sounding

You write exclusively about cacao by-products and their valorization. Stay on brand.`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Blog Post Generator ──────────────────────────────────────────────────────

async function generateBlogPost(topic: string, tags?: string): Promise<string> {
  const prompt = `Write a long-form editorial blog post (800–1200 words) for Cacao Rise on this topic: "${topic}"

Requirements:
- MDX format with YAML frontmatter (title, date: ${today()}, author: "Cacao Rise Editorial", excerpt, tags array)
- Compelling headline in the frontmatter title
- Use markdown headings (##) to structure the piece
- Include real-world examples, market data, or scientific context where relevant
- End with a clear takeaway or call to reflection
- Tags: ${tags ?? "cacao by-products, valorization, sustainability"}

Output ONLY the raw MDX file content — no explanation, no code fences.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text in response");
  return text.text;
}

// ─── Social Post Generator ────────────────────────────────────────────────────

async function generateSocialPost(
  topic: string,
  platform: "linkedin" | "twitter" | "instagram" = "linkedin"
): Promise<string> {
  const constraints: Record<string, string> = {
    linkedin: "200–400 words, professional tone, line breaks for readability, 3–5 hashtags",
    twitter: "Under 280 characters. Punchy. One surprising fact or hook. 1–2 hashtags.",
    instagram:
      "150–300 words, conversational and visual tone, emojis encouraged, 5–10 hashtags at the end",
  };

  const prompt = `Write a ${platform} post for Cacao Rise on this topic: "${topic}"

Constraints: ${constraints[platform]}

Always include at least one of: #CacaoRise #CacaoByProducts #Valorization

Output ONLY the post text — no explanation, no labels.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text in response");
  return text.text;
}

// ─── Product Description Generator ───────────────────────────────────────────

async function generateProductDescription(
  product: string,
  byProduct: string,
  useCase?: string
): Promise<string> {
  const prompt = `Write a product description (75–150 words) for a cacao by-product offering:

Product: ${product}
By-product type: ${byProduct}
Use case: ${useCase ?? "general consumer or B2B food ingredient"}

The description should:
- Lead with the sensory or benefit hook
- Mention the sustainability / valorization angle in 1 sentence
- Be factual and appealing
- Not use empty superlatives like "amazing" or "revolutionary"

Output ONLY the description text.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text in response");
  return text.text;
}

// ─── Save Draft ───────────────────────────────────────────────────────────────

function saveDraft(content: string, slug: string, type: string): string {
  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  const filename =
    type === "blog"
      ? `${slug}.mdx`
      : type === "social"
        ? `${slug}-social.txt`
        : `${slug}-product.txt`;
  const filepath = path.join(DRAFTS_DIR, filename);
  fs.writeFileSync(filepath, content, "utf-8");
  return filepath;
}

// ─── Approve Draft (move to posts) ───────────────────────────────────────────

function approveDraft(draftFilename: string): void {
  const src = path.join(DRAFTS_DIR, draftFilename);
  if (!fs.existsSync(src)) {
    console.error(`Draft not found: ${src}`);
    process.exit(1);
  }
  if (!draftFilename.endsWith(".mdx")) {
    console.error("Only .mdx blog drafts can be approved and published to posts/");
    process.exit(1);
  }
  const dest = path.join(POSTS_DIR, draftFilename);
  fs.copyFileSync(src, dest);
  fs.unlinkSync(src);
  console.log(`\n✓ Draft approved and moved to ${dest}`);
}

// ─── List Drafts ──────────────────────────────────────────────────────────────

function listDrafts(): void {
  if (!fs.existsSync(DRAFTS_DIR)) {
    console.log("No drafts directory found.");
    return;
  }
  const files = fs.readdirSync(DRAFTS_DIR);
  if (files.length === 0) {
    console.log("No drafts pending review.");
    return;
  }
  console.log("\nPending drafts:");
  files.forEach((f) => console.log(`  • ${f}`));
}

// ─── CLI Entry ────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help") {
    console.log(`
Cacao Rise Content Pipeline

Commands:
  blog       Generate a blog post draft
  social     Generate a social media post
  product    Generate a product description
  approve    Move an .mdx draft to content/posts/
  list       List pending drafts

Options:
  --topic        Content topic (required for generate commands)
  --platform     Social platform: linkedin | twitter | instagram  [default: linkedin]
  --by-product   By-product type for product descriptions
  --use-case     Use case for product descriptions
  --tags         Comma-separated tags for blog posts
  --slug         Override the auto-generated file slug

Examples:
  npx tsx scripts/generate-content.ts blog --topic "cacao husk bioplastics"
  npx tsx scripts/generate-content.ts social --topic "cacao pulp drinks" --platform twitter
  npx tsx scripts/generate-content.ts product --topic "Cacao Pulp Concentrate" --by-product pulp
  npx tsx scripts/generate-content.ts approve cacao-husk-bioplastics.mdx
  npx tsx scripts/generate-content.ts list
`);
    return;
  }

  if (command === "list") {
    listDrafts();
    return;
  }

  if (command === "approve") {
    const filename = args[1];
    if (!filename) {
      console.error("Usage: approve <draft-filename>");
      process.exit(1);
    }
    approveDraft(filename);
    return;
  }

  // Parse flags
  const flags: Record<string, string> = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      flags[key] = args[i + 1] ?? "true";
      i++;
    }
  }

  const topic = flags["topic"];
  if (!topic) {
    console.error("--topic is required");
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set. Add it to .env.local or your environment.");
    process.exit(1);
  }

  const slug = flags["slug"] ?? slugify(topic);

  console.log(`\nGenerating ${command} content for: "${topic}" …`);

  let content: string;
  let filepath: string;

  if (command === "blog") {
    content = await generateBlogPost(topic, flags["tags"]);
    filepath = saveDraft(content, slug, "blog");
    console.log(`\n✓ Blog draft saved to: ${filepath}`);
    console.log(`  Review and run: npx tsx scripts/generate-content.ts approve ${path.basename(filepath)}`);
  } else if (command === "social") {
    const platform = (flags["platform"] ?? "linkedin") as "linkedin" | "twitter" | "instagram";
    content = await generateSocialPost(topic, platform);
    filepath = saveDraft(content, `${slug}-${platform}`, "social");
    console.log(`\n✓ ${platform} post saved to: ${filepath}`);
  } else if (command === "product") {
    content = await generateProductDescription(topic, flags["by-product"] ?? "cacao", flags["use-case"]);
    filepath = saveDraft(content, slug, "product");
    console.log(`\n✓ Product description saved to: ${filepath}`);
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }

  console.log("\n--- Preview ---\n");
  console.log(content.slice(0, 500) + (content.length > 500 ? "\n…[truncated]" : ""));
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
