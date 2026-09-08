import type { Env } from "./types";

type TelegramFileResponse = {
  ok: boolean;
  result?: {
    file_path?: string;
    file_unique_id?: string;
  };
};

export const downloadTelegramPhoto = async (
  env: Env,
  fileId: string,
) => {
  if (!env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN não configurado.");
  }

  const fileResponse = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`,
  );

  const payload = (await fileResponse.json()) as TelegramFileResponse;
  if (!fileResponse.ok || !payload.ok || !payload.result?.file_path) {
    throw new Error("Não consegui localizar o arquivo enviado no Telegram.");
  }

  const filePath = payload.result.file_path;
  const downloadResponse = await fetch(
    `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${filePath}`,
  );

  if (!downloadResponse.ok) {
    throw new Error(`Falha ao baixar a imagem do Telegram (${downloadResponse.status}).`);
  }

  const body = await downloadResponse.arrayBuffer();
  const extension = filePath.split(".").pop()?.toLowerCase() ?? "jpg";
  const contentType =
    extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  return {
    body,
    extension,
    contentType,
  };
};
