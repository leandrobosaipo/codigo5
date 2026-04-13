import { Link } from "react-router-dom";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { blogCategories, featuredBlogPosts, sortedBlogPosts } from "@/content/blog";

const BlogIndex = () => {
  const heroPost = featuredBlogPosts[0];
  const secondaryPosts = featuredBlogPosts.slice(1, 3);

  return (
    <>
      <Seo
        title="Blog Código5 Web | Noticias, SEO, Sites e Automacoes"
        description="Noticias, ideias e oportunidades de mercado para empresas que querem vender melhor online."
        path="/blog"
        type="website"
        keywords="blog codigo5, blog seo cuiaba, noticias sobre sites, automacao, ia aplicada, lojas virtuais"
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog Código5 Web",
          url: "https://novo.codigo5.com.br/blog",
          description:
            "Conteudo da Código5 sobre sites, lojas virtuais, SEO, automacoes, integracoes e oportunidades por segmento.",
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Blog e noticias</p>
            <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-bold leading-tight text-foreground">
              Ideias, noticias e oportunidades para vender melhor online
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Um blog para leitura facil, com pautas comerciais, tendencias e temas por segmento.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="min-w-0 space-y-10">
              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
                {heroPost ? (
                  <article className="overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_24px_70px_-54px_rgba(30,25,20,0.45)]">
                    <Link to={`/blog/${heroPost.slug}`} className="block aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={heroPost.image ?? "/assets/codigo5/blog/metodologia.webp"}
                        alt={heroPost.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </Link>
                    <div className="space-y-4 p-8">
                      <div className="flex flex-wrap gap-2">
                        {heroPost.categories.map((category) => (
                          <Link
                            key={category.slug}
                            to={`/blog/categoria/${category.slug}`}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                          new Date(heroPost.date),
                        )}{" "}
                        • {heroPost.readingMinutes} min de leitura
                      </p>
                      <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground">
                        <Link to={`/blog/${heroPost.slug}`}>{heroPost.title}</Link>
                      </h2>
                      <p className="max-w-2xl line-clamp-3 text-base leading-7 text-muted-foreground">
                        {heroPost.excerpt}
                      </p>
                    </div>
                  </article>
                ) : null}

                <div className="grid gap-6">
                  {secondaryPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_24px_70px_-54px_rgba(30,25,20,0.35)]"
                    >
                      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                        <Link to={`/blog/${post.slug}`} className="block h-full overflow-hidden bg-muted">
                          <img
                            src={post.image ?? "/assets/codigo5/blog/metodologia.webp"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="p-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            {post.categories[0]?.name ?? "Blog"}
                          </p>
                          <h3 className="mt-3 text-balance font-display text-2xl font-semibold leading-tight text-foreground">
                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">Assuntos do blog</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {blogCategories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/blog/categoria/${category.slug}`}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
                    >
                      {category.name} ({category.count})
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {sortedBlogPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_24px_70px_-54px_rgba(30,25,20,0.35)]"
                  >
                    <Link to={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={post.image ?? "/assets/codigo5/blog/metodologia.webp"}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </Link>
                    <div className="space-y-4 p-8">
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
                      <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-foreground">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                          new Date(post.date),
                        )}{" "}
                        • {post.readingMinutes} min de leitura
                      </p>
                      <p className="line-clamp-3 text-base leading-7 text-muted-foreground">{post.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <BlogSidebar />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogIndex;
