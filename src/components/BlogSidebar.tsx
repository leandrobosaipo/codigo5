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
  categories?: Array<{ id: number; name: string; slug: string; count: number }>;
  tags?: Array<{ id: number; name: string; slug: string; count: number }>;
  recentPosts?: BlogPost[];
  compactMobile?: boolean;
};

const BlogSidebar = ({
  currentPostSlug,
  currentCategorySlug,
  currentTagSlug,
  categories = blogCategories,
  tags = blogTags,
  recentPosts: runtimeRecentPosts = recentBlogPosts,
  compactMobile = false,
}: BlogSidebarProps) => {
  const recentPosts = runtimeRecentPosts.filter((post) => post.slug !== currentPostSlug).slice(0, 3);
  const featuredTags = tags.slice(0, 6);
  const featuredCategories = categories.slice(0, 6);

  return (
    <aside className="blog-sidebar-shell">
      <div className="blog-sidebar-panel">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
            Navegação editorial
          </p>
          <h2 className="mt-3 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
            Continue por assunto, tema ou leitura recente
          </h2>
        </div>

        <div className="hidden space-y-8 p-6 lg:block">
          <section>
            <h3 className="blog-sidebar-heading">Categorias</h3>
            <div className="mt-4 space-y-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/blog/categoria/${category.slug}`}
                  className={`flex items-center justify-between rounded-[20px] px-4 py-3 text-sm transition ${
                    currentCategorySlug === category.slug
                      ? "bg-white text-slate-950"
                      : "bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] text-slate-50 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))]"
                  }`}
                >
                  <span className="min-w-0 pr-4">{category.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                      currentCategorySlug === category.slug
                        ? "bg-slate-950/10 text-slate-950"
                        : "bg-cyan-400/10 text-cyan-100"
                    }`}
                  >
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to="/blog"
              className="mt-4 inline-flex text-sm font-semibold text-cyan-100 transition hover:text-white"
            >
              Ver arquivo completo
            </Link>
          </section>

          <section>
            <h3 className="blog-sidebar-heading">Leituras recentes</h3>
            <div className="mt-4 space-y-3">
              {recentPosts.map((post: BlogPost) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 transition hover:bg-white/12"
                >
                  {post.image ? (
                    <div className="mb-3 overflow-hidden rounded-[16px]">
                      <img src={post.image} alt="" aria-hidden="true" className="h-28 w-full object-cover" />
                    </div>
                  ) : null}
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/88">
                    {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
                      new Date(post.date),
                    )}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold leading-tight text-white">
                    {post.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-3 p-5 lg:hidden">
          <details open className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-white">
              Categorias
            </summary>
            <div className="mt-3 space-y-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/blog/categoria/${category.slug}`}
                  className={`flex items-center justify-between rounded-[16px] px-3 py-3 text-sm transition ${
                    currentCategorySlug === category.slug
                      ? "bg-white text-slate-950"
                      : "bg-black/18 text-slate-50 hover:bg-white/10"
                  }`}
                >
                  <span className="min-w-0 pr-4">{category.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                      currentCategorySlug === category.slug
                        ? "bg-slate-950/10 text-slate-950"
                        : "bg-cyan-400/10 text-cyan-100"
                    }`}
                  >
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to="/blog"
              className="mt-3 inline-flex text-sm font-semibold text-cyan-100 transition hover:text-white"
            >
              Ver arquivo completo
            </Link>
          </details>

          <details className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-white">
              Leituras recentes
            </summary>
            <div className="mt-3 space-y-2">
              {recentPosts.map((post: BlogPost) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block rounded-[16px] border border-white/10 bg-black/18 px-3 py-3 transition hover:bg-white/10"
                >
                  {post.image ? (
                    <div className="mb-3 overflow-hidden rounded-[14px]">
                      <img src={post.image} alt="" aria-hidden="true" className="h-24 w-full object-cover" />
                    </div>
                  ) : null}
                  <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/88">
                    {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(post.date))}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">{post.title}</p>
                </Link>
              ))}
            </div>
          </details>

          {(featuredTags.length > 0 || !compactMobile) ? (
            <details className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                Tags
              </summary>
              <div className="mt-3 flex flex-wrap gap-2">
                {featuredTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/blog/tag/${tag.slug}`}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      currentTagSlug === tag.slug
                        ? "bg-white text-slate-950"
                        : "bg-black/18 text-slate-50 hover:bg-white/10"
                    }`}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}
        </div>
      </div>

      <div className="blog-sidebar-panel-light hidden p-6 lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Tags</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {featuredTags.map((tag) => (
            <Link
              key={tag.slug}
              to={`/blog/tag/${tag.slug}`}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                currentTagSlug === tag.slug
                  ? "bg-foreground text-background"
                  : "bg-white text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="blog-sidebar-panel-light p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Próximo passo</p>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
          Quer uma presença mais forte e mais clara para a sua empresa?
        </h3>
        <p className="mt-3 text-sm leading-7 text-foreground/78">
          A Código5 organiza site, conteúdo, SEO e fluxo de contato para marcas que precisam vender com menos ruído.
        </p>
        <Link
          to="/contato"
          className="mt-5 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-92"
        >
          Falar com a Código5
        </Link>
      </div>
    </aside>
  );
};

export default BlogSidebar;
