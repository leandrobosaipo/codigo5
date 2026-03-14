import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Software · Consultoria · IA
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tecnologia e Inteligência Artificial para{" "}
            <span className="text-gradient">acelerar seu negócio</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Soluções completas em desenvolvimento de software, automação e consultoria
            tecnológica para empresas que desejam escalar com inovação.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" asChild>
              <a href="#contato">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://wa.me/5565999822022" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
