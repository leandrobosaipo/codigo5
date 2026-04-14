import { motion } from "framer-motion";
import { trustNumbers } from "@/content/siteContent";

const TrustBar = () => {
  return (
    <section className="border-y border-border bg-ink py-10 text-ink-foreground">
      <div className="container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-foreground/55">
              Base da operacao
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-foreground">
              Experiencia local com portfolio que atravessa mercados
            </h2>
          </div>
        </div>
        <motion.div
          className="grid gap-4 md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {trustNumbers.map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_60px_-52px_rgba(0,0,0,0.75)]"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-ink-foreground/55">{item.label}</p>
              <p className="mt-4 font-display text-3xl font-bold leading-none">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
