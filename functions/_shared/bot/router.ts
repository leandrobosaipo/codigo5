import type { BotResponse, Env, TelegramMessage, TelegramUpdate } from "./types";
import { handleCommand, handleFreeText, handlePhotoMessage } from "./commands";

const getMessage = (update: TelegramUpdate): TelegramMessage | undefined =>
  update.message ?? update.edited_message;

export const routeTelegramUpdate = async (
  env: Env,
  update: TelegramUpdate,
  userId: string,
): Promise<BotResponse> => {
  const message = getMessage(update);
  if (!message?.text) {
    if (message?.photo?.length) {
      return handlePhotoMessage(env, message, userId);
    }

    return {
      text: "📭 Recebi um update sem texto reconhecível. Hoje eu trabalho com texto, comandos e foto com legenda `/capa draftId`.",
    };
  }

  if (message.text.startsWith("/")) {
    return handleCommand(env, message, userId);
  }

  return handleFreeText(env, message, userId);
};
