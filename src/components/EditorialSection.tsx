import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { editorialTracks, featuredPosts } from "@/content/siteContent";
import { Button } from "@/components/ui/button";

const EditorialSection = () => {
  return (
    <section id="blog" className="py-24 bg-background-alt">
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
            Blog com autoridade para atrair clientes por segmento e por oportunidade
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            O novo site nao fica preso a posts genericos. Ele apresenta frentes editoriais
            que educam o mercado, despertam demanda e conectam servicos como sites, lojas
            virtuais, SEO, integracoes e automacoes.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {editorialTracks.map((track, index) => (
            <motion.article
              key={track.segment}
              className="rounded-[28px] border border-border bg-card p-8 shadow-[0_24px_80px_-48px_rgba(28,24,18,0.35)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Segmento
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                {track.segment}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{track.angle}</p>
              <ul className="mt-6 space-y-3">
                {track.ideas.map((idea) => (
                  <li key={idea} className="flex gap-3 text-sm text-foreground/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {featuredPosts.map((post, index) => (
            <motion.a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-[28px] border border-border bg-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="space-y-4 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {post.category}
                </p>
                <h3 className="font-display text-2xl font-semibold leading-tight text-foreground">
                  {post.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{post.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition group-hover:text-primary">
                  Ler conteudo
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>
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
              Conteudo consultivo para gerar conversa comercial
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Cada trilha editorial abre caminho para diagnosticos, propostas de sites,
              lojas virtuais, integracoes e automacoes personalizadas.
            </p>
          </div>
          <Button asChild size="lg">
            <a href="#contato">Planejar calendario editorial</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialSection;
