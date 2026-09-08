import { describe, expect, it, vi } from "vitest";
import type { Env } from "../../functions/_shared/bot/types";
import { onRequest } from "../../functions/_middleware";

type RedirectDbRow = {
  target_path: string;
  status_code: number;
};

type DbResult = {
  redirect?: RedirectDbRow;
  throwError?: boolean;
};

const makeContext = (pathname: string, db: DbResult = {}) => {
  const dbPrepared = vi.fn(() => {
    if (db.throwError) {
      throw new Error("D1 temporary quota issue");
    }

    return {
      bind: () => ({
        all: vi.fn().mockResolvedValue(db.redirect ? { results: [db.redirect] } : { results: [] }),
      }),
    };
  });

  const env = {
    BOT_DB: {
      prepare: dbPrepared,
    },
  } as unknown as Env;

  const request = new Request(`https://codigo5.com.br${pathname}`);
  const next = vi.fn(async () =>
    new Response('<link rel="canonical" href="https://codigo5.com.br/" />', {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    }),
  );

  return { env, request, next, dbPrepared };
};

describe("public middleware redirect guard", () => {
  it("continues to page rendering when redirect DB lookup fails", async () => {
    const { env, request, next } = makeContext(
      "/blog/inteligencia-artificial-no-desenvolvimento-de-sites-2025/",
      { throwError: true },
    );
    const response = await onRequest({ request, env, next } as never);

    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).toContain(
      'href="https://codigo5.com.br/blog/inteligencia-artificial-no-desenvolvimento-de-sites-2025/"',
    );
  });

  it("does not cache error responses when redirects cannot be checked", async () => {
    const response = await onRequest({
      ...makeContext("/blog/removed", { throwError: true }),
      next: async () => new Response("Missing", { status: 404, headers: { "cache-control": "public, max-age=3600" } }),
    } as never);
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("applies configured redirect when DB returns a match", async () => {
    const { env, request, next } = makeContext("/blog/antigo", {
      redirect: {
        target_path: "/blog/novo",
        status_code: 302,
      },
    });
    const response = await onRequest({ request, env, next: vi.fn() } as never);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://codigo5.com.br/blog/novo");
    expect(next).not.toHaveBeenCalled();
  });
});
