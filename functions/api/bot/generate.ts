import { getDraftById, updateDraftGeneratedContent } from "../../_shared/bot/db";
import { generateDraftContent } from "../../_shared/bot/generator";
import { nowIso, slugify } from "../../_shared/bot/utils";
import type { Env } from "../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { draftId?: string };
  try {
    body = (await request.json()) as { draftId?: string };
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

  const generated = await generateDraftContent(draft);
  const updated = await updateDraftGeneratedContent(env, draft.id, {
    title: generated.title,
    excerpt: generated.excerpt,
    slug: draft.slug || slugify(generated.title),
    seoTitle: generated.seoTitle,
    seoDescription: generated.seoDescription,
    contentMarkdown: generated.contentMarkdown,
    contentHtml: generated.contentHtml,
    categoriesJson: JSON.stringify(generated.categories),
    tagsJson: JSON.stringify(generated.tags),
    imageUrl: draft.imageUrl ?? generated.imageUrl,
    readingMinutes: generated.readingMinutes,
    updatedAt: nowIso(),
  });

  return Response.json({ ok: true, draft: updated });
};
