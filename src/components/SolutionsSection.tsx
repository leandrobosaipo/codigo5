import { motion } from "framer-motion";
import { Bot, Cog, LayoutDashboard, Megaphone } from "lucide-react";

const solutions = [
  {
    icon: LayoutDashboard,
    title: "Sites institucionais e paginas de conversao",
    desc: "Projetos sob medida com foco em posicionamento, performance, autoridade e aproveitamento comercial do trafego.",
    items: ["Site corporativo", "Landing pages", "Portal de conteudo"],
  },
  {
    icon: Megaphone,
    title: "SEO, performance e crescimento organico",
    desc: "Arquitetura de conteudo, SEO tecnico e editorial para aparecer melhor no Google e converter com mais consistencia.",
    items: ["SEO local", "Conteudo estrategico", "Core Web Vitals"],
  },
  {
    icon: Cog,
    title: "Integracoes e automacoes",
    desc: "Conectamos site, CRM, WhatsApp, ecommerce, formularios e rotinas operacionais para reduzir retrabalho e acelerar atendimento.",
    items: ["Fluxos com n8n", "APIs e webhooks", "Operacao automatizada"],
  },
  {
    icon: Bot,
    title: "Ferramentas de IA aplicadas ao negocio",
    desc: "Implementamos IA em atendimento, qualificacao, producao de conteudo, dashboards e rotinas internas sem perder controle da operacao.",
    items: ["IA para atendimento", "IA para conteudo", "IA para produtividade"],
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
            A nova Codigo5 vende mais porque mostra amplitude real de entrega
          </h2>
          <p className="text-muted-foreground text-lg">
            O discurso sai do “site por site” e vira uma proposta completa de crescimento, operacao e autoridade.
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
