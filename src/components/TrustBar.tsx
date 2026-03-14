import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TrustBar = () => {
  return (
    <section className="py-12 bg-navy text-navy-foreground">
      <div className="container">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/60 text-yellow-400/60"}`}
                />
              ))}
            </div>
            <div>
              <span className="text-2xl font-display font-bold">4.7</span>
              <span className="text-sm text-navy-foreground/70 ml-2">no Google</span>
            </div>
          </div>

          <div className="h-8 w-px bg-navy-foreground/20 hidden md:block" />

          <div className="text-center md:text-left">
            <span className="text-2xl font-display font-bold">6+</span>
            <span className="text-sm text-navy-foreground/70 ml-2">avaliações positivas</span>
          </div>

          <div className="h-8 w-px bg-navy-foreground/20 hidden md:block" />

          <div className="text-center md:text-left">
            <span className="text-sm text-navy-foreground/70 italic">
              "Bom atendimento. Atendeu 100% das expectativas."
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
