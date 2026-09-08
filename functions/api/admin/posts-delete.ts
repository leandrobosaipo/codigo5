import { requireAdminSession } from "../../_shared/admin-auth";
import { archiveDraftAndPost, getDraftById } from "../../_shared/bot/db";
import type { Env } from "../../_shared/bot/types";
import { nowIso } from "../../_shared/bot/utils";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAdminSession(request, env);
  if (!auth.ok) {
    return auth.response;
  }

  let body: { draftId?: string; redirectTo?: string };
  try {
    body = (await request.json()) as { draftId?: string; redirectTo?: string };
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

  const deletedAt = nowIso();
  await archiveDraftAndPost(
    env,
    draft,
    body.redirectTo?.trim() || "/blog",
    auth.session.telegramUserId ?? "admin",
    deletedAt,
  );

  return Response.json({ ok: true, archived: true });
};
