import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { clients } from "@/content/siteContent";

const proofCards = [
  {
    title: "Clientes reais no centro da narrativa",
    text: "O site atual exibe marcas como Escola Agro, Perrengue MT, Stilo Assessoria, Shop10 e Fundacao Abrigo Bom Jesus. O novo projeto transforma isso em prova clara de mercado.",
  },
  {
    title: "Casos e artigos que sustentam a autoridade",
    text: "Os posts sobre SEO local, velocidade, metodologia e IA aplicada mostram repertorio tecnico e comercial para fechar projetos mais consultivos.",
  },
  {
    title: "Posicionamento preparado para servicos de maior valor",
    text: "A nova narrativa conecta site, conteudo, performance, integracao e automacao em uma proposta mais madura e escalavel.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="clientes" className="py-24">
      <div className="container space-y-14">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Clientes e prova</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Marcas atendidas e sinais concretos de autoridade
          </h2>
          <p className="text-lg text-muted-foreground">
            O novo site deixa de lado depoimentos genéricos e mostra ativos reais da historia da Codigo5.
          </p>
        </motion.div>

        <div className="grid gap-5 rounded-[32px] border border-border bg-card p-8 md:grid-cols-4 xl:grid-cols-8">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex min-h-[108px] items-center justify-center rounded-3xl border border-border/70 bg-background px-5 py-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-12 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {proofCards.map((card, index) => (
            <motion.article
              key={card.title}
              className="rounded-[28px] border border-border bg-card p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <BadgeCheck className="h-8 w-8 text-primary" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.text}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="rounded-[28px] border border-primary/20 bg-primary/10 px-8 py-7"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <a
            href="https://codigo5.com.br/blog-codigo5-web-dicas-seo-marketing-digital/"
            target="_blank"
            rel="noreferrer"
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Base editorial ja publicada
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                Blog da Codigo5 com historico de SEO, performance, metodologia e IA.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              Ver blog atual
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
