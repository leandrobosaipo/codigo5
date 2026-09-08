import DOMPurify from 'dompurify';
import type { BlogPost } from "@/content/blog";
import { SITE_URL } from "./site";

const SITE_ORIGIN = new URL(SITE_URL).origin;

const isRelativeOnlyPath = (pathname: string) => {
  const slug = pathname.replace(/^\/+|\/+$/g, "");

  if (!slug || slug === "blog" || slug.includes("/")) {
    return false;
  }

  return true;
};

// Normalizes legacy single-level same-site post URLs to /blog/[slug].
export const normalizeLegacyBlogLinks = (html: string, posts: BlogPost[]): string => {
  const knownSlugs = new Set(posts.map((post) => post.slug));

  return html.replace(/\bhref=(["'])(.*?)\1/g, (match, quote, href) => {
    try {
      const url = new URL(href, SITE_URL);

      if (url.origin !== SITE_ORIGIN) {
        return match;
      }

      if (!isRelativeOnlyPath(url.pathname)) {
        return match;
      }

      if (!knownSlugs.has(url.pathname.replace(/^\/+|\/+$/g, ""))) {
        return match;
      }

      const target = `/blog${url.pathname}${url.search}${url.hash}`;
      return `href=${quote}${target}${quote}`;
    } catch {
      return match;
    }
  });
};

// Editorial HTML keeps normal formatting and media, never executable markup.
export const safeArticleHtml = (html: string) => DOMPurify.sanitize(html, {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
  FORBID_ATTR: ['style'],
});
