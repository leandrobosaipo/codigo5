import { Link } from "react-router-dom";
import {
  blogCategories,
  blogTags,
  recentBlogPosts,
  type BlogPost,
} from "@/content/blog";

type BlogSidebarProps = {
  currentPostSlug?: string;
  currentCategorySlug?: string;
  currentTagSlug?: string;
};

const BlogSidebar = ({
  currentPostSlug,
  currentCategorySlug,
  currentTagSlug,
}: BlogSidebarProps) => {
  const recentPosts = recentBlogPosts.filter((post) => post.slug !== currentPostSlug).slice(0, 5);
  const featuredTags = blogTags.slice(0, 12);

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_24px_70px_-54px_rgba(30,25,20,0.45)]">
        <div className="border-b border-border bg-[linear-gradient(135deg,rgba(204,149,55,0.16),rgba(255,250,240,0.96))] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Navegacao do blog</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
            Navegue por assunto
          </h2>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Categorias
            </h3>
            <div className="mt-4 space-y-2">
              {blogCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/blog/categoria/${category.slug}`}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                    currentCategorySlug === category.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/70 text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="min-w-0 pr-4">{category.name}</span>
                  <span className="shrink-0 text-xs font-semibold">{category.count}</span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Posts recentes
            </h3>
            <div className="mt-4 space-y-4">
              {recentPosts.map((post: BlogPost) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block rounded-2xl border border-border bg-background px-4 py-4 transition hover:border-primary/30 hover:shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-primary">
                    {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                      new Date(post.date),
                    )}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold leading-tight text-foreground">
                    {post.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tags em destaque
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {featuredTags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/blog/tag/${tag.slug}`}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    currentTagSlug === tag.slug
                      ? "bg-ink text-ink-foreground"
                      : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,rgba(204,149,55,0.14),rgba(255,250,240,0.98))] p-6 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.4)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Projeto novo</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
          Quer esse nivel de cuidado no seu site?
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          A Codigo5 pode organizar seu conteudo, sua apresentacao e seu caminho de contato.
        </p>
        <Link
          to="/#contato"
          className="mt-5 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Falar com a Codigo5
        </Link>
      </div>
    </aside>
  );
};

export default BlogSidebar;
