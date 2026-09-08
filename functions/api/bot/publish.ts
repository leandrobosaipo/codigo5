import { getDraftById, publishDraftToPosts } from "../../_shared/bot/db";
import { nowIso } from "../../_shared/bot/utils";
import type { Env } from "../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { draftId?: string; userId?: string };
  try {
    body = (await request.json()) as { draftId?: string; userId?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  if (!body.draftId || !body.userId) {
    return Response.json({ ok: false, error: "draftId e userId são obrigatórios." }, { status: 400 });
  }

  const draft = await getDraftById(env, body.draftId);
  if (!draft) {
    return Response.json({ ok: false, error: "Rascunho não encontrado." }, { status: 404 });
  }

  if (!draft.contentHtml || !draft.title || !draft.slug) {
    return Response.json({ ok: false, error: "Gere o post antes de publicar." }, { status: 409 });
  }

  const publishedAt = nowIso();
  await publishDraftToPosts(env, draft, body.userId, publishedAt);

  return Response.json({
    ok: true,
    slug: draft.slug,
    url: `https://codigo5.com.br/blog/${draft.slug}`,
    publishedAt,
  });
};
