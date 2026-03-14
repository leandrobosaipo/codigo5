import { motion } from "framer-motion";
import { Bot, Cog, LayoutDashboard, Megaphone } from "lucide-react";

const solutions = [
  {
    icon: Bot,
    title: "Agentes de IA para Empresas",
    desc: "Atendimento automático no WhatsApp, respostas inteligentes, qualificação de leads e suporte automatizado 24/7.",
    items: ["Atendimento WhatsApp", "Qualificação de leads", "Suporte automatizado"],
  },
  {
    icon: Cog,
    title: "Automação de Processos",
    desc: "Automação de tarefas repetitivas, integração entre sistemas, geração automática de relatórios e processamento de dados.",
    items: ["Integração entre sistemas", "Relatórios automáticos", "Processamento de dados"],
  },
  {
    icon: LayoutDashboard,
    title: "Apps com Inteligência Artificial",
    desc: "Sistemas internos com IA, ferramentas personalizadas e dashboards inteligentes para tomada de decisão.",
    items: ["Sistemas internos com IA", "Ferramentas sob medida", "Dashboards inteligentes"],
  },
  {
    icon: Megaphone,
    title: "Automação de Marketing",
    desc: "Geração de conteúdo com IA, publicação automatizada em redes sociais e análise de dados de marketing.",
    items: ["Geração de conteúdo", "Publicação automática", "Análise de dados"],
  },
];

const SolutionsSection = () => {
  return (
    <section id="solucoes" className="py-24 bg-background-alt">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Soluções</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Automação inteligente para cada área do seu negócio
          </h2>
          <p className="text-muted-foreground text-lg">
            Combinamos agentes de IA, automações com n8n e integrações com APIs para transformar seu negócio.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              className="group p-8 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-5 transition-colors duration-200">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
              <ul className="space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
