import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";

const values = [
  "Empresa local com experiencia em site, loja, SEO e conteudo.",
  "Nova camada de servico em automacoes, IA para atendimento e integracoes.",
  "Texto, design e estrutura pensados para quem contrata, nao para quem programa.",
  "Base pronta para crescer com Google, Maps, analytics e novas paginas.",
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24">
      <div className="container">
        <motion.div
          className="mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Sobre nós</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            A Codigo5 continua forte em web e mais completa na entrega
          </h2>
          <p className="text-lg text-muted-foreground">
            O foco e fazer o cliente entender rapido o que esta sendo vendido, confiar na
            empresa e encontrar um caminho simples para entrar em contato.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value, i) => (
            <motion.div
              key={value}
              className="rounded-[28px] border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <CircleCheckBig className="h-6 w-6 text-primary" />
              <p className="mt-4 text-base leading-7 text-foreground/85">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
