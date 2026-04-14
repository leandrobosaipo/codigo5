import { motion } from "framer-motion";
import { useCases } from "@/content/siteContent";

const UseCasesSection = () => {
  return (
    <section id="casos" className="py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Segmentos</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Recortes que mostram onde a entrega encaixa com clareza
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            Exemplos de mercados onde site, conteudo e operacao digital costumam abrir oportunidade real.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((item, i) => (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-[30px] border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="absolute inset-0">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              </div>
              <div className="relative flex min-h-[420px] flex-col justify-end p-8 text-white">
                <h3 className="font-display text-3xl font-semibold">{item.title}</h3>
                <p className="mt-3 max-w-sm text-base leading-7 text-white/80">{item.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.points.map((point) => (
                    <span key={point} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                      {point}
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

export default UseCasesSection;
