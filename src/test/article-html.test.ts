import { expect, it } from 'vitest';
import {
  normalizeLegacyBlogLinks,
  safeArticleHtml,
} from '@/lib/safeArticleHtml';
import type { BlogPost } from '@/content/blog';
it('keeps editorial formatting and removes executable HTML', () => {
  const html = safeArticleHtml('<h2>Título</h2><p>Texto <a href="https://codigo5.com.br">link</a></p><img src="/capa.jpg" onerror=alert(1)><script>alert(1)</script><a href="java&#x73;cript:alert(1)">x</a><iframe srcdoc="<script>alert(1)</script>"></iframe><svg onload=alert(1)></svg>');
  expect(html).toContain('<h2>Título</h2>');
  expect(html).toContain('href="https://codigo5.com.br"');
  expect(html).toContain('src="/capa.jpg"');
  expect(html).not.toMatch(/script|onerror|onload|iframe|svg/i);
});

it('rewrites legacy same-domain post links to /blog/[slug] only for known posts', () => {
  const posts: BlogPost[] = [
    {
      id: 1,
      slug: "artigo-antigo",
      title: "Antigo",
      excerpt: "",
      contentHtml: "",
      date: "2026-01-01T00:00:00",
      modified: "2026-01-01T00:00:00",
      image: null,
      link: "https://codigo5.com.br/artigo-antigo/",
      seoTitle: "Antigo",
      seoDescription: "x",
      categories: [],
      tags: [],
      readingMinutes: 3,
    },
  ];

  const html = normalizeLegacyBlogLinks(
    '<a href="https://codigo5.com.br/artigo-antigo/">Antigo</a> ' +
      '<a href="https://codigo5.com.br/servicos">Serviços</a> ' +
      '<a href="https://exemplo.com">Externo</a>',
    posts,
  );

  expect(html).toContain('href="/blog/artigo-antigo/"');
  expect(html).toContain('href="https://codigo5.com.br/servicos"');
  expect(html).toContain('href="https://exemplo.com"');
});

it('preserves query/hash on normalized links and keeps external URLs untouched', () => {
  const posts: BlogPost[] = [
    {
      id: 2,
      slug: "seo-check",
      title: "SEO",
      excerpt: "",
      contentHtml: "",
      date: "2026-01-01T00:00:00",
      modified: "2026-01-01T00:00:00",
      image: null,
      link: "https://codigo5.com.br/seo-check",
      seoTitle: "SEO",
      seoDescription: "x",
      categories: [],
      tags: [],
      readingMinutes: 2,
    },
  ];

  const html = normalizeLegacyBlogLinks(
    '<a href="https://codigo5.com.br/seo-check/?utm_source=blog#top">SEO</a> ' +
      '<a href="https://www.externo.com?x=1">Externo</a>',
    posts,
  );

  expect(html).toContain('href="/blog/seo-check/?utm_source=blog#top"');
  expect(html).toContain('href="https://www.externo.com?x=1"');
});
