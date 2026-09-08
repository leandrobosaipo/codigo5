import type { BotResponse, Env } from "./types";

export const sendTelegramMessage = async (env: Env, chatId: number, payload: BotResponse) => {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return { ok: false, skipped: true };
  }

  const method = payload.photo ? "sendPhoto" : "sendMessage";
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(
      payload.photo
        ? {
            chat_id: chatId,
            photo: payload.photo,
            caption: payload.text,
            ...(payload.reply_markup ? { reply_markup: payload.reply_markup } : {}),
          }
        : {
            chat_id: chatId,
            text: payload.text,
            parse_mode: "Markdown",
            ...(payload.reply_markup ? { reply_markup: payload.reply_markup } : {}),
          },
    ),
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return {
    ok: response.ok,
    skipped: false,
    status: response.status,
    body,
  };
};
