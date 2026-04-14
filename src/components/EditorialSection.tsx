import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { blogCategories, featuredBlogPosts } from "@/content/blog";

const EditorialSection = () => {
  return (
    <section
      id="blog"
      className="bg-[linear-gradient(180deg,#f4eee4_0%,#fbf9f5_58%,#fffdf9_100%)] py-24"
    >
      <div className="container space-y-16">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Blog da Código5
          </span>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold text-foreground sm:text-5xl">
            Conteudo para empresa que quer entender melhor onde vale investir
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Noticias, mercado e leitura util para quem quer crescer com mais clareza.
          </p>
        </motion.div>

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
            <motion.div
              key={post.slug}
              className="group overflow-hidden rounded-[30px] border border-border bg-card shadow-[0_30px_90px_-58px_rgba(30,25,20,0.38)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
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
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-wrap items-center justify-between gap-5 rounded-[30px] border border-primary/20 bg-[linear-gradient(135deg,rgba(204,149,55,0.16),rgba(255,250,240,0.96))] px-8 py-7 shadow-[0_24px_70px_-50px_rgba(30,25,20,0.32)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
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
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialSection;
