import { motion } from "framer-motion";
import { trustNumbers } from "@/content/siteContent";

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
          {trustNumbers.map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-ink-foreground/60">{item.label}</p>
              <p className="mt-3 font-display text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
