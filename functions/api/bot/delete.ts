import { archiveDraftAndPost, getDraftById } from "../../_shared/bot/db";
import { nowIso } from "../../_shared/bot/utils";
import type { Env } from "../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { draftId?: string; userId?: string; redirectTo?: string };
  try {
    body = (await request.json()) as { draftId?: string; userId?: string; redirectTo?: string };
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

  if (draft.telegramUserId !== body.userId) {
    return Response.json({ ok: false, error: "Você não pode excluir este item." }, { status: 403 });
  }

  const redirectTo = body.redirectTo?.trim() || "/blog";
  const deletedAt = nowIso();
  await archiveDraftAndPost(env, draft, redirectTo, body.userId, deletedAt);

  return Response.json({
    ok: true,
    archived: true,
    redirectFrom: draft.slug ? `/blog/${draft.slug}` : null,
    redirectTo,
    deletedAt,
  });
};
