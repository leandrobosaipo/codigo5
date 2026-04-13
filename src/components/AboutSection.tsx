import { motion } from "framer-motion";
import { Brain, Puzzle, Settings, TrendingUp } from "lucide-react";
import { authorityPoints } from "@/content/siteContent";

const values = [
  { icon: Brain, title: "Autoridade em IA util", desc: "IA apresentada como ferramenta de negocio, nao como modismo vazio." },
  { icon: Puzzle, title: "Integracao ponta a ponta", desc: "Site, automacao, WhatsApp, CRM e analytics conectados para sustentar crescimento." },
  { icon: Settings, title: "Entrega realista e sob medida", desc: "Cada projeto respeita a maturidade da empresa e a capacidade operacional do cliente." },
  { icon: TrendingUp, title: "Visao comercial", desc: "A prioridade e gerar confianca, leads qualificados e mais clareza de proposta." },
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
            A Codigo5 evolui sem romper com o que ja construiu
          </h2>
          <p className="text-muted-foreground text-lg">
            O novo site deixa claro que a agencia ja tem base forte em web e agora
            expande a oferta com ferramentas de IA, integracoes e automacoes para
            aumentar eficiencia, performance e valor percebido.
          </p>
          <ul className="mt-6 space-y-3">
            {authorityPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
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
