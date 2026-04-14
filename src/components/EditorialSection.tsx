import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { blogCategories, featuredBlogPosts } from "@/content/blog";

const EditorialSection = () => {
  return (
    <section
      id="blog"
      className="bg-[linear-gradient(180deg,#f4eee4_0%,#fbf9f5_58%,#fffdf9_100%)] py-24"
    >
      <div className="container space-y-16">
        <Reveal
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Blog da Código5
          </span>
          <h2 className="section-heading mt-5 max-w-3xl">
            Conteudo para empresa que quer entender melhor onde vale investir
          </h2>
          <p className="section-lead max-w-2xl">
            Noticias, mercado e leitura util para quem quer crescer com mais clareza.
          </p>
        </Reveal>

        <div className="flex flex-wrap gap-3">
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

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr_0.85fr]">
          {featuredBlogPosts.map((post, index) => (
            <Reveal
              key={post.slug}
              className="group panel-soft overflow-hidden rounded-[30px]"
              delay={index * 80}
            >
              <div className={`overflow-hidden bg-muted ${index === 0 ? "aspect-[16/11]" : "aspect-[16/10]"}`}>
                <img
                  src={post.image ?? "/assets/codigo5/blog/metodologia.webp"}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className={`${index === 0 ? "p-8" : "p-7"} space-y-4`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {post.categories[0]?.name ?? "Blog"}
                </p>
                <h3 className={`font-display font-semibold leading-tight text-foreground ${index === 0 ? "text-3xl" : "text-2xl"}`}>
                  {post.title}
                </h3>
                <p className={`leading-6 text-muted-foreground ${index === 0 ? "line-clamp-3 text-base" : "line-clamp-2 text-sm"}`}>
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition group-hover:text-primary">
                  Ler materia
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="flex flex-wrap items-center justify-between gap-5 rounded-[30px] border border-primary/20 bg-[linear-gradient(135deg,rgba(204,149,55,0.16),rgba(255,250,240,0.96))] px-8 py-7 shadow-[0_24px_70px_-50px_rgba(30,25,20,0.32)]"
          delay={120}
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Leitura curta, util e com direcao comercial
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pautas por segmento, cidade e mercado para transformar interesse em conversa.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/blog">Explorar o blog</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
};

export default EditorialSection;
