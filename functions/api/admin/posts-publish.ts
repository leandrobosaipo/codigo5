import { requireAdminSession } from "../../_shared/admin-auth";
import { getDraftById, publishDraftToPosts } from "../../_shared/bot/db";
import type { Env } from "../../_shared/bot/types";
import { nowIso } from "../../_shared/bot/utils";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAdminSession(request, env);
  if (!auth.ok) {
    return auth.response;
  }

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

  if (!draft.contentHtml || !draft.title || !draft.slug) {
    return Response.json({ ok: false, error: "Gere o post antes de publicar." }, { status: 409 });
  }

  const publishedAt = nowIso();
  await publishDraftToPosts(env, draft, auth.session.telegramUserId ?? "admin", publishedAt);

  return Response.json({
    ok: true,
    url: `https://codigo5.com.br/blog/${draft.slug}`,
    publishedAt,
  });
};
