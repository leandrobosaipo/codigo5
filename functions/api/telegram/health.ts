import type { Env } from "../../_shared/bot/types";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const dbCheck = await env.BOT_DB.prepare("SELECT 1 AS ok").first();

  return Response.json({
    ok: true,
    app: env.BOT_APP_NAME ?? "codigo5-bot",
    database: Boolean(dbCheck),
    kv: Boolean(env.BOT_SESSIONS),
    timezone: env.BOT_DEFAULT_TIMEZONE ?? "America/Cuiaba",
  });
};
