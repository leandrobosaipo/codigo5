import fs from "node:fs";
import path from "node:path";
import { isRedirectSource } from "../functions/_shared/sitemap-policy.ts";
import blogPosts from "../src/content/blog-posts.json" with { type: "json" };

const SITE_URL = "https://codigo5.com.br";
const DIST_DIR = path.resolve("dist");
const OUTPUT = path.join(DIST_DIR, "sitemap.xml");

const staticRoutes = [
  "/",
  "/sobre",
  "/servicos",
  "/automacao-com-ia",
  "/portfolio",
  "/contato",
  "/politica-de-privacidade",
  "/blog",
];

const categoryRoutes = [...new Set(
  blogPosts.flatMap((post) =>
    (post.categories ?? [])
      .map((category) => category?.slug)
      .filter((slug) => slug && slug !== "blog")
      .map((slug) => `/blog/categoria/${slug}`),
  ),
)].sort();

const postRoutes = blogPosts
  .map((post) => `/blog/${post.slug}`)
  .sort();

const redirectSources = fs.readFileSync(path.join(DIST_DIR, "_redirects"), "utf8")
  .split("\n").map(line => line.trim().split(/\s+/)).filter(parts => /^30[1278]$/.test(parts[2])).map(parts => parts[0]);
const allRoutes = [...new Set([...staticRoutes, ...categoryRoutes, ...postRoutes])]
  .filter(route => !isRedirectSource(route, redirectSources));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allRoutes.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(OUTPUT, xml, "utf8");

console.log(`Sitemap gerado com ${allRoutes.length} URLs.`);
