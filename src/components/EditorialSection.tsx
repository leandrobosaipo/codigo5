import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import BlogFeatureCard from "@/components/BlogFeatureCard";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { useRuntimeBlog } from "@/hooks/use-runtime-blog";

const EditorialSection = () => {
  const { categories, featuredPosts } = useRuntimeBlog();
  const featuredCategories = categories.slice(0, 6);

  return (
    <section
      id="blog"
      className="bg-[linear-gradient(180deg,#091322_0%,#0c1830_100%)] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="container space-y-8 sm:space-y-12 lg:space-y-14">
        <Reveal>
          <SectionHeader
            kicker="Radar editorial"
            title="Conteúdo útil para aparecer melhor, educar o mercado e apoiar novas conversas."
            lead="O blog ajuda a fortalecer busca, autoridade e contexto comercial ao longo do tempo."
            invert
            aside={(
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Conteúdo com função comercial
                </span>
                <p>
                  Menos taxonomy pesada. Mais thumbnail forte, tema útil e blog com função clara.
                </p>
              </div>
            )}
          />
        </Reveal>

        <SectionFrame dark className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] sm:gap-5">
            <Reveal className="panel-dark overflow-hidden text-white">
              <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
                <div className="p-5 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/88">
                    Como o blog ajuda
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                    Conteúdo útil para captar demanda, reforçar autoridade e apoiar o fechamento.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100">
                    O blog organiza temas por segmento, responde dúvidas reais e ajuda a empresa a ser percebida com mais clareza antes do contato.
                  </p>
                  <div className="mt-6 grid gap-3">
                    {[
                      "Pautas por segmento que reforçam posicionamento e ajudam no SEO.",
                      "Conteúdo que alimenta a presença comercial sem parecer improvisado.",
                      "Estrutura editorial para transformar conhecimento em tráfego e conversa.",
                    ].map((item) => (
                      <div key={item} className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-sm leading-6 text-slate-100">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="min-h-[280px] overflow-hidden">
                  <img
                    src={featuredPosts[0]?.image || "/assets/codigo5/generated/blog-editorial-collage.png"}
                    alt="Destaque editorial da Código5"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal className="panel-soft p-5 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Assuntos em destaque
              </p>
              <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                {featuredCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    to={`/blog/categoria/${category.slug}`}
                    className="rounded-full border border-slate-300 bg-[linear-gradient(180deg,#ffffff,#f5f8fd)] px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-primary/35 hover:bg-[linear-gradient(180deg,#f8fbff,#eef6ff)] hover:text-slate-900 sm:px-4 sm:text-sm"
                  >
                    {category.name} ({category.count})
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  to="/blog"
                  className="text-sm font-semibold text-primary transition hover:text-accent"
                >
                  Ver todas as categorias
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="blog-feature-grid">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <Reveal key={post.slug} delay={index * 80}>
                <BlogFeatureCard
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  date={post.date}
                  readingMinutes={post.readingMinutes}
                  categories={post.categories}
                  showLink
                />
              </Reveal>
            ))}
          </div>
        </SectionFrame>

        <Reveal
          className="flex flex-wrap items-center justify-between gap-5 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-5 py-6 text-white shadow-[0_26px_80px_-60px_rgba(4,10,22,0.7)] sm:rounded-[30px] sm:px-8 sm:py-7"
          delay={120}
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-semibold text-white">
              Conteúdo e SEO trabalhando juntos para fortalecer presença e captação
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Um blog pensado para aparecer melhor e apoiar o comercial sem virar uma área pesada de leitura.
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
