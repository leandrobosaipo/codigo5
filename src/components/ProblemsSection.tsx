import { motion } from "framer-motion";
import { MessageSquare, Table2, FileText, Copy, BarChart3, AlertTriangle } from "lucide-react";

const problems = [
  { icon: MessageSquare, text: "Responder WhatsApp, direct e formulario como se tudo fosse urgencia" },
  { icon: Table2, text: "Depender de planilhas para operar leads, pedidos e tarefas" },
  { icon: FileText, text: "Publicar conteudo sem uma linha editorial que puxe vendas" },
  { icon: Copy, text: "Repetir dados entre site, CRM, ecommerce e financeiro" },
  { icon: BarChart3, text: "Nao saber quais paginas, campanhas e fluxos geram resultado" },
  { icon: AlertTriangle, text: "Ter site bonito, mas lento, sem SEO e sem clareza de oferta" },
];

const ProblemsSection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">O Problema</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            O gargalo digital raramente esta em uma unica ferramenta
          </h2>
          <p className="text-muted-foreground text-lg">
            Ele aparece quando site, conteudo, operacao e atendimento nao conversam entre si.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {problems.map((p, i) => (
            <motion.div
              key={p.text}
              className="flex items-center gap-4 p-5 rounded-lg bg-card border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <p.icon className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-sm font-medium text-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xl font-display font-semibold text-foreground">
            A resposta certa combina{" "}
            <span className="text-gradient">presenca digital forte, integracoes e automacao</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemsSection;
