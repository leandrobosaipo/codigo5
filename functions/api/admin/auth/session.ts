import { getAdminSession } from "../../../_shared/admin-auth";
import type { Env } from "../../../_shared/bot/types";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await getAdminSession(request, env);
  if (!session) {
    return Response.json({ ok: true, authenticated: false });
  }

  return Response.json({
    ok: true,
    authenticated: true,
    session,
  });
};
