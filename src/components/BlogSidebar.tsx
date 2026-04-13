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
      <div className="overflow-hidden rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.9))] shadow-[0_30px_90px_-58px_rgba(30,25,20,0.45)]">
        <div className="border-b border-border bg-[linear-gradient(135deg,rgba(204,149,55,0.16),rgba(255,250,240,0.96))] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Navegacao do blog</p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
            Continue por tema,
            <span className="block">categoria ou leitura recente</span>
          </h2>
        </div>

        <div className="space-y-8 p-6">
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Categorias
            </h3>
            <div className="mt-4 space-y-2">
              {blogCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/blog/categoria/${category.slug}`}
                  className={`flex items-center justify-between rounded-[20px] px-4 py-3 text-sm transition ${
                    currentCategorySlug === category.slug
                      ? "bg-foreground text-background"
                      : "bg-white/80 text-foreground hover:bg-white"
                  }`}
                >
                  <span className="min-w-0 pr-4">{category.name}</span>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Leituras recentes
            </h3>
            <div className="mt-4 space-y-3">
              {recentPosts.map((post: BlogPost) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block rounded-[22px] border border-border/70 bg-white/70 px-4 py-4 transition hover:border-primary/30 hover:bg-white"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
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
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Tags
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {featuredTags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/blog/tag/${tag.slug}`}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    currentTagSlug === tag.slug
                      ? "bg-ink text-ink-foreground"
                      : "bg-white text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="rounded-[30px] border border-slate-900/85 bg-[radial-gradient(circle_at_top,#2b3240,#09090b_62%)] p-6 text-slate-50 shadow-[0_30px_90px_-58px_rgba(15,15,15,0.7)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">Projeto novo</p>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">
          Quer esse nivel de cuidado no seu site?
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          A Código5 organiza conteudo, apresentacao e caminho de contato para sua empresa parecer mais forte.
        </p>
        <Link
          to="/#contato"
          className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          Falar com a Código5
        </Link>
      </div>
    </aside>
  );
};

export default BlogSidebar;
