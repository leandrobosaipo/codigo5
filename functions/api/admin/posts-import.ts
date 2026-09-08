import { requireAdminSession } from "../../_shared/admin-auth";
import { getDraftBySlug } from "../../_shared/bot/db";
import type { DraftRecord, Env } from "../../_shared/bot/types";
import { createId, nowIso } from "../../_shared/bot/utils";

type ImportPayload = {
  sourceValue?: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  contentHtml?: string | null;
  categoriesJson?: string | null;
  tagsJson?: string | null;
  imageUrl?: string | null;
  updatedAt?: string | null;
};

const mapDraftLike = (row: Record<string, unknown>): DraftRecord => ({
  id: String(row.id),
  telegramUserId: String(row.telegram_user_id),
  status: String(row.status) as DraftRecord["status"],
  mode: String(row.mode) as DraftRecord["mode"],
  sourceType: String(row.source_type) as DraftRecord["sourceType"],
  sourceValue: String(row.source_value),
  title: row.title ? String(row.title) : null,
  excerpt: row.excerpt ? String(row.excerpt) : null,
  slug: row.slug ? String(row.slug) : null,
  seoTitle: row.seo_title ? String(row.seo_title) : null,
  seoDescription: row.seo_description ? String(row.seo_description) : null,
  contentHtml: row.content_html ? String(row.content_html) : null,
  segment: row.segment ? String(row.segment) : null,
  serviceFocus: row.service_focus ? String(row.service_focus) : null,
  categoriesJson: row.categories_json ? String(row.categories_json) : null,
  tagsJson: row.tags_json ? String(row.tags_json) : null,
  imageUrl: row.image_url ? String(row.image_url) : null,
  imagePrompt: row.image_prompt ? String(row.image_prompt) : null,
  readingMinutes: typeof row.reading_minutes === "number" ? row.reading_minutes : row.reading_minutes ? Number(row.reading_minutes) : null,
  notes: row.notes ? String(row.notes) : null,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAdminSession(request, env);
  if (!auth.ok) {
    return auth.response;
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  let body: ImportPayload;
  try {
    body = (await request.json()) as ImportPayload;
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const slug = body.slug?.trim();
  const title = body.title?.trim();
  if (!slug || !title) {
    return Response.json({ ok: false, error: "slug e title são obrigatórios." }, { status: 400 });
  }

  const existing = await getDraftBySlug(env, slug);
  if (existing) {
    return Response.json({ ok: true, item: existing });
  }

  const now = nowIso();
  const id = createId("draft");
  const sourceValue = body.sourceValue?.trim() || body.excerpt?.trim() || title;
  const canonicalUrl = `https://codigo5.com.br/blog/${slug}`;

  await env.BOT_DB.prepare(
    `INSERT INTO drafts (
      id, telegram_user_id, status, mode, source_type, source_value, title, excerpt, slug,
      seo_title, seo_description, content_html, categories_json, tags_json, image_url,
      notes, created_at, updated_at
    ) VALUES (?, ?, 'published', 'idea', 'idea', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      auth.session.telegramUserId ?? "admin",
      sourceValue,
      title,
      body.excerpt?.trim() || null,
      slug,
      body.seoTitle?.trim() || title,
      body.seoDescription?.trim() || body.excerpt?.trim() || null,
      body.contentHtml?.trim() || "",
      body.categoriesJson ?? "[]",
      body.tagsJson ?? "[]",
      body.imageUrl?.trim() || null,
      "Importado do acervo estático para edição no admin.",
      body.updatedAt ?? now,
      now,
    )
    .run();

  await env.BOT_DB.prepare(
    `INSERT OR REPLACE INTO posts (
      id, slug, title, excerpt, seo_title, seo_description, image_url, content_html,
      categories_json, tags_json, status, canonical_url, published_at, updated_at, created_by, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      slug,
      title,
      body.excerpt?.trim() || "",
      body.seoTitle?.trim() || title,
      body.seoDescription?.trim() || body.excerpt?.trim() || "",
      body.imageUrl?.trim() || null,
      body.contentHtml?.trim() || "",
      body.categoriesJson ?? "[]",
      body.tagsJson ?? "[]",
      canonicalUrl,
      body.updatedAt ?? now,
      now,
      auth.session.email,
      auth.session.email,
    )
    .run();

  const result = await env.BOT_DB.prepare(`SELECT * FROM drafts WHERE id = ? LIMIT 1`).bind(id).first();
  return Response.json({ ok: true, item: result ? mapDraftLike(result as Record<string, unknown>) : null });
};
