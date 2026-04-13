import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Diagnostico", desc: "Entendimento da oferta, publico, canais atuais e gargalos comerciais do negocio." },
  { number: "02", title: "Posicionamento", desc: "Definicao da mensagem central, promessas, prova social e frentes de autoridade." },
  { number: "03", title: "Arquitetura", desc: "Planejamento de paginas, funis, SEO tecnico, categorias e blocos de conteudo." },
  { number: "04", title: "Execucao", desc: "Design, desenvolvimento, integracoes, paginas e automacoes implementadas em conjunto." },
  { number: "05", title: "Publicacao", desc: "Deploy, ajustes finais, performance e configuracao de medicao para acompanhar o resultado." },
  { number: "06", title: "Evolucao", desc: "Calendario editorial, melhoria continua e novas automacoes conforme o negocio cresce." },
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
            Como fazemos um site que realmente converte
          </h2>
          <p className="text-muted-foreground text-lg">
            A metodologia nao para no layout: ela amarra oferta, SEO, conteudo, tecnologia e operacao.
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
