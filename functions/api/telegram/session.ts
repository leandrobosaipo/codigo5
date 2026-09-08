import { readAllowedUserIds } from "../../_shared/bot/auth";
import { validateTelegramInitData } from "../../_shared/bot/init-data";
import type { Env } from "../../_shared/bot/types";

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "GET") {
    return Response.json({
      ok: true,
      route: "/api/telegram/session",
      methods: ["GET", "POST"],
      message: "Envie um POST com initData para validar a sessão da Mini App.",
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  }

  let body: { initData?: string };
  try {
    body = (await request.json()) as { initData?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const validation = await validateTelegramInitData(body.initData ?? "", env);
  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: validation.status });
  }

  const userId = String(validation.user?.id ?? "");
  const allowed = readAllowedUserIds(env);
  const isAuthorized = allowed.size > 0 ? allowed.has(userId) : false;

  return Response.json({
    ok: true,
    authorized: isAuthorized,
    user: validation.user ?? null,
  });
};
