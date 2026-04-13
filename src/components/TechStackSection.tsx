import { motion } from "framer-motion";
import { Brain, Sparkles, Workflow, Globe, MessageCircle, Cloud, Database } from "lucide-react";

const techs = [
  { icon: Globe, name: "WordPress / WooCommerce" },
  { icon: Cloud, name: "Cloudflare Pages" },
  { icon: Workflow, name: "n8n" },
  { icon: Brain, name: "OpenAI / GPT" },
  { icon: Sparkles, name: "Gemini / IA generativa" },
  { icon: MessageCircle, name: "WhatsApp API" },
  { icon: Database, name: "SEO, analytics e dados" },
  { icon: Globe, name: "APIs REST e integracoes" },
];

const TechStackSection = () => {
  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(204,149,55,0.18),rgba(27,24,20,0.96)_48%)] py-16 text-ink-foreground">
      <div className="container">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Tecnologias</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold mt-3">
            Pilha real para web, SEO, automacao e IA aplicada
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {techs.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <t.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-ink-foreground/80">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
