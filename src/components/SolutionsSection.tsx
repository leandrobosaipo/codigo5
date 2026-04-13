import { motion } from "framer-motion";
import { services } from "@/content/siteContent";

const SolutionsSection = () => {
  return (
    <section
      id="solucoes"
      className="bg-[linear-gradient(180deg,#fbf8f3_0%,#f3ede3_100%)] py-24"
    >
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Solucoes</span>
          <h2 className="mt-3 mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            O que a Código5 coloca para trabalhar a favor do seu negocio
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            Menos explicacao tecnica. Mais estrutura para apresentar bem, vender melhor
            e ganhar tempo na operacao.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              className="group overflow-hidden rounded-[34px] border border-border/80 bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_32px_90px_-52px_rgba(30,25,20,0.45)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02),rgba(10,10,10,0.62))]" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex flex-wrap gap-2">
                    {service.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="mb-3 font-display text-3xl font-semibold text-foreground">{service.name}</h3>
                <p className="max-w-md text-base leading-7 text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
