import type { Env } from "./types";

type TelegramMiniAppUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const signHmac = async (keyData: string | Uint8Array, message: string) => {
  const rawKey = typeof keyData === "string" ? encoder.encode(keyData) : keyData;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
};

const buildDataCheckString = (initData: string) => {
  const params = new URLSearchParams(initData);
  params.delete("hash");

  return Array.from(params.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
};

export const validateTelegramInitData = async (initData: string, env: Env) => {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return { ok: false, status: 503, error: "Bot token ausente no ambiente." };
  }

  if (!initData.trim()) {
    return { ok: false, status: 400, error: "initData ausente." };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    return { ok: false, status: 400, error: "Hash do Telegram ausente." };
  }

  const dataCheckString = buildDataCheckString(initData);
  const secretKey = new Uint8Array(await signHmac("WebAppData", env.TELEGRAM_BOT_TOKEN));
  const calculatedHash = toHex(await signHmac(secretKey, dataCheckString));

  if (calculatedHash !== hash) {
    return { ok: false, status: 401, error: "initData inválido." };
  }

  const userRaw = params.get("user");
  const user = userRaw ? (JSON.parse(userRaw) as TelegramMiniAppUser) : undefined;

  return {
    ok: true,
    status: 200,
    user,
  };
};
