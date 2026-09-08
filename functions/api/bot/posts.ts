import { getPublishedPostBySlug, listPublishedPosts } from "../../_shared/bot/db";
import type { Env } from "../../_shared/bot/types";

const parseJsonTerms = (value: unknown) => {
  if (!value) return [];
  if (typeof value !== "string") return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const mapRowToPost = (row: Record<string, unknown>) => {
  const slug = String(row.slug);
  const title = String(row.title);
  const publishedAt = String(row.published_at ?? row.updated_at ?? new Date().toISOString());
  const updatedAt = String(row.updated_at ?? publishedAt);
  const contentHtml = String(row.content_html ?? "");
  const readingMinutes = Math.max(
    3,
    Math.ceil(contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220),
  );

  return {
    id: typeof row.id === "number" ? row.id : Number(row.id) || Date.now(),
    slug,
    title,
    excerpt: String(row.excerpt ?? ""),
    contentHtml,
    date: publishedAt,
    modified: updatedAt,
    image: row.image_url ? String(row.image_url) : null,
    link: `https://codigo5.com.br/blog/${slug}`,
    seoTitle: String(row.seo_title ?? title),
    seoDescription: String(row.seo_description ?? row.excerpt ?? ""),
    categories: parseJsonTerms(row.categories_json),
    tags: parseJsonTerms(row.tags_json),
    readingMinutes,
  };
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const slug = new URL(request.url).searchParams.get("slug")?.trim();

  if (slug) {
    const row = await getPublishedPostBySlug(env, slug);
    return Response.json({ ok: true, post: row ? mapRowToPost(row) : null });
  }

  const rows = await listPublishedPosts(env);
  return Response.json({
    ok: true,
    posts: rows.map((row) => mapRowToPost(row as Record<string, unknown>)),
  });
};
