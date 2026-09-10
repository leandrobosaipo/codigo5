import blogPostsData from "../src/content/blog-posts.json";
import { getRedirectBySourcePath, listPublishedPosts } from "./_shared/bot/db";
import type { Env } from "./_shared/bot/types";

type StaticBlogPost = {
  slug: string;
  date: string;
  modified?: string;
  categories: Array<{ slug: string }>;
  tags: Array<{ slug: string }>;
};

const SITE_URL = "https://codigo5.com.br";

const staticRoutes = [
  { path: "/", lastmod: "2026-09-08" },
  { path: "/sobre" },
  { path: "/contato" },
  { path: "/portfolio" },
  { path: "/politica-de-privacidade" },
  { path: "/servicos" },
  { path: "/automacao-com-ia" },
  { path: "/blog" },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const sitemapDate = (value?: string) => {
  const date = value?.trim().slice(0, 10);
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
};

const staticPosts = blogPostsData as StaticBlogPost[];

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const staticCategories = new Set<string>();

  staticPosts.forEach((post) => {
    post.categories.forEach((category) => {
      if (category.slug && category.slug !== "blog")
        staticCategories.add(category.slug);
    });
  });

  let dynamicRows: Record<string, unknown>[];
  try {
    dynamicRows = await listPublishedPosts(env);
  } catch {
    // Bundled posts have generated HTML in this release. Never infer dynamic URLs during an outage.
    console.warn(
      "Sitemap database unavailable; serving the bundled public archive.",
    );
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticRoutes.map(({ path }) => path), ...staticPosts.map(post => `/blog/${post.slug}`), ...Array.from(staticCategories).map(slug => `/blog/categoria/${slug}`)].map(path => `<url><loc>${escapeXml(SITE_URL + path)}</loc></url>`).join("")}</urlset>`,
      {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "no-store",
          "x-codigo5-content-source": "static-fallback",
        },
      },
    );
  }
  const dynamicSlugs = new Set<string>();
  const dynamicDates = new Map<string, string>();

  for (const row of dynamicRows) {
    const slug = String((row as Record<string, unknown>).slug ?? "").trim();
    if (!slug) continue;
    const redirect = await getRedirectBySourcePath(env, `/blog/${slug}`);
    if (redirect) continue;
    dynamicSlugs.add(slug);
    dynamicDates.set(
      slug,
      String(
        (row as Record<string, unknown>).updated_at ??
          (row as Record<string, unknown>).published_at ??
          new Date().toISOString(),
      ),
    );
  }

  const urls: { loc: string; lastmod?: string }[] = [
    ...staticRoutes.map(({ path, lastmod }) => ({
      loc: `${SITE_URL}${path}`,
      lastmod,
    })),
    ...Array.from(staticCategories).map((slug) => ({
      loc: `${SITE_URL}/blog/categoria/${slug}`,
    })),
    ...staticPosts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: sitemapDate(post.modified ?? post.date),
    })),
    ...Array.from(dynamicSlugs).map((slug) => ({
      loc: `${SITE_URL}/blog/${slug}`,
      lastmod: sitemapDate(dynamicDates.get(slug)),
    })),
  ];

  const deduped = Array.from(
    new Map(urls.map((item) => [item.loc, item])).values(),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${deduped
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>${
      item.lastmod
        ? `
    <lastmod>${escapeXml(item.lastmod)}</lastmod>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
};
