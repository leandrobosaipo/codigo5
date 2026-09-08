import { clearAdminCookie } from "../../../_shared/admin-auth";
import type { Env } from "../../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": clearAdminCookie(),
    },
  });
