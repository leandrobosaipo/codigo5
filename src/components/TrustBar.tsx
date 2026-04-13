import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TrustBar = () => {
  return (
    <section className="border-y border-border bg-ink py-10 text-ink-foreground">
      <div className="container">
        <motion.div
          className="grid gap-6 md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-foreground/60">Reputacao</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "fill-primary text-primary" : "fill-primary/45 text-primary/45"}`}
                  />
                ))}
              </div>
              <div>
                <span className="text-2xl font-display font-bold">4.7</span>
                <span className="ml-2 text-sm text-ink-foreground/70">avaliacao Google</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-foreground/60">Experiencia</p>
            <p className="mt-3 font-display text-3xl font-bold">15+ anos</p>
            <p className="mt-2 text-sm text-ink-foreground/70">
              Em desenvolvimento web, WordPress, SEO e operacao digital.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-foreground/60">Provas reais</p>
            <p className="mt-3 font-display text-3xl font-bold">8 marcas</p>
            <p className="mt-2 text-sm text-ink-foreground/70">
              Clientes e parceiros exibidos com identidade real no novo site.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-foreground/60">Nova proposta</p>
            <p className="mt-3 font-display text-xl font-bold">
              Sites, integracoes, automacoes e IA aplicada.
            </p>
            <p className="mt-2 text-sm text-ink-foreground/70">
              Mais valor percebido e mais oportunidades de ticket consultivo.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
