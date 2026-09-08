import { requireAdminSession } from "../../_shared/admin-auth";
import { createDraft } from "../../_shared/bot/db";
import { listAllDrafts } from "../../_shared/bot/db";
import { parseStructuredPrompt } from "../../_shared/bot/prompt-parser";
import type { Env } from "../../_shared/bot/types";
import { createId, inferSegment, inferServiceFocus, looksLikeUrl, nowIso, slugify, trimText } from "../../_shared/bot/utils";

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAdminSession(request, env);
  if (!auth.ok) {
    return auth.response;
  }

  if (request.method === "GET") {
    const drafts = await listAllDrafts(env);
    return Response.json({ ok: true, items: drafts });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  }

  let body: { source?: string };
  try {
    body = (await request.json()) as { source?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const sourceValue = body.source?.trim();
  if (!sourceValue) {
    return Response.json({ ok: false, error: "source é obrigatório." }, { status: 400 });
  }

  const now = nowIso();
  const mode = looksLikeUrl(sourceValue) ? "link" : "idea";
  const parsed = parseStructuredPrompt(sourceValue);
  const seed = trimText(parsed?.title || sourceValue, 80);
  const draft = await createDraft(env, {
    id: createId("draft"),
    telegramUserId: auth.session.telegramUserId ?? "admin",
    mode,
    sourceType: mode,
    sourceValue,
    title: parsed?.title || (mode === "idea" ? trimText(seed, 90) : null),
    excerpt: parsed?.excerpt,
    slug: parsed?.slug || (mode === "idea" ? slugify(seed) : null),
    seoTitle: parsed?.seoTitle,
    seoDescription: parsed?.seoDescription,
    contentMarkdown: parsed?.contentMarkdown,
    contentHtml: parsed?.contentHtml,
    segment: parsed?.segment ?? inferSegment(sourceValue),
    serviceFocus: parsed?.serviceFocus ?? inferServiceFocus(sourceValue),
    categoriesJson: parsed?.categoriesJson,
    tagsJson: parsed?.tagsJson,
    imageUrl: parsed?.imageUrl,
    imagePrompt: parsed?.imagePrompt,
    readingMinutes: parsed?.readingMinutes,
    notes: "Criado pelo painel admin da Código5.",
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ ok: true, item: draft });
};
