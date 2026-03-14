import { motion } from "framer-motion";
import { Monitor, Code2, Wrench, Users2, Layers, Brain } from "lucide-react";

const services = [
  { icon: Monitor, title: "Consultoria de TI", desc: "Diagnóstico completo da infraestrutura tecnológica e planejamento estratégico para otimizar seus processos." },
  { icon: Code2, title: "Desenvolvimento de Software", desc: "Sistemas web e mobile sob medida, com tecnologias modernas e arquitetura escalável." },
  { icon: Wrench, title: "Manutenção de Software", desc: "Suporte contínuo, correções, atualizações e melhorias para manter seu sistema sempre performático." },
  { icon: Users2, title: "Terceirização de Desenvolvimento", desc: "Equipe dedicada de desenvolvedores para complementar seu time interno." },
  { icon: Layers, title: "Consultoria de Plataformas", desc: "Análise e recomendação das melhores plataformas digitais para o seu negócio." },
  { icon: Brain, title: "Soluções com IA", desc: "Automação inteligente, chatbots e integração de Inteligência Artificial nos seus processos." },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Serviços</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Soluções completas para seu negócio
          </h2>
          <p className="text-muted-foreground text-lg">
            Da consultoria ao desenvolvimento, oferecemos tudo que sua empresa precisa para crescer com tecnologia.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
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
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
