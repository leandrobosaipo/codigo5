import { readAllowedUserIds } from "../../_shared/bot/auth";
import { validateTelegramInitData } from "../../_shared/bot/init-data";
import type { Env } from "../../_shared/bot/types";

const getRequestUserId = async (request: Request): Promise<string | null> => {
  if (request.method === "GET") {
    const userId = new URL(request.url).searchParams.get("userId")?.trim();
    return userId && userId.length > 0 ? userId : null;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.clone().json()) as { userId?: string | number | null };
      if (typeof body.userId === "number") return String(body.userId);
      return body.userId?.trim?.() ?? null;
    } catch {
      return null;
    }
  }

  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await request.clone().formData();
      const userId = form.get("userId");
      return typeof userId === "string" ? userId.trim() : null;
    } catch {
      return null;
    }
  }

  return null;
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const requestUrl = new URL(context.request.url);
  if (context.request.method === "GET" && requestUrl.pathname === "/api/bot/posts") {
    return context.next();
  }

  const initData = context.request.headers.get("X-Telegram-Init-Data")?.trim() ?? "";
  const validation = await validateTelegramInitData(initData, context.env);
  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: validation.status });
  }

  const signedUserId = String(validation.user?.id ?? "").trim();
  const allowedUsers = readAllowedUserIds(context.env);
  if (allowedUsers.size === 0) {
    return Response.json({ ok: false, error: "Nenhum usuário autorizado configurado." }, { status: 503 });
  }

  if (!allowedUsers.has(signedUserId)) {
    return Response.json({ ok: false, error: "Usuário do Telegram não autorizado." }, { status: 403 });
  }

  const requestUserId = await getRequestUserId(context.request);
  if (!requestUserId) {
    return Response.json({ ok: false, error: "userId ausente no payload da requisição." }, { status: 400 });
  }

  if (requestUserId !== signedUserId) {
    return Response.json({ ok: false, error: "userId não confere com sessão Telegram." }, { status: 403 });
  }

  return context.next();
};
