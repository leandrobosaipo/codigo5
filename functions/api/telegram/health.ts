import type { Env } from "../../_shared/bot/types";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  let database = false;
  try {
    // SELECT 1 does not read a table and misses D1's exhausted read quota.
    await env.BOT_DB.prepare("SELECT id FROM posts LIMIT 1").all();
    database = true;
  } catch {
    console.warn("Editorial health: database reads unavailable.");
  }
  return Response.json({
    ok: database,
    app: env.BOT_APP_NAME ?? "codigo5-bot",
    database,
    kv: Boolean(env.BOT_SESSIONS),
    timezone: env.BOT_DEFAULT_TIMEZONE ?? "America/Cuiaba",
  }, { status: database ? 200 : 503, headers: { "cache-control": "no-store" } });
};
