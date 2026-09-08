import { describe, expect, it } from "vitest";
import { buildSpacesKey, uploadImageToSpaces } from "../../functions/_shared/bot/spaces";
import type { Env } from "../../functions/_shared/bot/types";

describe("bot spaces", () => {
  it("builds a prefixed key for telegram uploads", () => {
    const key = buildSpacesKey(
      {
        DO_SPACES_KEY: "key",
        DO_SPACES_SECRET: "secret",
        DO_SPACES_BUCKET: "codigo5",
        DO_SPACES_REGION: "sfo2",
        DO_SPACES_UPLOAD_PREFIX: "site-assets/telegram-bot",
      } as Env,
      "energia-solar/capa.png",
    );

    expect(key).toBe("site-assets/telegram-bot/energia-solar/capa.png");
  });

  it("normalizes endpoint values that include protocol", async () => {
    const calls: string[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL) => {
      calls.push(input instanceof Request ? input.url : String(input));
      return new Response(null, { status: 200 });
    };

    try {
      const url = await uploadImageToSpaces(
        {
          DO_SPACES_KEY: "key",
          DO_SPACES_SECRET: "secret",
          DO_SPACES_BUCKET: "codigo5",
          DO_SPACES_REGION: "sfo2",
          DO_SPACES_ENDPOINT: "https://sfo2.digitaloceanspaces.com",
          DO_SPACES_PUBLIC_BASE_URL: "https://codigo5.sfo2.digitaloceanspaces.com",
        } as Env,
        "site-assets/telegram-bot/teste.png",
        new TextEncoder().encode("ok").buffer,
        "image/png",
      );

      expect(calls[0]).toContain("https://codigo5.sfo2.digitaloceanspaces.com/site-assets/telegram-bot/teste.png");
      expect(url).toBe("https://codigo5.sfo2.digitaloceanspaces.com/site-assets/telegram-bot/teste.png");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
