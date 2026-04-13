import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { blogCategories, featuredBlogPosts } from "@/content/blog";

const EditorialSection = () => {
  return (
    <section id="blog" className="bg-background-alt py-24">
      <div className="container space-y-16">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Conteudo que vende
          </span>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold text-foreground sm:text-4xl">
            Blog interno pronto para disputar busca por servico e segmento
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            O conteudo antigo foi trazido para dentro do novo site e agora pode crescer com
            paginas que abrem demanda por nicho, cidade, servico e oportunidade de mercado.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3">
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

        <div className="grid gap-6 xl:grid-cols-3">
          {featuredBlogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              className="group overflow-hidden rounded-[28px] border border-border bg-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={post.image ?? "/assets/codigo5/blog/metodologia.webp"}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="space-y-4 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {post.categories[0]?.name ?? "Blog"}
                </p>
                <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">
                  {post.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition group-hover:text-primary">
                  Ler conteudo
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-wrap items-center justify-between gap-5 rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,rgba(204,149,55,0.12),rgba(255,250,240,0.95))] px-8 py-7"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Blog pronto para crescer com servico, nicho e noticia
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Isso abre espaco para artigos sobre bicicletas, e-bikes, saude, varejo e
              outros segmentos onde a Codigo5 pode vender site, loja virtual e automacao.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/blog">Abrir blog completo</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialSection;
