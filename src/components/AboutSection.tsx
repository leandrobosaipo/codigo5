import { motion } from "framer-motion";
import { Brain, Puzzle, Settings, TrendingUp } from "lucide-react";

const values = [
  { icon: Brain, title: "Especialistas em IA", desc: "Profundo conhecimento em inteligência artificial aplicada a processos empresariais." },
  { icon: Puzzle, title: "Integrações Complexas", desc: "Experiência em conectar sistemas, APIs e plataformas para automação completa." },
  { icon: Settings, title: "Soluções Personalizadas", desc: "Cada automação é desenhada sob medida para as necessidades do seu negócio." },
  { icon: TrendingUp, title: "Foco em Resultado", desc: "Nossas soluções geram economia de tempo e aumento de receita mensurável." },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24">
      <div className="container">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Sobre nós</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Por que escolher a Código5 Web
          </h2>
          <p className="text-muted-foreground text-lg">
            Automatizamos processos empresariais usando Inteligência Artificial.
            Combinamos agentes de IA, automações com n8n e integrações com APIs
            para transformar tarefas manuais em processos automáticos que trabalham
            24 horas por dia.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
