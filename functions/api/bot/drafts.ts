import { createDraftFromSource } from "../../_shared/bot/commands";
import { listRecentDrafts } from "../../_shared/bot/db";
import type { Env } from "../../_shared/bot/types";

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "GET") {
    const userId = new URL(request.url).searchParams.get("userId")?.trim();
    if (userId) {
      const drafts = await listRecentDrafts(env, userId);
      return Response.json({ ok: true, userId, drafts });
    }

    return Response.json({
      ok: true,
      route: "/api/bot/drafts",
      methods: ["GET", "POST"],
      message: "Envie um POST com userId e source para criar um rascunho.",
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  }

  let body: { userId?: string; source?: string };
  try {
    body = (await request.json()) as { userId?: string; source?: string };
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  if (!body.userId || !body.source) {
    return Response.json({ ok: false, error: "userId e source são obrigatórios." }, { status: 400 });
  }

  const result = await createDraftFromSource(env, body.userId, body.source);
  return Response.json({ ok: true, result });
};
