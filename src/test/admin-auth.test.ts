import { describe, expect, it } from "vitest";
import { issueSession, getAdminSession, requireAdminSession } from "../../functions/_shared/admin-auth";
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

describe("admin Google", () => {
  it("allows only the configured verified identity and checks CSRF on writes", async () => {
    const env = createEnv();
    await expect(issueSession(env, "outro@codigo5.com.br", "other")).rejects.toThrow();
    const cookie = await issueSession(env, "leandro@codigo5.com.br", "google-sub");
    const url = "https://codigo5.com.br/api/admin/posts";
    const session = await getAdminSession(new Request(url, { headers: { cookie } }), env);
    expect(session?.sub).toBe("google-sub");
    const write = (origin: string, csrf: string) => requireAdminSession(new Request(url, {
      method: "POST", headers: { cookie, origin, "x-csrf-token": csrf }
    }), env);
    expect((await write("https://codigo5.com.br", "")).ok).toBe(false);
    expect((await write("https://example.com", session!.csrf)).ok).toBe(false);
    expect((await write("https://codigo5.com.br", session!.csrf)).ok).toBe(true);
    env.ADMIN_ALLOWED_EMAILS = "";
    expect(await getAdminSession(new Request(url, { headers: { cookie } }), env)).toBeNull();
  });
});
