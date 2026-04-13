import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clients, contact } from "@/content/siteContent";

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
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Sites, lojas, SEO e automacao para vender melhor
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] text-foreground sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Seu site precisa passar confianca e gerar contato.
          </motion.h1>

          <motion.p
            className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A Codigo5 organiza a presenca digital da empresa com pagina clara, prova
            real, Google melhor estruturado e automacoes que ajudam o atendimento a
            responder com mais velocidade.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" asChild>
              <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                Falar sobre o projeto
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/blog">Ver blog e noticias</a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              "Site simples de entender para quem esta pronto para contratar.",
              "Automacoes para responder melhor sem aumentar retrabalho.",
              "SEO e conteudo para atrair quem ja procura seu servico.",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-border bg-card/80 p-4 text-sm text-muted-foreground shadow-sm">
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
                Operacao digital
              </span>
              <p className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
                Site, atendimento e conteudo trabalhando juntos.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Estrutura pensada para mostrar servico, prova e caminho de contato.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container relative z-10 pb-12">
        <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-border bg-card/85 p-5 shadow-[0_24px_70px_-50px_rgba(30,25,20,0.45)]">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Marcas atendidas
          </span>
          {clients.slice(0, 6).map((client) => (
            <div
              key={client.name}
              className={`flex min-h-[64px] items-center justify-center rounded-[22px] border px-4 py-3 shadow-sm ${
                client.surface === "dark"
                  ? "border-slate-900/80 bg-slate-950"
                  : client.surface === "sand"
                    ? "border-amber-200 bg-[linear-gradient(135deg,#fff8eb,#f6ead2)]"
                    : "border-border/70 bg-white"
              }`}
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                width="160"
                height="48"
                className={`h-8 w-auto object-contain ${
                  client.surface === "dark" ? "brightness-0 invert" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
