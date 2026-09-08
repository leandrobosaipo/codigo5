import {
  consumeAdminMagicLink,
  createAdminSession,
  getAdminCookieHeader,
} from "../../../_shared/admin-auth";
import type { Env } from "../../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return Response.json({ ok: false, error: "Token é obrigatório." }, { status: 400 });
  }

  const result = await consumeAdminMagicLink(env, token);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 401 });
  }

  const sessionToken = await createAdminSession(env, {
    email: result.payload.email,
    telegramUserId: result.payload.telegramUserId,
    source: "magic-link",
  });

  return new Response(
    JSON.stringify({
      ok: true,
      email: result.payload.email,
      source: "magic-link",
    }),
    {
      headers: {
        "content-type": "application/json",
        "set-cookie": getAdminCookieHeader(sessionToken),
      },
    },
  );
};
