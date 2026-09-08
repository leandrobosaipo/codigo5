import { requireAdminSession } from "../../_shared/admin-auth";
import { getDraftById, updateDraftImageUrl } from "../../_shared/bot/db";
import { buildSpacesKey, uploadImageToSpaces } from "../../_shared/bot/spaces";
import type { Env } from "../../_shared/bot/types";
import { nowIso, slugify } from "../../_shared/bot/utils";

const normalizeExtension = (type: string) => {
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  if (type.includes("svg")) return "svg";
  return "jpg";
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAdminSession(request, env);
  if (!auth.ok) {
    return auth.response;
  }

  const form = await request.formData();
  const draftId = String(form.get("draftId") ?? "").trim();
  const file = form.get("file");

  if (!draftId || !(file instanceof File)) {
    return Response.json({ ok: false, error: "draftId e file são obrigatórios." }, { status: 400 });
  }

  const draft = await getDraftById(env, draftId);
  if (!draft) {
    return Response.json({ ok: false, error: "Rascunho não encontrado." }, { status: 404 });
  }

  const contentType = file.type || "image/jpeg";
  const extension = normalizeExtension(contentType);
  const safeBase = slugify(draft.slug || draft.title || draft.id);
  const key = buildSpacesKey(env, `${safeBase}/${safeBase}-${Date.now()}.${extension}`);
  const body = await file.arrayBuffer();
  const imageUrl = await uploadImageToSpaces(env, key, body, contentType);
  const updated = await updateDraftImageUrl(env, draft.id, imageUrl, nowIso());

  return Response.json({ ok: true, item: updated, imageUrl });
};
