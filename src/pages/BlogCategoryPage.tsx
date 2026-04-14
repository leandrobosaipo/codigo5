import { Link, useParams } from "react-router-dom";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getCategoryBySlug, getPostsByCategory } from "@/content/blog";
import { SITE_URL } from "@/lib/site";
import NotFound from "./NotFound";

const BlogCategoryPage = () => {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);

  if (!category) {
    return <NotFound />;
  }

  const posts = getPostsByCategory(slug);

  return (
    <>
      <Seo
        title={`${category.name} | Blog Código5 Web`}
        description={`Noticias e artigos da Código5 sobre ${category.name}.`}
        path={`/blog/categoria/${category.slug}`}
        type="website"
        keywords={`${category.name}, blog codigo5, ${category.name} cuiaba, seo de conteudo`}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category.name} | Blog Código5 Web`,
          description: `Publicacoes da categoria ${category.name} no blog da Código5.`,
          url: `${SITE_URL}/blog/categoria/${category.slug}`,
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-[linear-gradient(180deg,#f4eee4_0%,#fbf9f5_60%,#fffdf9_100%)] py-20">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Categoria</p>
                <nav aria-label="Breadcrumb" className="mt-6 text-sm text-muted-foreground">
                  <Link to="/blog" className="transition hover:text-primary">
                    Blog
                  </Link>{" "}
                  / <span>{category.name}</span>
                </nav>
                <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-[0.95] text-foreground sm:text-6xl">
                  {category.name}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {posts.length} publicacoes reunidas para quem quer acompanhar esse assunto com mais contexto.
                </p>
              </div>

              <div className="rounded-[30px] border border-white/70 bg-white/78 p-6 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.22)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Nesta colecao
                </p>
                <p className="mt-4 text-base leading-7 text-foreground/80">
                  Aqui voce encontra conteudo da Código5 sobre <strong>{category.name}</strong>,
                  com leitura mais direta, repertorio de mercado e caminhos para continuar navegando pelo blog.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid gap-8 lg:grid-cols-2">
              {posts.map((post) => (
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                        new Date(post.date),
                      )}
                    </p>
                    <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-foreground">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="line-clamp-3 text-base leading-7 text-muted-foreground">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            <BlogSidebar currentCategorySlug={category.slug} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogCategoryPage;
