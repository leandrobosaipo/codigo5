import { motion } from "framer-motion";
import { MessageSquare, Table2, FileText, Copy, BarChart3, AlertTriangle } from "lucide-react";

const problems = [
  { icon: MessageSquare, text: "Responder manualmente WhatsApp" },
  { icon: Table2, text: "Organizar dados em planilhas" },
  { icon: FileText, text: "Publicar conteúdo manualmente" },
  { icon: Copy, text: "Copiar informações entre sistemas" },
  { icon: BarChart3, text: "Gerar relatórios manualmente" },
  { icon: AlertTriangle, text: "Perder leads por demora no atendimento" },
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
            Empresas ainda perdem horas com tarefas repetitivas
          </h2>
          <p className="text-muted-foreground text-lg">
            Sua equipe gasta tempo precioso em processos manuais que poderiam ser automatizados.
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
            Tudo isso pode ser{" "}
            <span className="text-gradient">automatizado com IA</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemsSection;
