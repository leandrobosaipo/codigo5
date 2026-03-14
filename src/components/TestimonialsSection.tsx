import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Carlos M.", role: "Dono de Clínica", text: "A automação do agendamento por WhatsApp reduziu 80% das ligações. Nosso time agora foca no atendimento presencial.", rating: 5 },
  { name: "Ana P.", role: "Diretora de E-commerce", text: "Os agentes de IA recuperam carrinhos abandonados automaticamente. Aumentamos as vendas em 35% no primeiro mês.", rating: 5 },
  { name: "Ricardo S.", role: "CEO de Serviços", text: "Integraram nossos sistemas e automatizaram relatórios que antes levavam horas. Equipe altamente competente.", rating: 5 },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-24 bg-background-alt">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Resultados reais com automação
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="p-8 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground mb-6 italic leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-display font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
