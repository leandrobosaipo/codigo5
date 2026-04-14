import { Link } from "react-router-dom";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { blogCategories, featuredBlogPosts, sortedBlogPosts } from "@/content/blog";
import { SITE_URL } from "@/lib/site";

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
          url: `${SITE_URL}/blog`,
          description:
            "Conteudo da Código5 sobre sites, lojas virtuais, SEO, automacoes, integracoes e oportunidades por segmento.",
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-[linear-gradient(180deg,#f4eee4_0%,#fbf9f5_60%,#fffdf9_100%)] py-20">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Blog e noticias
                </p>
                <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-[0.95] text-foreground sm:text-6xl">
                  Um blog para empresa que quer entender mercado, oportunidade e presenca digital
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Leitura direta, visual mais editorial e conteudo pensado para empresario, gestor e marca
                  que querem crescer com mais clareza.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: "Foco", value: "mercado, oportunidades e movimento real de cada segmento" },
                  { label: "Leitura", value: "direta, clara e sem excesso de linguagem tecnica" },
                  { label: "Valor", value: "ajudar a entender o que vale investir agora" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[26px] border border-white/70 bg-white/78 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.22)] backdrop-blur"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-foreground/80">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-10">
              <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
                {heroPost ? (
                  <article className="overflow-hidden rounded-[34px] border border-border bg-card shadow-[0_30px_90px_-58px_rgba(30,25,20,0.45)]">
                    <Link to={`/blog/${heroPost.slug}`} className="block aspect-[16/10] overflow-hidden bg-muted">
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
                      <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground sm:text-[2.7rem]">
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
                      className="overflow-hidden rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,243,235,0.88))] shadow-[0_24px_70px_-54px_rgba(30,25,20,0.32)]"
                    >
                      <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                        <Link to={`/blog/${post.slug}`} className="block h-full overflow-hidden bg-muted">
                          <img
                            src={post.image ?? "/assets/codigo5/blog/metodologia.webp"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="p-6">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                            {post.categories[0]?.name ?? "Blog"}
                          </p>
                          <h3 className="mt-3 text-balance font-display text-2xl font-semibold leading-tight text-foreground">
                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.9))] p-6 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.25)]">
                <h2 className="font-display text-2xl font-semibold text-foreground">Entradas por assunto</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {blogCategories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/blog/categoria/${category.slug}`}
                      className="rounded-full border border-border bg-white/90 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
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
                    <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-muted">
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
