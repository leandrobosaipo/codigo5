import staticPosts from "../src/content/blog-posts.json";
import { renderPublishedCollectionSeo, renderPublishedPostSeo } from "./_shared/public-seo";
import { listPublishedPosts, getPublishedPostBySlug, getRedirectBySourcePath } from "./_shared/bot/db";
import type { Env } from "./_shared/bot/types";

const institutional = ["/", "/sobre", "/servicos", "/automacao-com-ia", "/portfolio", "/contato", "/politica-de-privacidade", "/blog"];

const COD5_SITE_URL = "https://codigo5.com.br";

const cod5_escape_attribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const cod5_replace_canonical_url = (html: string, pathname: string) => {
  const canonicalUrl = new URL(pathname === "/" ? "/" : pathname.replace(/\/+$/, ""), COD5_SITE_URL).toString();
  const escapedUrl = cod5_escape_attribute(canonicalUrl);

  return html
    .replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${escapedUrl}" />`,
    )
    .replace(
      /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:url" content="${escapedUrl}" />`,
    );
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const { pathname } = url;
  const route = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  let redirectLookupFailed = false;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico"
  ) {
    return context.next();
  }

  // Editorial redirects are created only for /blog/[slug]; static institutional pages do not depend on D1.
  if (!institutional.includes(route)) try {
    const redirect = await getRedirectBySourcePath(context.env, pathname);
    if (redirect) {
      const targetPath = String(
        (redirect as Record<string, unknown>).target_path ?? "/blog",
      );
      const statusCode = Number((redirect as Record<string, unknown>).status_code ?? 301);
      return Response.redirect(new URL(targetPath, url).toString(), statusCode);
    }
  } catch {
    console.warn("Redirect lookup failed; continuing without rewrite.");
    redirectLookupFailed = true;
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") ?? "";
  const headers = new Headers(response.headers);
  if (redirectLookupFailed) headers.set("cache-control", "no-store");
  if (!response.ok || !contentType.includes("text/html")) {
    return redirectLookupFailed
      ? new Response(response.body, { status: response.status, statusText: response.statusText, headers })
      : response;
  }

  headers.delete("content-length");
  headers.delete("etag");
  const bundledPost = staticPosts.find(post => route === `/blog/${post.slug}`);
  const knownTaxonomy = staticPosts.some(post => post.categories.some(term => route === `/blog/categoria/${term.slug}`) || post.tags.some(term => route === `/blog/tag/${term.slug}`));
  let known = institutional.includes(route) || !!bundledPost || knownTaxonomy;
  let html = await response.text();
  let lookupFailed = redirectLookupFailed;
  const articleSlug = route.match(/^\/blog\/([^/]+)$/)?.[1];
  if(articleSlug && !redirectLookupFailed) {
    try {
      const row = await getPublishedPostBySlug(context.env, decodeURIComponent(articleSlug));
      if(row) { html = renderPublishedPostSeo(html, row as Record<string, unknown>); known = true; headers.set("cache-control", "no-store"); }
    } catch { lookupFailed = true; headers.set("cache-control", "no-store"); }
  }
  const taxonomyMatch = route.match(/^\/blog\/(categoria|tag)\/([^/]+)$/);
  if(taxonomyMatch && !knownTaxonomy && !redirectLookupFailed) {
    try {
      const rows = await listPublishedPosts(context.env);
      let name = "";
      const matches = rows.filter(row => {
        const terms = JSON.parse(String((row as Record<string, unknown>)[taxonomyMatch[1] === "categoria" ? "categories_json" : "tags_json"] || "[]"));
        const term = Array.isArray(terms) && terms.find(term => term.slug === decodeURIComponent(taxonomyMatch[2]));
        if(term) name = String(term.name);
        return !!term;
      });
      if(matches.length) { known = true; html = renderPublishedCollectionSeo(html, route, name, matches as Record<string, unknown>[]); headers.set("cache-control", "no-store"); }
    } catch { lookupFailed = true; headers.set("cache-control", "no-store"); }
  }
  const privateRoute = /^\/(admin|telegram-mini-app)(\/|$)/.test(route);
  if(privateRoute || !known || taxonomyMatch?.[1] === "tag") {
    headers.set("x-robots-tag", "noindex, follow");
    html = html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex,follow" />');
  }
  const status = known || privateRoute ? response.status : lookupFailed ? 503 : 404;
  return new Response(cod5_replace_canonical_url(html, route), {
    status,
    statusText: response.statusText,
    headers,
  });
};
