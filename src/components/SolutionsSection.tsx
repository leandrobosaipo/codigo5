import { motion } from "framer-motion";
import { services } from "@/content/siteContent";

const SolutionsSection = () => {
  return (
    <section id="solucoes" className="bg-background-alt py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Solucoes</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            O que a Codigo5 pode colocar para rodar no seu negocio
          </h2>
          <p className="text-lg text-muted-foreground">
            Menos promessa vaga. Mais pagina, conteudo, ferramenta e fluxo funcionando.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              className="group overflow-hidden rounded-[30px] border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-8">
                <h3 className="mb-3 font-display text-2xl font-semibold text-foreground">{service.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.items.map((item) => (
                    <span key={item} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
