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
            Como a Codigo5 organiza um projeto
          </h2>
          <p className="text-lg text-muted-foreground">
            Cada etapa resolve uma parte da venda: entender, organizar, publicar e evoluir.
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
              <div className="aspect-[5/4] overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
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
