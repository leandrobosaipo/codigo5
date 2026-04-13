import { motion } from "framer-motion";
import { methodologies } from "@/content/siteContent";

const ProcessSection = () => {
  return (
    <section className="bg-background-alt py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Processo</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Como a Codigo5 faz o projeto sair do papel
          </h2>
          <p className="text-lg text-muted-foreground">
            Menos etapa abstrata e mais decisao pratica para o site vender melhor.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methodologies.map((item, i) => (
            <motion.div
              key={item.name}
              className="overflow-hidden rounded-[28px] border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="border-b border-border bg-[linear-gradient(135deg,rgba(204,149,55,0.12),rgba(255,251,245,0.96))] p-6">
                <div className="flex gap-3">
                  {item.logos.map((logo) => (
                    <div
                      key={logo}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-white shadow-sm"
                    >
                      <img src={logo} alt="" aria-hidden="true" loading="lazy" width="24" height="24" className="h-6 w-6 object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground">{item.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
