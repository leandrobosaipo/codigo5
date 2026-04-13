import { Link, useParams } from "react-router-dom";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { blogPosts, getAdjacentPosts, getBlogPostBySlug } from "@/content/blog";
import { SITE_URL } from "@/lib/site";
import NotFound from "./NotFound";

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
          ],
        }}
      />
      <Navbar />
      <main className="pt-24">
        <article className="pb-20">
          <section className="border-b border-border bg-background-alt py-20">
            <div className="container max-w-4xl">
              <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                <Link to="/blog" className="transition hover:text-primary">
                  Blog
                </Link>{" "}
                / <span>{post.title}</span>
              </nav>
              <div className="flex flex-wrap gap-2">
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
              <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-tight text-foreground">
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

          <div className="container grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              {post.image ? (
                <div className="overflow-hidden rounded-[32px] border border-border">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div
                className="article-content mt-10 rounded-[32px] border border-border bg-card p-8 sm:p-10"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {previousPost ? (
                  <Link
                    to={`/blog/${previousPost.slug}`}
                    className="rounded-[28px] border border-border bg-card p-6 transition hover:border-primary/30 hover:shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <Link key={tag.slug} to={`/blog/tag/${tag.slug}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                        #{tag.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem tags cadastradas nesse post.</span>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Posts relacionados</p>
                <div className="mt-4 space-y-4">
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} to={`/blog/${related.slug}`} className="block border-t border-border pt-4 first:border-t-0 first:pt-0">
                      <p className="font-display text-xl font-semibold text-foreground">{related.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{related.excerpt}</p>
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
