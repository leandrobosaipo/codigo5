import { describe, expect, it } from "vitest";
import { validateTelegramUser, validateWebhookSecret } from "../../functions/_shared/bot/auth";
import { routeTelegramUpdate } from "../../functions/_shared/bot/router";
import type { Env } from "../../functions/_shared/bot/types";

const createEnv = (): Env => {
  const kvStore = new Map<string, string>();
  return {
    BOT_APP_NAME: "test",
    BOT_DEFAULT_TIMEZONE: "America/Cuiaba",
    TELEGRAM_MINI_APP_URL: "https://codigo5.com.br/telegram-mini-app",
    TELEGRAM_SECRET_TOKEN: "segredo",
    TELEGRAM_ALLOWED_USER_IDS: "12345",
    BOT_DB: {
      prepare(query: string) {
        return {
          bind(...params: unknown[]) {
            return {
              async run() {
                if (query.includes("INSERT INTO drafts")) {
                  globalThis.__drafts = globalThis.__drafts ?? [];
                  globalThis.__drafts.push({
                    id: params[0],
                    telegram_user_id: params[1],
                    status: "draft",
                    mode: params[2],
                    source_type: params[3],
                    source_value: params[4],
                    title: params[5],
                    excerpt: params[6],
                    slug: params[7],
                    seo_title: params[8],
                    seo_description: params[9],
                    content_markdown: params[10],
                    content_html: params[11],
                    segment: params[12],
                    service_focus: params[13],
                    categories_json: params[14],
                    tags_json: params[15],
                    image_url: params[16],
                    image_prompt: params[17],
                    reading_minutes: params[18],
                    notes: params[19],
                    created_at: params[20],
                    updated_at: params[21],
                  });
                }
                if (query.includes("UPDATE drafts") && query.includes("content_html")) {
                  const rows = (globalThis.__drafts ?? []) as Array<Record<string, unknown>>;
                  const row = rows.find((item) => item.id === params[12] || item.id === params[11]);
                  if (row) {
                    if (query.includes("categories_json")) {
                      row.title = params[0];
                      row.excerpt = params[1];
                      row.slug = params[2];
                      row.seo_title = params[3];
                      row.seo_description = params[4];
                      row.content_markdown = params[5];
                      row.content_html = params[6];
                      row.categories_json = params[7];
                      row.tags_json = params[8];
                      row.image_url = params[9];
                      row.reading_minutes = params[10];
                      row.updated_at = params[11];
                    } else {
                      row.source_value = params[0];
                      row.title = params[1];
                      row.slug = params[2];
                      row.excerpt = params[3];
                      row.seo_title = params[4];
                      row.seo_description = params[5];
                      row.content_markdown = params[6];
                      row.content_html = params[7];
                      row.segment = params[8];
                      row.service_focus = params[9];
                      row.image_url = params[10];
                      row.updated_at = params[11];
                    }
                  }
                }
                if (query.includes("UPDATE drafts SET image_prompt")) {
                  const rows = (globalThis.__drafts ?? []) as Array<Record<string, unknown>>;
                  const row = rows.find((item) => item.id === params[2]);
                  if (row) {
                    row.image_prompt = params[0];
                    row.updated_at = params[1];
                  }
                }
                if (query.includes("INSERT OR REPLACE INTO posts")) {
                  globalThis.__posts = globalThis.__posts ?? [];
                  globalThis.__posts.push({
                    id: params[0],
                    slug: params[1],
                    title: params[2],
                    excerpt: params[3],
                    status: "published",
                  });
                }
                if (query.includes("INSERT OR REPLACE INTO redirects")) {
                  globalThis.__redirects = globalThis.__redirects ?? [];
                  globalThis.__redirects.push({
                    source_path: params[0],
                    target_path: params[1],
                  });
                }
                if (query.includes("UPDATE posts SET status = 'archived'")) {
                  const rows = (globalThis.__posts ?? []) as Array<Record<string, unknown>>;
                  const row = rows.find((item) => item.id === params[1]);
                  if (row) {
                    row.status = "archived";
                  }
                }
                if (query.includes("UPDATE drafts SET status = 'published'")) {
                  const rows = (globalThis.__drafts ?? []) as Array<Record<string, unknown>>;
                  const row = rows.find((item) => item.id === params[1]);
                  if (row) {
                    row.status = "published";
                    row.updated_at = params[0];
                  }
                }
                return { success: true };
              },
              async first() {
                if (query.includes("SELECT * FROM drafts WHERE id")) {
                  const rows = (globalThis.__drafts ?? []) as Array<Record<string, unknown>>;
                  return rows.find((row) => row.id === params[0]) ?? null;
                }
                if (query.includes("SELECT 1 AS ok")) return { ok: 1 };
                return null;
              },
              async all() {
                if (query.includes("SELECT * FROM drafts WHERE telegram_user_id")) {
                  const rows = (globalThis.__drafts ?? []) as Array<Record<string, unknown>>;
                  return { results: rows.filter((row) => row.telegram_user_id === params[0]) };
                }
                return { results: [] };
              },
            };
          },
        };
      },
    } as unknown as D1Database,
    BOT_SESSIONS: {
      async get(key: string) {
        return kvStore.get(key) ?? null;
      },
      async put(key: string, value: string) {
        kvStore.set(key, value);
      },
    } as unknown as KVNamespace,
  };
};

declare global {
  var __drafts: Array<Record<string, unknown>> | undefined;
  var __posts: Array<Record<string, unknown>> | undefined;
  var __redirects: Array<Record<string, unknown>> | undefined;
}

describe("bot auth and router", () => {
  it("validates telegram secret", () => {
    const env = createEnv();
    const request = new Request("https://example.com", {
      headers: { "X-Telegram-Bot-Api-Secret-Token": "segredo" },
    });
    expect(validateWebhookSecret(request, env).ok).toBe(true);
  });

  it("validates allowed telegram user", () => {
    const env = createEnv();
    const update = {
      update_id: 1,
      message: {
        message_id: 1,
        text: "/start",
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    };
    expect(validateTelegramUser(update, env).ok).toBe(true);
  });

  it("creates a draft from /novo inline", async () => {
    globalThis.__drafts = [];
    const env = createEnv();
    const update = {
      update_id: 1,
      message: {
        message_id: 1,
        text: "/novo quero um post para bikes elétricas com ecommerce e SEO",
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    };

    const response = await routeTelegramUpdate(env, update, "12345");
    expect(response.text).toContain("Rascunho criado");
    expect(response.text).toContain("bicicletas e bikes elétricas");
  });

  it("uses explicit fields from a structured prompt instead of copying the task text", async () => {
    globalThis.__drafts = [];
    const env = createEnv();
    const update = {
      update_id: 11,
      message: {
        message_id: 11,
        text: `/novo TITULO: Como clínicas podem vender mais com SEO local\nSLUG: clinicas-seo-local-cuiaba\nMETA: Estruture site, conteúdo e atendimento para gerar mais contato.\nCATEGORIAS: Marketing Digital, SEO Local\nTAGS: clínicas, seo local, cuiabá\nCONTEUDO:\n## O problema\nClínicas perdem contato quando o site não explica direito os serviços.`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    };

    await routeTelegramUpdate(env, update, "12345");
    const created = globalThis.__drafts?.[0];

    expect(created?.title).toBe("Como clínicas podem vender mais com SEO local");
    expect(created?.slug).toBe("clinicas-seo-local-cuiaba");
    expect(created?.content_markdown).toContain("## O problema");
  });

  it("returns a mini app button on /app", async () => {
    const env = createEnv();
    const update = {
      update_id: 2,
      message: {
        message_id: 2,
        text: "/app",
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    };

    const response = await routeTelegramUpdate(env, update, "12345");
    expect(response.text).toContain("Painel editorial pronto");
    expect(response.reply_markup?.inline_keyboard[0][0].web_app?.url).toBe("https://codigo5.com.br/telegram-mini-app");
  });

  it("generates and publishes a post from chat commands", async () => {
    globalThis.__drafts = [];
    globalThis.__posts = [];
    const env = createEnv();

    await routeTelegramUpdate(env, {
      update_id: 3,
      message: {
        message_id: 3,
        text: "/novo crie um post para empresas de energia solar em Mato Grosso com foco em automação do pós-venda",
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    const draftId = String(globalThis.__drafts?.[0]?.id);

    const generated = await routeTelegramUpdate(env, {
      update_id: 4,
      message: {
        message_id: 4,
        text: `/gerar ${draftId}`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    expect(generated.text).toContain("Preview gerado");

    const published = await routeTelegramUpdate(env, {
      update_id: 5,
      message: {
        message_id: 5,
        text: `/publicar ${draftId}`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    expect(published.text).toContain("Post publicado");
    expect(published.photo).toBeUndefined();
    expect(globalThis.__posts?.length).toBe(1);
  });

  it("includes the cover image when publishing a draft with imageUrl", async () => {
    globalThis.__drafts = [
      {
        id: "draft-com-capa",
        telegram_user_id: "12345",
        status: "draft",
        mode: "idea",
        source_type: "idea",
        source_value: "teste",
        title: "Post com capa",
        excerpt: "Resumo",
        slug: "post-com-capa",
        seo_title: "Post com capa",
        seo_description: "Resumo",
        content_markdown: "Conteudo",
        content_html: "<p>Conteudo</p>",
        segment: "geral",
        service_focus: "site",
        categories_json: "[]",
        tags_json: "[]",
        image_url: "https://codigo5.com.br/assets/capa.webp",
        image_prompt: null,
        reading_minutes: 2,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    globalThis.__posts = [];
    const env = createEnv();

    const published = await routeTelegramUpdate(env, {
      update_id: 51,
      message: {
        message_id: 51,
        text: "/publicar draft-com-capa",
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    expect(published.text).toContain("Post publicado");
    expect(published.photo).toBe("https://codigo5.com.br/assets/capa.webp");
  });

  it("creates image prompt and archives a published post", async () => {
    globalThis.__drafts = [];
    globalThis.__posts = [];
    globalThis.__redirects = [];
    const env = createEnv();

    await routeTelegramUpdate(env, {
      update_id: 6,
      message: {
        message_id: 6,
        text: "/novo crie um post para energia solar com integração entre crm e erp",
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    const draftId = String(globalThis.__drafts?.[0]?.id);
    await routeTelegramUpdate(env, {
      update_id: 7,
      message: {
        message_id: 7,
        text: `/gerar ${draftId}`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");
    await routeTelegramUpdate(env, {
      update_id: 8,
      message: {
        message_id: 8,
        text: `/publicar ${draftId}`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    const imagePrompt = await routeTelegramUpdate(env, {
      update_id: 9,
      message: {
        message_id: 9,
        text: `/imagem ${draftId}`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    expect(imagePrompt.text).toContain("Prompt de imagem pronto");

    const archived = await routeTelegramUpdate(env, {
      update_id: 10,
      message: {
        message_id: 10,
        text: `/excluir ${draftId}`,
        from: { id: 12345 },
        chat: { id: 12345, type: "private" },
      },
    }, "12345");

    expect(archived.text).toContain("Item arquivado");
    expect(globalThis.__redirects?.length).toBeGreaterThan(0);
  });
});
