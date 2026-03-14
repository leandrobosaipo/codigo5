import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  { title: "Sistema de Gestão Empresarial", category: "Sistemas Web", desc: "Plataforma completa de ERP para gestão de processos internos." },
  { title: "Automação de Processos", category: "Automação", desc: "Integração entre sistemas e eliminação de tarefas manuais repetitivas." },
  { title: "Portal Corporativo", category: "Sites Corporativos", desc: "Site institucional otimizado para SEO e geração de leads." },
  { title: "Plataforma de Atendimento", category: "Plataformas Digitais", desc: "Sistema de tickets e atendimento ao cliente com painel analítico." },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 bg-background-alt">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Portfólio</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Projetos que geram resultados
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="group relative p-8 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{p.category}</span>
              <h3 className="font-display font-semibold text-lg text-foreground mt-2 mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all duration-200">
                Ver detalhes <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
