import { motion } from "framer-motion";
import { clients, portfolioClients } from "@/content/siteContent";

const TestimonialsSection = () => {
  return (
    <section id="clientes" className="py-24">
      <div className="container space-y-14">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Clientes e prova</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Experiencia em segmentos diferentes gera mais credibilidade
          </h2>
          <p className="text-lg text-muted-foreground">
            A sessao agora mostra nomes reais, mercado atendido e variedade de projeto.
          </p>
        </motion.div>

        <div className="grid gap-5 rounded-[32px] border border-border bg-card p-8 md:grid-cols-2 xl:grid-cols-3">
          {portfolioClients.map((client, index) => (
            <motion.div
              key={client.name}
              className="rounded-3xl border border-border/70 bg-background p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div className="flex min-h-[68px] items-center">
                <img src={client.logo} alt={client.name} className="max-h-12 w-auto object-contain" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{client.segment}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{client.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{client.site}</p>
            </motion.div>
          ))}
        </div>

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
              <img src={client.logo} alt={client.name} className="max-h-12 w-auto object-contain" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
