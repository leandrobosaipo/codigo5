import { getDraftById, updateDraftImageUrl } from "../../_shared/bot/db";
import { buildSpacesKey, uploadImageToSpaces } from "../../_shared/bot/spaces";
import { nowIso, slugify } from "../../_shared/bot/utils";
import type { Env } from "../../_shared/bot/types";

const normalizeExtension = (type: string) => {
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return "jpg";
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const draftId = String(form.get("draftId") ?? "").trim();
  const userId = String(form.get("userId") ?? "").trim();
  const file = form.get("file");

  if (!draftId || !userId || !(file instanceof File)) {
    return Response.json({ ok: false, error: "draftId, userId e file são obrigatórios." }, { status: 400 });
  }

  const draft = await getDraftById(env, draftId);
  if (!draft) {
    return Response.json({ ok: false, error: "Rascunho não encontrado." }, { status: 404 });
  }

  if (draft.telegramUserId !== userId) {
    return Response.json({ ok: false, error: "Você não pode alterar a capa deste item." }, { status: 403 });
  }

  const contentType = file.type || "image/jpeg";
  const extension = normalizeExtension(contentType);
  const safeBase = slugify(draft.slug || draft.title || draft.id);
  const key = buildSpacesKey(env, `${safeBase}/${safeBase}-${Date.now()}.${extension}`);
  const body = await file.arrayBuffer();
  const imageUrl = await uploadImageToSpaces(env, key, body, contentType);
  const updated = await updateDraftImageUrl(env, draft.id, imageUrl, nowIso());

  return Response.json({ ok: true, draft: updated, imageUrl });
};
