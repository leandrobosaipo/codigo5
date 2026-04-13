import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clients, contact } from "@/content/siteContent";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(204,149,55,0.22),transparent_28%),linear-gradient(180deg,#f5eee4_0%,#fbf8f3_38%,#fffdf9_100%)] pt-24"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.18]" />
      <div className="absolute left-[-8%] top-[8%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-4rem] h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative z-10 grid min-h-[calc(100vh-6rem)] items-center gap-14 py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Sites, lojas e automacoes para empresas que querem vender melhor
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.92] text-foreground sm:text-6xl lg:text-[5.1rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Sua empresa precisa
            <span className="block text-primary">parecer maior</span>
            para vender melhor.
          </motion.h1>

          <motion.p
            className="mb-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A Código5 junta site, loja virtual, conteudo e automacao
            em uma estrutura que passa confianca, facilita o contato
            e sustenta o crescimento da operacao.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" asChild>
              <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                Conversar sobre o projeto
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/portfolio">Ver marcas atendidas</a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 grid gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: "Site", label: "com cara de empresa estabelecida" },
              { value: "Loja", label: "pronta para campanha e pedido" },
              { value: "Rotina", label: "mais leve com automacoes" },
            ].map((item) => (
              <div
                key={item.value}
                className="rounded-[28px] border border-white/70 bg-white/78 p-4 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.28)] backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{item.value}</p>
                <p className="mt-3 text-sm font-medium leading-6 text-foreground/80">{item.label}</p>
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
          <div className="relative overflow-hidden rounded-[34px] border border-border/80 bg-[linear-gradient(160deg,rgba(255,252,246,0.98),rgba(255,244,225,0.84))] p-4 shadow-[0_40px_120px_-60px_rgba(30,25,20,0.55)]">
            <img
              src="/assets/codigo5/logos/hero-ai.webp"
              alt="Especialista em inteligencia artificial da Codigo5"
              className="h-full w-full rounded-[24px] object-cover"
            />
            <div className="absolute left-6 top-6 max-w-[15rem] rounded-[24px] border border-white/60 bg-white/88 p-5 shadow-lg backdrop-blur">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Estrategia digital
              </span>
              <p className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">
                O visual precisa vender antes do atendimento comecar.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Clareza, prova real e caminho simples para o cliente chamar.
              </p>
            </div>
            <div className="absolute bottom-6 right-6 max-w-[16rem] rounded-[26px] border border-slate-900/85 bg-slate-950/92 p-5 text-slate-50 shadow-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                O que muda
              </p>
              <p className="mt-3 font-display text-2xl font-semibold leading-tight">
                Menos cara de improviso.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Mais confianca para cliente, parceiro e equipe comercial.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container relative z-10 pb-12">
        <div className="rounded-[30px] border border-border/80 bg-white/76 p-5 shadow-[0_24px_70px_-50px_rgba(30,25,20,0.35)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Marcas atendidas
              </p>
              <p className="mt-2 text-sm text-foreground/70">
                Experiencia em varejo, saude, midia, institucional e servicos.
              </p>
            </div>
            <a href="/portfolio" className="text-sm font-medium text-primary transition hover:text-primary/80">
              Ver portfolio
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {clients.slice(0, 6).map((client) => (
              <div
                key={client.name}
                className={`flex min-h-[68px] items-center justify-center rounded-[22px] border px-4 py-3 shadow-sm ${
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
                  className={`${client.logoClass ?? "h-8"} w-auto object-contain ${
                    client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
