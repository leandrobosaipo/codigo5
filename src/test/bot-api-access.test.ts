import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../../functions/_shared/bot/types";
import { onRequest } from "../../functions/api/bot/_middleware";

const BOT_TOKEN = "test-bot-token-for-hmac-fixture";

const createInitData = (userId: number) => {
  const user = JSON.stringify({ id: userId, first_name: "Leandro", username: "leandro" });
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

const createEnv = (overrides: Partial<Env> = {}) =>
  ({
    BOT_DB: {} as D1Database,
    BOT_SESSIONS: {} as KVNamespace,
    TELEGRAM_BOT_TOKEN: BOT_TOKEN,
    TELEGRAM_ALLOWED_USER_IDS: "1001",
    ...overrides,
  }) as Env;

const requestContext = async (path: string, options: RequestInit = {}, env: Env) => {
  const request = new Request(`https://example.com${path}`, options);
  const next = vi.fn(async () => Response.json({ ok: true, route: "/api/bot/mock" }));
  const response = await onRequest({ request, env, next } as never);

  return { response, next };
};

const createThrowingDbEnv = () => {
  let dbTouched = false;
  return {
    dbTouched: () => dbTouched,
    env: {
      ...createEnv(),
      BOT_DB: new Proxy({} as object, {
        get: () => {
          dbTouched = true;
          throw new Error("DB accessed from middleware layer");
        },
      }),
    } as Env,
  };
};

describe("bot API access guard", () => {
  it("allows public access on GET /api/bot/posts", async () => {
    const { response, next } = await requestContext("/api/bot/posts", {}, createEnv());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, route: "/api/bot/mock" });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects anonymous /api/bot calls before accessing DB", async () => {
    const { env, dbTouched } = createThrowingDbEnv();
    const { response, next } = await requestContext("/api/bot/drafts", { method: "GET" }, env);

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(next).not.toHaveBeenCalled();
    expect(dbTouched()).toBe(false);
  });

  it("rejects invalid initData signature", async () => {
    const { response, next } = await requestContext(
      "/api/bot/drafts?userId=1001",
      {
        method: "GET",
        headers: { "X-Telegram-Init-Data": "auth_date=1&hash=invalid" },
      },
      createEnv(),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects requests where userId does not match signed initData", async () => {
    const signedWrongUser = createInitData(2002);
    const { response, next } = await requestContext(
      "/api/bot/drafts?userId=1001",
      {
        method: "GET",
        headers: { "X-Telegram-Init-Data": signedWrongUser },
      },
      createEnv(),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards valid signed initData + matching userId", async () => {
    const signedUser = createInitData(1001);
    const { response, next } = await requestContext(
      "/api/bot/drafts?userId=1001",
      {
        method: "GET",
        headers: { "X-Telegram-Init-Data": signedUser },
      },
      createEnv(),
    );

    expect(response.status).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
