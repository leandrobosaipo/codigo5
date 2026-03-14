import { motion } from "framer-motion";
import { Shield, Target, Users, Zap } from "lucide-react";

const values = [
  { icon: Target, title: "Missão", desc: "Entregar soluções tecnológicas que impulsionem o crescimento dos nossos clientes." },
  { icon: Shield, title: "Confiança", desc: "Mais de 6 anos de experiência com empresas regionais e nacionais." },
  { icon: Users, title: "Atendimento", desc: "Suporte personalizado e acompanhamento contínuo em cada projeto." },
  { icon: Zap, title: "Inovação", desc: "Tecnologias modernas, IA e automação para resultados reais." },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 bg-background-alt">
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
            Especialistas em transformação digital
          </h2>
          <p className="text-muted-foreground text-lg">
            A Código5 Web é uma empresa especializada em desenvolvimento de software,
            consultoria tecnológica e soluções digitais personalizadas para empresas que
            desejam escalar seus negócios com tecnologia.
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
