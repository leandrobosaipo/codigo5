import { motion } from "framer-motion";
import { Stethoscope, ShoppingCart, FileText } from "lucide-react";

const cases = [
  {
    icon: Stethoscope,
    title: "Clínica Médica",
    category: "Saúde",
    automations: [
      "Agendamento automático via WhatsApp",
      "Confirmação de consultas por IA",
      "Respostas inteligentes a pacientes",
      "Relatórios de atendimento automáticos",
    ],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    category: "Varejo Digital",
    automations: [
      "Atendimento ao cliente 24/7 com IA",
      "Recuperação automática de carrinho",
      "Geração de relatórios de vendas",
      "Integração com sistemas de estoque",
    ],
  },
  {
    icon: FileText,
    title: "Portal de Conteúdo",
    category: "Marketing",
    automations: [
      "Geração de artigos com IA",
      "Publicação automática em blog",
      "Distribuição em redes sociais",
      "Análise de performance de conteúdo",
    ],
  },
];

const UseCasesSection = () => {
  return (
    <section id="casos" className="py-24">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Casos de Uso</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Automação em ação
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja como aplicamos IA e automação em diferentes segmentos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              className="group relative p-8 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <c.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{c.category}</span>
              <h3 className="font-display font-semibold text-lg text-foreground mt-1 mb-4">{c.title}</h3>
              <ul className="space-y-2">
                {c.automations.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {a}
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

export default UseCasesSection;
