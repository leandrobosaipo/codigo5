import type { DraftRecord, Env } from "./types";

const mapDraft = (row: Record<string, unknown>): DraftRecord => ({
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
  contentMarkdown: row.content_markdown ? String(row.content_markdown) : null,
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

export const createDraft = async (
  env: Env,
  draft: {
    id: string;
    telegramUserId: string;
    mode: "idea" | "link";
    sourceType: "idea" | "link";
    sourceValue: string;
    title?: string | null;
    excerpt?: string | null;
    slug?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    contentMarkdown?: string | null;
    contentHtml?: string | null;
    segment?: string | null;
    serviceFocus?: string | null;
    categoriesJson?: string | null;
    tagsJson?: string | null;
    imageUrl?: string | null;
    imagePrompt?: string | null;
    readingMinutes?: number | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  },
) => {
  await env.BOT_DB.prepare(
    `INSERT INTO drafts (
      id, telegram_user_id, status, mode, source_type, source_value, title, excerpt, slug, seo_title, seo_description,
      content_markdown, content_html, segment, service_focus, categories_json, tags_json, image_url, image_prompt, reading_minutes,
      notes, created_at, updated_at
    ) VALUES (?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      draft.id,
      draft.telegramUserId,
      draft.mode,
      draft.sourceType,
      draft.sourceValue,
      draft.title ?? null,
      draft.excerpt ?? null,
      draft.slug ?? null,
      draft.seoTitle ?? null,
      draft.seoDescription ?? null,
      draft.contentMarkdown ?? null,
      draft.contentHtml ?? null,
      draft.segment ?? null,
      draft.serviceFocus ?? null,
      draft.categoriesJson ?? null,
      draft.tagsJson ?? null,
      draft.imageUrl ?? null,
      draft.imagePrompt ?? null,
      draft.readingMinutes ?? null,
      draft.notes ?? null,
      draft.createdAt,
      draft.updatedAt,
    )
    .run();

  return getDraftById(env, draft.id);
};

export const getDraftById = async (env: Env, id: string): Promise<DraftRecord | null> => {
  const result = await env.BOT_DB.prepare(`SELECT * FROM drafts WHERE id = ? LIMIT 1`).bind(id).first();
  return result ? mapDraft(result as Record<string, unknown>) : null;
};

export const getDraftBySlug = async (env: Env, slug: string): Promise<DraftRecord | null> => {
  const result = await env.BOT_DB.prepare(`SELECT * FROM drafts WHERE slug = ? LIMIT 1`).bind(slug).first();
  return result ? mapDraft(result as Record<string, unknown>) : null;
};

export const getDraftByIdOrSlug = async (
  env: Env,
  telegramUserId: string,
  identifier: string,
): Promise<DraftRecord | null> => {
  const result = await env.BOT_DB.prepare(
    `SELECT * FROM drafts WHERE telegram_user_id = ? AND (id = ? OR slug = ?) ORDER BY updated_at DESC LIMIT 1`,
  )
    .bind(telegramUserId, identifier, identifier)
    .all<Record<string, unknown>>();

  return result.results?.[0] ? mapDraft(result.results[0]) : null;
};

export const listRecentDrafts = async (env: Env, telegramUserId: string): Promise<DraftRecord[]> => {
  const result = await env.BOT_DB.prepare(
    `SELECT * FROM drafts WHERE telegram_user_id = ? ORDER BY updated_at DESC LIMIT 5`,
  )
    .bind(telegramUserId)
    .all<Record<string, unknown>>();

  return (result.results ?? []).map(mapDraft);
};

export const listAllDrafts = async (env: Env): Promise<DraftRecord[]> => {
  const result = await env.BOT_DB.prepare(
    `SELECT * FROM drafts ORDER BY updated_at DESC LIMIT 100`,
  ).all<Record<string, unknown>>();

  return (result.results ?? []).map(mapDraft);
};

export const updateDraftGeneratedContent = async (
  env: Env,
  draftId: string,
  payload: {
    title: string;
    excerpt: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    contentMarkdown: string | null;
    contentHtml: string;
    categoriesJson: string;
    tagsJson: string;
    imageUrl: string | null;
    readingMinutes: number;
    updatedAt: string;
  },
) => {
  await env.BOT_DB.prepare(
    `UPDATE drafts
      SET title = ?, excerpt = ?, slug = ?, seo_title = ?, seo_description = ?, content_markdown = ?, content_html = ?, categories_json = ?, tags_json = ?, image_url = ?, reading_minutes = ?, updated_at = ?
      WHERE id = ?`,
  )
    .bind(
      payload.title,
      payload.excerpt,
      payload.slug,
      payload.seoTitle,
      payload.seoDescription,
      payload.contentMarkdown,
      payload.contentHtml,
      payload.categoriesJson,
      payload.tagsJson,
      payload.imageUrl,
      payload.readingMinutes,
      payload.updatedAt,
      draftId,
    )
    .run();

  return getDraftById(env, draftId);
};

export const updateDraftSource = async (
  env: Env,
  draftId: string,
  payload: {
    sourceValue: string;
    title: string | null;
    slug: string | null;
    segment: string | null;
    serviceFocus: string | null;
    updatedAt: string;
  },
) => {
  await env.BOT_DB.prepare(
    `UPDATE drafts
      SET status = 'draft', source_value = ?, title = ?, slug = ?, segment = ?, service_focus = ?,
          excerpt = NULL, seo_title = NULL, seo_description = NULL, content_markdown = NULL, content_html = NULL,
          categories_json = NULL, tags_json = NULL, image_prompt = NULL, reading_minutes = NULL,
          updated_at = ?
      WHERE id = ?`,
  )
    .bind(
      payload.sourceValue,
      payload.title,
      payload.slug,
      payload.segment,
      payload.serviceFocus,
      payload.updatedAt,
      draftId,
    )
    .run();

  return getDraftById(env, draftId);
};

export const updateDraftEditorialFields = async (
  env: Env,
  draftId: string,
  payload: {
    sourceValue: string;
    title: string | null;
    slug: string | null;
    excerpt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    contentMarkdown: string | null;
    contentHtml: string | null;
    segment: string | null;
    serviceFocus: string | null;
    imageUrl: string | null;
    updatedAt: string;
  },
) => {
  await env.BOT_DB.prepare(
    `UPDATE drafts
      SET source_value = ?, title = ?, slug = ?, excerpt = ?, seo_title = ?, seo_description = ?,
          content_markdown = ?, content_html = ?, segment = ?, service_focus = ?, image_url = ?, updated_at = ?
      WHERE id = ?`,
  )
    .bind(
      payload.sourceValue,
      payload.title,
      payload.slug,
      payload.excerpt,
      payload.seoTitle,
      payload.seoDescription,
      payload.contentMarkdown,
      payload.contentHtml,
      payload.segment,
      payload.serviceFocus,
      payload.imageUrl,
      payload.updatedAt,
      draftId,
    )
    .run();

  await env.BOT_DB.prepare(
    `UPDATE posts
      SET slug = ?, title = ?, excerpt = ?, seo_title = ?, seo_description = ?, content_markdown = ?, content_html = ?, image_url = ?, updated_at = ?, canonical_url = ?
      WHERE id = ?`,
  )
    .bind(
      payload.slug,
      payload.title,
      payload.excerpt,
      payload.seoTitle,
      payload.seoDescription,
      payload.contentMarkdown,
      payload.contentHtml,
      payload.imageUrl,
      payload.updatedAt,
      payload.slug ? `https://codigo5.com.br/blog/${payload.slug}` : null,
      draftId,
    )
    .run();

  return getDraftById(env, draftId);
};

export const createRedirect = async (
  env: Env,
  sourcePath: string,
  targetPath: string,
  createdBy: string,
  createdAt: string,
  reason = "slug atualizada pelo bot",
) => {
  await env.BOT_DB.prepare(
    `INSERT OR REPLACE INTO redirects (source_path, target_path, status_code, reason, created_at, created_by)
     VALUES (?, ?, 301, ?, ?, ?)`,
  )
    .bind(sourcePath, targetPath, reason, createdAt, createdBy)
    .run();
};

export const updateDraftImagePrompt = async (
  env: Env,
  draftId: string,
  imagePrompt: string,
  updatedAt: string,
) => {
  await env.BOT_DB.prepare(`UPDATE drafts SET image_prompt = ?, updated_at = ? WHERE id = ?`)
    .bind(imagePrompt, updatedAt, draftId)
    .run();

  return getDraftById(env, draftId);
};

export const updateDraftImageUrl = async (
  env: Env,
  draftId: string,
  imageUrl: string,
  updatedAt: string,
) => {
  await env.BOT_DB.prepare(`UPDATE drafts SET image_url = ?, updated_at = ? WHERE id = ?`)
    .bind(imageUrl, updatedAt, draftId)
    .run();

  await env.BOT_DB.prepare(`UPDATE posts SET image_url = ?, updated_at = ? WHERE id = ?`)
    .bind(imageUrl, updatedAt, draftId)
    .run();

  return getDraftById(env, draftId);
};

export const publishDraftToPosts = async (
  env: Env,
  draft: DraftRecord,
  updatedBy: string,
  publishedAt: string,
) => {
  await env.BOT_DB.prepare(
    `INSERT OR REPLACE INTO posts (
      id, slug, title, excerpt, seo_title, seo_description, image_url, content_markdown, content_html, categories_json, tags_json, status, canonical_url, published_at, updated_at, created_by, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?)`,
  )
    .bind(
      draft.id,
      draft.slug,
      draft.title,
      draft.excerpt ?? "",
      draft.seoTitle ?? draft.title,
      draft.seoDescription ?? draft.excerpt ?? "",
      draft.imageUrl ?? null,
      draft.contentMarkdown ?? null,
      draft.contentHtml ?? "",
      draft.categoriesJson ?? "[]",
      draft.tagsJson ?? "[]",
      `https://codigo5.com.br/blog/${draft.slug}`,
      publishedAt,
      publishedAt,
      draft.telegramUserId,
      updatedBy,
    )
    .run();

  await env.BOT_DB.prepare(`UPDATE drafts SET status = 'published', updated_at = ? WHERE id = ?`)
    .bind(publishedAt, draft.id)
    .run();
};

export const listPublishedPosts = async (env: Env) => {
  const result = await env.BOT_DB.prepare(
    `SELECT * FROM posts WHERE status = 'published'
     AND NOT EXISTS (SELECT 1 FROM redirects WHERE source_path = '/blog/' || posts.slug)
     ORDER BY published_at DESC, updated_at DESC`,
  ).all<Record<string, unknown>>();

  return result.results ?? [];
};

export const archiveDraftAndPost = async (
  env: Env,
  draft: DraftRecord,
  targetPath: string,
  createdBy: string,
  createdAt: string,
) => {
  if (draft.slug) {
    const sourcePath = `/blog/${draft.slug}`;
    await env.BOT_DB.prepare(
      `INSERT OR REPLACE INTO redirects (source_path, target_path, status_code, reason, created_at, created_by)
       VALUES (?, ?, 301, ?, ?, ?)`,
    )
      .bind(sourcePath, targetPath, "post removido pelo bot", createdAt, createdBy)
      .run();

    await env.BOT_DB.prepare(
      `INSERT OR REPLACE INTO redirects (source_path, target_path, status_code, reason, created_at, created_by)
       VALUES (?, ?, 301, ?, ?, ?)`,
    )
      .bind(`${sourcePath}/`, targetPath, "post removido pelo bot", createdAt, createdBy)
      .run();
  }

  await env.BOT_DB.prepare(`UPDATE posts SET status = 'archived', updated_at = ? WHERE id = ?`)
    .bind(createdAt, draft.id)
    .run();

  await env.BOT_DB.prepare(`UPDATE drafts SET status = 'archived', updated_at = ? WHERE id = ?`)
    .bind(createdAt, draft.id)
    .run();
};

export const getRedirectBySourcePath = async (env: Env, sourcePath: string) => {
  const result = await env.BOT_DB.prepare(
    `SELECT source_path, target_path, status_code FROM redirects WHERE source_path = ? LIMIT 1`,
  )
    .bind(sourcePath)
    .all<Record<string, unknown>>();

  return result.results?.[0] ?? null;
};

export const getPublishedPostBySlug = async (env: Env, slug: string) => {
  const result = await env.BOT_DB.prepare(
    `SELECT * FROM posts WHERE slug = ? AND status = 'published' LIMIT 1`,
  )
    .bind(slug)
    .all<Record<string, unknown>>();

  return result.results?.[0] ?? null;
};
