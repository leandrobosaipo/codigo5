import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Diagnóstico", desc: "Análise completa do seu negócio e identificação de processos repetitivos." },
  { number: "02", title: "Mapeamento", desc: "Identificação de oportunidades de automação e pontos de maior impacto." },
  { number: "03", title: "Desenho", desc: "Planejamento da automação com fluxos, integrações e agentes de IA." },
  { number: "04", title: "Desenvolvimento", desc: "Criação da solução com as melhores tecnologias de IA e automação." },
  { number: "05", title: "Implantação", desc: "Deploy e integração com seus sistemas existentes." },
  { number: "06", title: "Otimização", desc: "Suporte contínuo, monitoramento e melhorias constantes." },
];

const ProcessSection = () => {
  return (
    <section className="py-24 bg-background-alt">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Processo</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Como trabalhamos
          </h2>
          <p className="text-muted-foreground text-lg">
            Do diagnóstico à otimização, acompanhamos cada etapa do seu projeto.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              className="relative p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="text-4xl font-display font-extrabold text-primary/10">{s.number}</span>
              <h3 className="font-display font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
