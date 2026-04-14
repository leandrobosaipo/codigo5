import fs from "node:fs";
import path from "node:path";
import blogPosts from "../src/content/blog-posts.json" with { type: "json" };

const SITE_URL = "https://codigo5.com.br";
const SITE_NAME = "Código5 Web";
const DIST_DIR = path.resolve("dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const escapeAttribute = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const extractFaqItems = (contentHtml) => {
  const faqStart = contentHtml.indexOf("FAQ:");
  if (faqStart === -1) {
    return [];
  }

  const faqHtml = contentHtml.slice(faqStart);
  const matches = [...faqHtml.matchAll(/<h3 class="wp-block-heading">([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];

  return matches
    .map(([, question, answer]) => ({
      question: stripHtml(question),
      answer: stripHtml(answer),
    }))
    .filter((item) => item.question && item.answer);
};

const replaceTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`Padrao nao encontrado: ${pattern}`);
  }

  return html.replace(pattern, replacement);
};

const buildSchema = (post) => {
  const faqItems = extractFaqItems(post.contentHtml);

  return [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: post.title,
          datePublished: post.date,
          dateModified: post.modified,
          image: post.image ? [post.image] : undefined,
          articleSection: post.categories.map((category) => category.name),
          keywords: post.tags.map((tag) => tag.name).join(", "),
          author: {
            "@type": "Organization",
            name: SITE_NAME,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/assets/codigo5/logos/logo-codigo5.jpg`,
            },
          },
          description: post.seoDescription,
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Blog",
              item: `${SITE_URL}/blog`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: post.title,
              item: `${SITE_URL}/blog/${post.slug}`,
            },
          ],
        },
        ...(faqItems.length > 0
          ? [
              {
                "@type": "FAQPage",
                mainEntity: faqItems.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                  },
                })),
              },
            ]
          : []),
      ],
    },
  ];
};

if (!fs.existsSync(DIST_INDEX)) {
  throw new Error(`Arquivo nao encontrado: ${DIST_INDEX}`);
}

const baseHtml = fs.readFileSync(DIST_INDEX, "utf8");

for (const post of blogPosts) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.image ?? `${SITE_URL}/assets/codigo5/logos/hero-ai.webp`;
  const keywords = post.tags.map((tag) => tag.name).join(", ");
  const schemaJson = JSON.stringify(buildSchema(post));

  let html = baseHtml;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(post.seoTitle)}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${escapeAttribute(post.seoDescription)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="keywords" content="${escapeAttribute(keywords || "codigo5 web, blog, mercado de bicicletas, ecommerce de bicicletas")}"/>`,
  );
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/>/, '<meta property="og:type" content="article" />');
  html = replaceTag(html, /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:image" content="${image}" />`);
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:title" content="${escapeAttribute(post.seoTitle)}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:title" content="${escapeAttribute(post.seoTitle)}" />`);
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${escapeAttribute(post.seoDescription)}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${escapeAttribute(post.seoDescription)}" />`,
  );
  html = replaceTag(html, /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:image" content="${image}" />`);
  html = html.replace(
    "</head>",
    `    <script type="application/ld+json" id="codigo5-static-post-schema">${schemaJson}</script>\n  </head>`,
  );

  const outDir = path.join(DIST_DIR, "blog", post.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
}

console.log(`Static blog HTML gerado para ${blogPosts.length} posts.`);
