import { Link, useParams } from "react-router-dom";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getPostsByTag, getTagBySlug } from "@/content/blog";
import NotFound from "./NotFound";

const BlogTagPage = () => {
  const { slug } = useParams();
  const tag = getTagBySlug(slug);

  if (!tag) {
    return <NotFound />;
  }

  const posts = getPostsByTag(slug);

  return (
    <>
      <Seo
        title={`#${tag.name} | Blog Código5 Web`}
        description={`Conteudos da Código5 marcados com a tag ${tag.name}.`}
        path={`/blog/tag/${tag.slug}`}
        robots="noindex,follow,max-image-preview:large"
        type="website"
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Tag</p>
            <nav aria-label="Breadcrumb" className="mt-6 text-sm text-muted-foreground">
              <Link to="/blog" className="transition hover:text-primary">
                Blog
              </Link>{" "}
              / <span>#{tag.name}</span>
            </nav>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold text-foreground">#{tag.name}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {posts.length} publicacoes relacionadas, mantidas acessiveis para navegacao interna
              e em noindex para evitar paginas finas no Google.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="grid gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-[32px] border border-border bg-card p-8 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.35)]"
                >
                  <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <Link to={`/blog/${post.slug}`} className="overflow-hidden rounded-[24px] bg-muted">
                      <img
                        src={post.image ?? "/assets/codigo5/blog/metodologia.webp"}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                          new Date(post.date),
                        )}
                      </p>
                      <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-foreground">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="mt-4 text-base leading-7 text-muted-foreground">{post.excerpt}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <BlogSidebar currentTagSlug={tag.slug} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogTagPage;
