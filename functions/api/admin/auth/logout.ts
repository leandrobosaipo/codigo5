import { cookie, readCookie, requireAdminSession, sessionCookie } from "../../../_shared/admin-auth";
import type { Env } from "../../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = await requireAdminSession(request, env);
  if (!auth.ok) return auth.response;
  await env.BOT_SESSIONS.delete("google-session:" + readCookie(request, sessionCookie));
  return Response.json({ ok: true }, { headers: { "set-cookie": cookie(sessionCookie, "", 0) } });
};
