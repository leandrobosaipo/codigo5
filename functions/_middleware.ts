import { getRedirectBySourcePath } from "./_shared/bot/db";
import type { Env } from "./_shared/bot/types";

const COD5_SITE_URL = "https://codigo5.com.br";

const cod5_escape_attribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const cod5_replace_canonical_url = (html: string, pathname: string) => {
  const canonicalUrl = new URL(pathname, COD5_SITE_URL).toString();
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

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico"
  ) {
    return context.next();
  }

  const redirect = await getRedirectBySourcePath(context.env, pathname);
  if (redirect) {
    const targetPath = String((redirect as Record<string, unknown>).target_path ?? "/blog");
    const statusCode = Number((redirect as Record<string, unknown>).status_code ?? 301);
    return Response.redirect(new URL(targetPath, url).toString(), statusCode);
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.includes("text/html")) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(cod5_replace_canonical_url(await response.text(), pathname), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
