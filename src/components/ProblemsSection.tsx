import { motion } from "framer-motion";
import { MessageSquare, Table2, FileText, Copy, BarChart3, AlertTriangle } from "lucide-react";

const problems = [
  { icon: MessageSquare, text: "WhatsApp lotado e sem triagem" },
  { icon: Table2, text: "Planilhas demais para vender e atender" },
  { icon: FileText, text: "Conteudo sem foco em busca ou conversao" },
  { icon: Copy, text: "Informacao repetida em varios sistemas" },
  { icon: BarChart3, text: "Pouca clareza do que gera lead" },
  { icon: AlertTriangle, text: "Site lento ou sem proposta clara" },
];

const ProblemsSection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">O Problema</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            O problema quase nunca e so o site
          </h2>
          <p className="text-lg text-muted-foreground">
            Normalmente a venda trava quando atendimento, conteudo e operacao nao conversam.
          </p>
        </motion.div>

        <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <motion.div
              key={p.text}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
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
          <p className="font-display text-xl font-semibold text-foreground">
            A melhor resposta junta site, busca, prova social e automacao.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemsSection;
