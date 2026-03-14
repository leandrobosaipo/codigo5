import { motion } from "framer-motion";
import { Brain, Sparkles, Workflow, Globe, MessageCircle, Cloud, Database } from "lucide-react";

const techs = [
  { icon: Brain, name: "OpenAI / GPT" },
  { icon: Sparkles, name: "Gemini" },
  { icon: Workflow, name: "n8n" },
  { icon: Globe, name: "APIs REST" },
  { icon: MessageCircle, name: "WhatsApp API" },
  { icon: Cloud, name: "Automações Cloud" },
  { icon: Database, name: "Bancos de Dados" },
];

const TechStackSection = () => {
  return (
    <section className="py-16 bg-navy text-navy-foreground">
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
            Ferramentas que impulsionam nossas soluções
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {techs.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex flex-col items-center gap-2 px-4 py-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="w-12 h-12 rounded-lg bg-navy-foreground/10 flex items-center justify-center">
                <t.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-navy-foreground/80">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
