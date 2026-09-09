import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createServer } from "vite";
import blogPosts from "../src/content/blog-posts.json" with { type: "json" };

const DIST_DIR = path.resolve("dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");
const SITE_URL = "https://codigo5.com.br";
const DEFAULT_IMAGE = `${SITE_URL}/assets/codigo5/social/inicio.jpg`;

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const resolveImage = value => new URL(value || DEFAULT_IMAGE, SITE_URL).href;
const institutionalRoutes = ["/", "/sobre", "/servicos", "/automacao-com-ia", "/portfolio", "/contato", "/politica-de-privacidade", "/blog"];

const replaceTag = (html, pattern, replacement, required = true) => {
  if (!pattern.test(html)) {
    if (required) {
      throw new Error(`Padrao nao encontrado: ${pattern}`);
    }
    return html;
  }
  return html.replace(pattern, () => replacement);
};

const clearExistingSchema = (html) =>
  html.replace(/<script\s+type="application\/ld\+json"[^>]*id="codigo5-schema"[\s\S]*?<\/script>/g, "");

const injectMeta = (baseHtml, seo, body, schema) => {
  const canonical = `${SITE_URL}${seo.path}`;
  const image = resolveImage(seo.image);
  let html = baseHtml;

  html = html.replace("<div id=\"root\"></div>", `<div id="root">${body}</div>`);
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(seo.title)}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="keywords" content="${escapeAttribute(seo.keywords ?? "")}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="robots" content="${escapeAttribute(seo.robots ?? "index,follow,max-image-preview:large")}" />`,
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:type" content="${escapeAttribute(seo.type || "website")}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:image" content="${escapeAttribute(image)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttribute(seo.description)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:image" content="${escapeAttribute(image)}" />`,
  );

  html = clearExistingSchema(html);
  const extra = [['property','og:locale','pt_BR'],['property','og:image:alt',seo.title],['name','twitter:image:alt',seo.title]];
  if(image.includes('/social/')) extra.push(['property','og:image:width','1200'],['property','og:image:height','630'],['property','og:image:type','image/jpeg']);
  html = html.replace('</head>', extra.map(([attr,key,value]) => `<meta ${attr}="${key}" content="${escapeAttribute(value)}" />`).join('\n') + '</head>');
  const schemaData = schema || seo.schema;
  if (schemaData) {
    const schemaJson = JSON.stringify(Array.isArray(schemaData) ? schemaData : [schemaData]).replace(
      /</g,
      "\\u003c",
    );
    html = html.replace(
      /<\/head>/,
      `<script type="application/ld+json" id="codigo5-schema">${schemaJson}</script>\n  </head>`,
    );
  }

  return html;
};

const buildStaticPages = async ({
  includeInstitutional = true,
  includeBlogPosts = true,
  includeBlogTaxonomies = true,
  includeAutomation = true,
}) => {
  if (!fs.existsSync(DIST_INDEX)) {
    throw new Error(`Arquivo nao encontrado: ${DIST_INDEX}`);
  }

  const baseHtml = fs.readFileSync(DIST_INDEX, "utf8");
  const taxonomy = {
    categories: [...new Set(blogPosts.flatMap(post => post.categories.map(c => c.slug)).filter(s => s !== "blog"))].map(slug => ({slug})),
    tags: [...new Set(blogPosts.flatMap(post => post.tags.map(t => t.slug)))].map(slug => ({slug})),
  };
  let viteServer;

  try {
    viteServer = await createServer({
      configFile: path.resolve("vite.config.ts"),
      server: {
        middlewareMode: true,
      },
      appType: "custom",
    });

    const { renderStaticRoute } = await viteServer.ssrLoadModule("/scripts/ssr-render.tsx");
    const routes = new Map();

    if (includeInstitutional) {
      for (const route of institutionalRoutes) {
        routes.set(route, {
          type: "static",
        });
      }
    }

    if (includeAutomation && !includeInstitutional) {
      routes.set("/automacao-com-ia", { type: "static" });
    }

    if (includeBlogPosts) {
      for (const post of blogPosts) {
        routes.set(`/blog/${post.slug}`, {
          type: "post",
          post,
        });
      }
    }

    if (includeBlogTaxonomies) {
      for (const category of taxonomy.categories) {
        routes.set(`/blog/categoria/${category.slug}`, {
          type: "category",
          category,
        });
      }
      for (const tag of taxonomy.tags) {
        routes.set(`/blog/tag/${tag.slug}`, {
          type: "tag",
          tag,
        });
      }
    }

    for (const route of routes.keys()) {
      const rendered = await renderStaticRoute(route);
      const seo = rendered.seo;
      if (!seo.title || !seo.description || !seo.schema || !/<h1[ >]/.test(rendered.html)) throw Error(`Incomplete SEO or content: ${route}`);
      const finalHtml = injectMeta(baseHtml, seo, rendered.html, rendered.schema);
      const outFile = route === "/" ? DIST_INDEX : path.join(DIST_DIR, route + ".html");
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, finalHtml, "utf8");
    }

    return { routes, taxonomy };
  } finally {
    if (viteServer) {
      await viteServer.close();
    }
  }
};

export const runStaticSiteGeneration = async ({
  includeInstitutional = true,
  includeBlogPosts = true,
  includeBlogTaxonomies = true,
  includeAutomation = true,
} = {}) => {
  const result = await buildStaticPages({
    includeInstitutional,
    includeBlogPosts,
    includeBlogTaxonomies,
    includeAutomation,
  });

  return {
    routeCount: result.routes.size,
    routes: [...result.routes.keys()].sort(),
    postCount: includeBlogPosts ? blogPosts.length : 0,
    categoryCount: includeBlogTaxonomies ? result.taxonomy.categories.length : 0,
    tagCount: includeBlogTaxonomies ? result.taxonomy.tags.length : 0,
  };
};

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const result = await runStaticSiteGeneration();
  const { routeCount, postCount, categoryCount, tagCount } = result;
  console.log(
    `Geração estática concluída com ${routeCount} rotas (${postCount} posts, ${categoryCount} categorias, ${tagCount} tags).`,
  );
}
