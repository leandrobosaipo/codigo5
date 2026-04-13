import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { contact } from "@/content/siteContent";

const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute left-[-10%] top-[18%] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="container relative z-10 grid min-h-[calc(100vh-6rem)] items-center gap-14 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              IA aplicada, integracoes, automacoes e sites que performam
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] text-foreground sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A Codigo5 posiciona sua empresa com{" "}
            <span className="text-gradient">sites, SEO, IA e automacoes</span>{" "}
            que geram conversa comercial.
          </motion.h1>

          <motion.p
            className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A base real da agencia continua forte em desenvolvimento web, WordPress,
            lojas virtuais, SEO e marketing digital. O novo posicionamento adiciona
            autoridade em ferramentas de IA, integracoes e automacoes para aumentar
            eficiencia, velocidade e resultado.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" asChild>
              <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                Diagnostico no WhatsApp
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#solucoes">
                <Bot className="mr-2 h-4 w-4" />
                Ver servicos
              </a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              "Projetos sob medida para marcas que precisam vender melhor online.",
              "Automacoes e integrações para reduzir tarefas manuais e acelerar times.",
              "Conteudo consultivo para transformar busca organica em oportunidade.",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-border bg-card/70 p-4 text-sm text-muted-foreground shadow-sm">
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <div className="absolute inset-x-10 -top-6 h-24 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-[linear-gradient(135deg,rgba(255,250,240,0.92),rgba(255,255,255,0.85))] p-4 shadow-[0_40px_120px_-60px_rgba(30,25,20,0.55)]">
            <img
              src="/assets/codigo5/logos/hero-ai.webp"
              alt="Especialista em inteligencia artificial da Codigo5"
              className="h-full w-full rounded-[24px] object-cover"
            />
            <div className="absolute left-8 top-8 max-w-xs rounded-[24px] border border-white/50 bg-white/85 p-5 backdrop-blur">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Nova autoridade
              </span>
              <p className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
                Ferramentas de IA com aplicacao pratica no negocio.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Atendimento, conteudo, operacao, relatorios e integracoes entre
                sistemas com foco em ganho real de produtividade.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
