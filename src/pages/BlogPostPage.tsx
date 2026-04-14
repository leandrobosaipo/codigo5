import { Link, useParams } from "react-router-dom";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { blogPosts, getAdjacentPosts, getBlogPostBySlug } from "@/content/blog";
import { SITE_URL } from "@/lib/site";
import NotFound from "./NotFound";

const extractFaqItems = (contentHtml: string) => {
  const faqStart = contentHtml.indexOf("FAQ:");
  if (faqStart === -1) {
    return [];
  }

  const faqHtml = contentHtml.slice(faqStart);
  const matches = [...faqHtml.matchAll(/<h3 class="wp-block-heading">([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];

  return matches
    .map(([, question, answer]) => ({
      question: question.replace(/<[^>]+>/g, "").trim(),
      answer: answer.replace(/<[^>]+>/g, "").trim(),
    }))
    .filter((item) => item.question && item.answer);
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return <NotFound />;
  }

  const relatedPosts = blogPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug &&
        candidate.categories.some((category) =>
          post.categories.some((postCategory) => postCategory.slug === category.slug),
        ),
    )
    .slice(0, 3);
  const { previousPost, nextPost } = getAdjacentPosts(post.slug);
  const faqItems = extractFaqItems(post.contentHtml);

  return (
    <>
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
      <main id="conteudo" className="pt-24">
        <article className="pb-20">
          <section className="border-b border-border bg-[linear-gradient(180deg,#f4eee4_0%,#fbf9f5_60%,#fffdf9_100%)] py-20">
            <div className="container max-w-5xl">
              <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                <Link to="/blog" className="transition hover:text-primary">
                  Blog
                </Link>{" "}
                / <span>{post.title}</span>
              </nav>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/blog/categoria/${category.slug}`}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <h1 className="mt-6 max-w-4xl text-balance font-display text-5xl font-bold leading-[0.95] text-foreground sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-5 text-sm text-muted-foreground">
                {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                  new Date(post.date),
                )}{" "}
                • {post.readingMinutes} min de leitura
              </p>
            </div>
          </section>

          <div className="container grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              {post.image ? (
                <div className="overflow-hidden rounded-[34px] border border-border shadow-[0_30px_90px_-58px_rgba(30,25,20,0.38)]">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </div>
              ) : null}

              <div className="mt-10 rounded-[34px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.92))] p-8 shadow-[0_30px_90px_-58px_rgba(30,25,20,0.22)] sm:p-10">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {previousPost ? (
                  <Link
                    to={`/blog/${previousPost.slug}`}
                    className="rounded-[28px] border border-border bg-card p-6 transition hover:border-primary/30 hover:shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Post anterior
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
                      {previousPost.title}
                    </p>
                  </Link>
                ) : (
                  <div className="rounded-[28px] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                    Este e um dos posts mais recentes da lista.
                  </div>
                )}

                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="rounded-[28px] border border-border bg-card p-6 text-left transition hover:border-primary/30 hover:shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Proximo post
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : (
                  <div className="rounded-[28px] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                    Este e o ultimo post da navegacao atual.
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-[32px] border border-primary/20 bg-[linear-gradient(135deg,rgba(204,149,55,0.16),rgba(255,250,240,0.96))] p-8 shadow-[0_24px_70px_-50px_rgba(30,25,20,0.18)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Proximo passo
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                  Quer transformar esse assunto em um projeto mais forte?
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  A Código5 pode organizar site, conteudo, SEO e automacoes para sua empresa aparecer melhor, explicar melhor e vender melhor.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/contato"
                    className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
                  >
                    Falar com a Código5
                  </Link>
                  <Link
                    to="/servicos"
                    className="inline-flex rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
                  >
                    Ver servicos
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.92))] p-6 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        to={`/blog/tag/${tag.slug}`}
                        className="rounded-full bg-white px-3 py-2 text-xs font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
                      >
                        #{tag.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem tags cadastradas nesse post.</span>
                  )}
                </div>
              </div>

              <div className="rounded-[30px] border border-border bg-card p-6 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Posts relacionados</p>
                <div className="mt-4 space-y-4">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="block rounded-[22px] border border-border/70 bg-background-alt px-4 py-4 transition hover:border-primary/30"
                    >
                      <p className="font-display text-xl font-semibold text-foreground">{related.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <BlogSidebar currentPostSlug={post.slug} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPostPage;
