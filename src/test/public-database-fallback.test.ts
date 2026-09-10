import { describe, expect, it, vi } from "vitest";
import { onRequestGet as posts } from "../../functions/api/bot/posts";
import { onRequestGet as sitemap } from "../../functions/sitemap.xml";
import staticPosts from "../content/blog-posts.json";
const context = (path: string) => ({
  request: new Request(`https://codigo5.com.br${path}`),
  env: {
    BOT_DB: {
      prepare: vi.fn(() => ({
        all: vi.fn().mockRejectedValue(new Error("quota")),
        bind: () => ({ all: vi.fn().mockRejectedValue(new Error("quota")) }),
      })),
    },
  },
});
describe("public content during database outage", () => {
  it("serves the bundled archive with an explicit fallback marker", async () => {
    const response = await posts(context("/api/bot/posts") as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      source: "static-fallback",
      posts: staticPosts,
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("does not report an unknown dynamic article as a definitive 404", async () => {
    const response = await posts(
      context("/api/bot/posts?slug=not-in-bundle") as never,
    );
    expect(response.status).toBe(503);
  });
  it("keeps generated public archive routes without claiming unknown dynamic URLs", async () => {
    const response = await sitemap(context("/sitemap.xml") as never);
    const xml = await response.text();
    expect(response.status).toBe(200);
    expect(xml).toContain("<loc>https://codigo5.com.br/servicos</loc>");
    expect(xml).toContain("<loc>https://codigo5.com.br/automacao-com-ia</loc>");
    expect(xml).toContain(`/blog/${staticPosts[0].slug}`);
    expect(xml).not.toContain("not-in-bundle");
    expect(xml.match(/<loc>/g)).toHaveLength(38);
  });
});

it('reports failed real table reads as unhealthy instead of relying on SELECT 1', async () => {
  const { onRequestGet } = await import('../../functions/api/telegram/health');
  const response = await onRequestGet(context('/api/telegram/health') as never);
  expect(response.status).toBe(503);
  expect(await response.json()).toMatchObject({ok:false,database:false});
});

it('does not cache successful dynamic listings or article lookups', async () => {
  const query = { all: vi.fn().mockResolvedValue({ results: [] }) };
  const env = { BOT_DB: { prepare: () => ({ ...query, bind: () => query }) } };
  for (const path of ['/api/bot/posts', '/api/bot/posts?slug=sample']) {
    const response = await posts({request:new Request('https://codigo5.com.br'+path),env} as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
  }
});

it('emits sitemap lastmod values as valid calendar dates', async () => {
  const query = {
    all: vi.fn().mockResolvedValue({
      results: [{ slug: 'dynamic-post', updated_at: '2026-09-10 08:15:30' }],
    }),
  };
  const env = { BOT_DB: { prepare: () => ({ ...query, bind: () => query }) } };
  const response = await sitemap({ request: new Request('https://codigo5.com.br/sitemap.xml'), env } as never);
  const xml = await response.text();
  expect([...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]))
    .toEqual(expect.arrayContaining(['2026-09-08']));
  expect(xml).not.toMatch(/<lastmod>\d{4}-\d{2}-\d{2}T/);
});
