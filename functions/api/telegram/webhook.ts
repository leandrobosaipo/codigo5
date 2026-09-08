import { routeTelegramUpdate } from "../../_shared/bot/router";
import { validateTelegramUser, validateWebhookSecret } from "../../_shared/bot/auth";
import { sendTelegramMessage } from "../../_shared/bot/telegram";
import type { Env, TelegramUpdate } from "../../_shared/bot/types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const secret = validateWebhookSecret(request, env);
  if (!secret.ok) {
    return Response.json({ ok: false, error: secret.message }, { status: secret.status });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return Response.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const auth = validateTelegramUser(update, env);
  if (!auth.ok || !auth.userId) {
    return Response.json({ ok: false, error: auth.message }, { status: auth.status });
  }

  const chatId = update.message?.chat.id ?? update.edited_message?.chat.id;
  if (!chatId) {
    return Response.json({ ok: false, error: "Chat ausente no update." }, { status: 400 });
  }

  const reply = await routeTelegramUpdate(env, update, auth.userId);
  const telegramResult = await sendTelegramMessage(env, chatId, reply);

  return Response.json({
    ok: true,
    delivered: telegramResult.ok,
    skipped: telegramResult.skipped,
    telegram: telegramResult,
    reply,
  });
};
