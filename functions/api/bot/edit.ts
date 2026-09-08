import { createRedirect, getDraftById, updateDraftEditorialFields } from "../../_shared/bot/db";
import { excerptFromMarkdown, renderMarkdownToHtml } from "../../_shared/bot/markdown";
import { inferSegment, inferServiceFocus, nowIso, slugify, trimText } from "../../_shared/bot/utils";
import type { Env } from "../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: {
    draftId?: string;
    sourceValue?: string;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    contentMarkdown?: string | null;
    contentHtml?: string | null;
    segment?: string | null;
    serviceFocus?: string | null;
    imageUrl?: string | null;
    userId?: string | null;
    redirectTo?: string | null;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  if (!body.draftId) {
    return Response.json({ ok: false, error: "draftId é obrigatório." }, { status: 400 });
  }

  const draft = await getDraftById(env, body.draftId);
  if (!draft) {
    return Response.json({ ok: false, error: "Rascunho não encontrado." }, { status: 404 });
  }

  const sourceValue = body.sourceValue?.trim() || draft.sourceValue;
  const title = trimText(body.title?.trim() || draft.title || sourceValue, 120);
  const slug = body.slug?.trim() ? slugify(body.slug) : draft.slug || slugify(title);
  const excerpt = trimText(body.excerpt?.trim() || draft.excerpt || sourceValue, 180);
  const seoTitle = trimText(body.seoTitle?.trim() || draft.seoTitle || title, 70);
  const seoDescription = trimText(body.seoDescription?.trim() || draft.seoDescription || excerpt, 170);
  const contentMarkdown = body.contentMarkdown?.trim() || draft.contentMarkdown || null;
  const contentHtml = contentMarkdown
    ? renderMarkdownToHtml(contentMarkdown)
    : body.contentHtml?.trim() || draft.contentHtml || null;
  const normalizedExcerpt =
    !body.excerpt?.trim() && contentMarkdown ? trimText(excerptFromMarkdown(contentMarkdown), 180) : excerpt;
  const segment = body.segment?.trim() || draft.segment || inferSegment(sourceValue);
  const serviceFocus = body.serviceFocus?.trim() || draft.serviceFocus || inferServiceFocus(sourceValue);
  const imageUrl = body.imageUrl?.trim() || draft.imageUrl || null;
  const updatedAt = nowIso();

  const updated = await updateDraftEditorialFields(env, draft.id, {
    sourceValue,
    title,
    slug,
    excerpt: normalizedExcerpt,
    seoTitle,
    seoDescription,
    contentMarkdown,
    contentHtml,
    segment,
    serviceFocus,
    imageUrl,
    updatedAt,
  });

  if (draft.status === "published" && draft.slug && slug !== draft.slug) {
    const requestedRedirect = body.redirectTo?.trim();
    const redirectTarget =
      !requestedRedirect || requestedRedirect === `/blog/${draft.slug}` ? `/blog/${slug}` : requestedRedirect;
    const actor = body.userId?.trim() || draft.telegramUserId;
    await createRedirect(env, `/blog/${draft.slug}`, redirectTarget, actor, updatedAt);
    await createRedirect(env, `/blog/${draft.slug}/`, redirectTarget, actor, updatedAt);
  }

  return Response.json({ ok: true, draft: updated });
};
