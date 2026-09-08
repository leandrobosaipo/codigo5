import { requestAdminMagicLink } from "../../../_shared/admin-auth";
import type { Env } from "../../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return Response.json({ ok: false, error: "Email é obrigatório." }, { status: 400 });
  }

  const result = await requestAdminMagicLink(env, email);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 403 });
  }

  return Response.json({
    ok: true,
    message: "Link de acesso enviado no Telegram do usuário autorizado.",
  });
};
