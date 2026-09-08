import { describe, expect, it } from "vitest";
import {
  clearAdminCookie,
  createAdminSession,
  getAdminCookieHeader,
  getAdminSession,
  requestAdminMagicLink,
  requireAdminSession,
} from "../../functions/_shared/admin-auth";
import type { Env } from "../../functions/_shared/bot/types";

const createEnv = (): Env => {
  const kvStore = new Map<string, string>();
  return {
    TELEGRAM_ALLOWED_USER_IDS: "12345",
    TELEGRAM_BOT_TOKEN: "token",
    ADMIN_ALLOWED_EMAILS: "leandro@codigo5.com.br",
    ADMIN_PANEL_URL: "https://codigo5.com.br/admin/editorial",
    BOT_SESSIONS: {
      async get(key: string) {
        return kvStore.get(key) ?? null;
      },
      async put(key: string, value: string) {
        kvStore.set(key, value);
      },
      async delete(key: string) {
        kvStore.delete(key);
      },
    } as unknown as KVNamespace,
    BOT_DB: {} as D1Database,
  };
};

describe("admin auth", () => {
  it("creates and reads admin session from cookie", async () => {
    const env = createEnv();
    const token = await createAdminSession(env, {
      email: "leandro@codigo5.com.br",
      telegramUserId: "12345",
      source: "magic-link",
    });

    const request = new Request("https://codigo5.com.br/admin/editorial", {
      headers: { cookie: getAdminCookieHeader(token) },
    });

    const session = await getAdminSession(request, env);
    expect(session?.email).toBe("leandro@codigo5.com.br");
    expect(session?.telegramUserId).toBe("12345");
  });

  it("rejects unauthorized email for magic link", async () => {
    const env = createEnv();
    const result = await requestAdminMagicLink(env, "outro@email.com");
    expect(result.ok).toBe(false);
  });

  it("requires valid admin session", async () => {
    const env = createEnv();
    const request = new Request("https://codigo5.com.br/api/admin/posts");
    const result = await requireAdminSession(request, env);
    expect(result.ok).toBe(false);
    expect(clearAdminCookie()).toContain("Max-Age=0");
  });
});
