import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { validateTelegramInitData } from "../../functions/_shared/bot/init-data";
import type { Env } from "../../functions/_shared/bot/types";

const BOT_TOKEN = "test-bot-token-for-hmac-fixture";

const createEnv = (): Env =>
  ({
    BOT_APP_NAME: "test",
    BOT_DEFAULT_TIMEZONE: "America/Cuiaba",
    TELEGRAM_BOT_TOKEN: BOT_TOKEN,
    BOT_DB: {} as D1Database,
    BOT_SESSIONS: {} as KVNamespace,
  }) as Env;

const createInitData = () => {
  const user = JSON.stringify({
    id: 496154083,
    first_name: "Leandro",
    username: "leandrobosaipo",
  });

  const params = new URLSearchParams({
    auth_date: "1776194652",
    query_id: "AAHdF6IQAAAAAN0XohDhrOrc",
    user,
  });

  const dataCheckString = Array.from(params.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  params.set("hash", hash);
  return params.toString();
};

describe("telegram init data", () => {
  it("validates a correct payload", async () => {
    const result = await validateTelegramInitData(createInitData(), createEnv());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user?.id).toBe(496154083);
      expect(result.user?.first_name).toBe("Leandro");
    }
  });

  it("rejects an invalid payload", async () => {
    const result = await validateTelegramInitData("auth_date=1&hash=invalido", createEnv());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(401);
    }
  });
});
