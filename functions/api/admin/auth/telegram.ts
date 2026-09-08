import {
  createAdminSession,
  createTelegramAdminSession,
  getAdminCookieHeader,
} from "../../../_shared/admin-auth";
import type { Env } from "../../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { initData?: string };
  try {
    body = (await request.json()) as { initData?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const result = await createTelegramAdminSession(env, body.initData ?? "");
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: result.status });
  }

  const sessionToken = await createAdminSession(env, {
    email: result.email,
    telegramUserId: result.telegramUserId,
    source: "telegram",
  });

  return new Response(
    JSON.stringify({
      ok: true,
      email: result.email,
      telegramUserId: result.telegramUserId,
      source: "telegram",
    }),
    {
      headers: {
        "content-type": "application/json",
        "set-cookie": getAdminCookieHeader(sessionToken),
      },
    },
  );
};
