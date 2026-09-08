import type { Env, TelegramUpdate } from "./types";

export const readAllowedUserIds = (env: Env) =>
  new Set(
    (env.TELEGRAM_ALLOWED_USER_IDS ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const validateWebhookSecret = (request: Request, env: Env) => {
  const configured = env.TELEGRAM_SECRET_TOKEN?.trim();
  if (!configured) {
    return { ok: false, status: 503, message: "Webhook secret ausente no ambiente." };
  }

  const incoming = request.headers.get("X-Telegram-Bot-Api-Secret-Token")?.trim();
  if (incoming !== configured) {
    return { ok: false, status: 401, message: "Secret token do Telegram inválido." };
  }

  return { ok: true, status: 200, message: "ok" };
};

export const validateTelegramUser = (update: TelegramUpdate, env: Env) => {
  const userId = update.message?.from?.id ?? update.edited_message?.from?.id;
  if (!userId) {
    return { ok: false, status: 400, message: "Update sem usuário." };
  }

  const allowed = readAllowedUserIds(env);
  if (allowed.size === 0) {
    return { ok: false, status: 503, message: "Nenhum usuário autorizado configurado." };
  }

  if (!allowed.has(String(userId))) {
    return { ok: false, status: 403, message: "Usuário não autorizado para o bot." };
  }

  return { ok: true, status: 200, userId: String(userId) };
};
