import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getAdjacentPosts, getBlogPostBySlug } from "@/content/blog";
import { useRuntimeBlog } from "@/hooks/use-runtime-blog";
import { SITE_URL } from "@/lib/site";
import NotFound from "./NotFound";
import {
  normalizeLegacyBlogLinks,
  safeArticleHtml,
} from "@/lib/safeArticleHtml";

const extractFaqItems = (contentHtml: string) => {
  const faqStart = contentHtml.indexOf("FAQ:");
  if (faqStart === -1) {
    return [];
  }

  const faqHtml = contentHtml.slice(faqStart);
  const matches = [
    ...faqHtml.matchAll(
      /<h3 class="wp-block-heading">([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
    ),
  ];

  return matches
    .map(([, question, answer]) => ({
      question: question.replace(/<[^>]+>/g, "").trim(),
      answer: answer.replace(/<[^>]+>/g, "").trim(),
    }))
    .filter((item) => item.question && item.answer);
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const { posts: blogPosts, ready } = useRuntimeBlog();
  const post = getBlogPostBySlug(slug, blogPosts);

  if (ready && !post) {
    return <NotFound />;
  }

  if (!post) {
    return null;
  }

  const relatedPosts = blogPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug &&
        candidate.categories.some((category) =>
          post.categories.some(
            (postCategory) => postCategory.slug === category.slug,
          ),
        ),
    )
    .slice(0, 2);
  const { previousPost, nextPost } = getAdjacentPosts(post.slug, blogPosts);
  const faqItems = extractFaqItems(post.contentHtml);

  return (
    <div className="c5-site">
      <Seo
        title={post.seoTitle}
        description={post.seoDescription}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.image ?? undefined}
        schema={{
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
                name: "Código5 Web",
              },
              publisher: {
                "@type": "Organization",
                name: "Código5 Web",
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/assets/codigo5/logos/logo-dark.webp`,
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
        }}
      />
      <Navbar />
      <main id="conteudo">
        <article>
          <header className="c5-page-hero">
            <div className="c5-container c5-prose">
              <Link className="c5-text-link" to="/blog">
                ← Blog
              </Link>
              <div
                className="c5-category-links"
                style={{ marginTop: 25, marginBottom: 25 }}
              >
                {post.categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/blog/categoria/${category.slug}`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="c5-article-date">
                <time dateTime={post.date}>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "long",
                  }).format(new Date(post.date))}
                </time>
                <span>{post.readingMinutes} min de leitura</span>
              </div>
            </div>
          </header>
          <div className="c5-container c5-prose c5-article-body">
            {post.image && (
              <img
                className="c5-article-cover"
                src={post.image}
                alt={post.title}
                fetchPriority="high"
                decoding="async"
              />
            )}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: safeArticleHtml(
                  normalizeLegacyBlogLinks(post.contentHtml, blogPosts),
                ),
              }}
            />
            <nav className="c5-category-links" aria-label="Assuntos do artigo">
              {post.tags.map((tag) => (
                <Link key={tag.slug} to={`/blog/tag/${tag.slug}`}>
                  #{tag.name}
                </Link>
              ))}
            </nav>
            <nav className="c5-adjacent" aria-label="Outros artigos">
              {previousPost && (
                <Link to={`/blog/${previousPost.slug}`}>
                  <span className="c5-label">Artigo anterior</span>
                  {previousPost.title}
                </Link>
              )}
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`}>
                  <span className="c5-label">Próximo artigo</span>
                  {nextPost.title}
                </Link>
              )}
            </nav>
            {relatedPosts.length > 0 && (
              <section>
                <h2>Sobre o mesmo assunto</h2>
                <div className="c5-adjacent">
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} to={`/blog/${related.slug}`}>
                      {related.image && <img className="c5-related-image" src={related.image} alt="" width="500" height="280" loading="lazy" />}
                      {related.title}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
