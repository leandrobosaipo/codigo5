import { getDraftById, updateDraftImagePrompt } from "../../_shared/bot/db";
import { createImagePrompt } from "../../_shared/bot/image-prompt";
import { nowIso } from "../../_shared/bot/utils";
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

  const imagePrompt = createImagePrompt(draft);
  const updated = await updateDraftImagePrompt(env, draft.id, imagePrompt, nowIso());

  return Response.json({ ok: true, draft: updated, imagePrompt });
};
