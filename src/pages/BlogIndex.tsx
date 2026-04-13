import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { blogCategories, blogPosts, blogTags } from "@/content/blog";

const BlogIndex = () => {
  return (
    <>
      <Seo
        title="Blog Código5 Web | Noticias, SEO, Sites e Automacoes"
        description="Blog interno da Código5 com noticias, conteudo sobre SEO, desenvolvimento web, performance, IA para atendimento e automacoes."
        path="/blog"
        type="website"
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
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight text-foreground">
              Conteudo importado do site antigo e pronto para crescer no novo projeto
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Aqui ficam as noticias, guias e artigos da Código5 organizados por categoria e tag.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">Categorias</h2>
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

            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">Tags</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {blogTags.slice(0, 10).map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/blog/tag/${tag.slug}`}
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {blogPosts.map((post) => (
                <article key={post.slug} className="overflow-hidden rounded-[32px] border border-border bg-card">
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
                    <h2 className="font-display text-3xl font-semibold leading-tight text-foreground">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("pt-BR")} • {post.readingMinutes} min de leitura
                    </p>
                    <p className="text-base leading-7 text-muted-foreground">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogIndex;
