import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { clients, contact } from "@/content/siteContent";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(204,149,55,0.2),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(33,100,84,0.12),transparent_24%),linear-gradient(180deg,#f4ede3_0%,#faf6ef_42%,#fffdf9_100%)] pt-24"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1]" />
      <div className="absolute left-[-8%] top-[8%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-4rem] h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="container relative z-10 grid min-h-[calc(100vh-6rem)] items-center gap-14 py-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-3xl pb-4">
          <Reveal delay={0}>
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/78 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Código5 Web • Cuiabá
            </span>
          </Reveal>

          <Reveal
            as="h1"
            className="mb-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.9] text-foreground sm:text-6xl lg:text-[5.2rem]"
            delay={90}
          >
            Seu negócio precisa
            <span className="block text-primary">parecer pronto</span>
            para crescer.
          </Reveal>

          <Reveal
            as="p"
            className="mb-9 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
            delay={150}
          >
            Site, ecommerce, SEO e automações para empresa que quer passar
            confiança, organizar a operação e vender melhor no digital.
          </Reveal>

          <Reveal
            className="flex flex-wrap gap-4"
            delay={220}
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
          </Reveal>

          <Reveal
            className="mt-10 flex flex-wrap gap-3"
            delay={300}
          >
            {[
              "Sites institucionais",
              "Lojas virtuais",
              "SEO e conteúdo",
              "IA e automações",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary/15 bg-white/82 px-4 py-2 text-sm font-medium text-foreground/78 shadow-sm backdrop-blur"
              >
                {item}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal
          className="relative lg:pl-8"
          delay={180}
        >
          <div className="absolute inset-x-10 -top-6 h-24 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -left-4 top-14 hidden rounded-full border border-white/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/65 shadow-sm backdrop-blur lg:block">
            Presença • Conversão • Escala
          </div>
          <div className="relative overflow-hidden rounded-[40px] border border-border/70 bg-[linear-gradient(160deg,rgba(255,253,248,0.98),rgba(247,236,214,0.9))] p-4 shadow-[0_48px_130px_-62px_rgba(30,25,20,0.55)]">
            <div className="relative overflow-hidden rounded-[30px] border border-black/5">
              <img
                src="/assets/codigo5/logos/hero-ai.webp"
                alt="Planejamento digital e estratégia visual da Código5"
                className="h-[480px] w-full object-cover object-[74%_center] md:h-[560px]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.08)_0%,rgba(17,17,17,0.02)_34%,rgba(17,17,17,0.45)_100%)]" />
              <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-4">
                <div className="rounded-full border border-white/20 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                  Código5 Web
                </div>
                <div className="rounded-full border border-white/20 bg-white/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                  Desde 2010
                </div>
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="rounded-[28px] border border-white/15 bg-black/58 p-5 text-white shadow-[0_30px_70px_-48px_rgba(0,0,0,0.8)] backdrop-blur">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Presença", value: "site claro e forte" },
                      { label: "Venda", value: "ecommerce e SEO" },
                      { label: "Rotina", value: "integrações e IA" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-white/92">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container relative z-10 pb-12">
        <div className="rounded-[32px] border border-border/80 bg-white/78 p-5 shadow-[0_24px_70px_-50px_rgba(30,25,20,0.3)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Marcas atendidas
              </p>
              <p className="mt-2 text-sm text-foreground/66">
                Saúde, construção, mídia, varejo e institucional.
              </p>
            </div>
            <a href="/portfolio" className="text-sm font-medium text-primary transition hover:text-primary/80">
              Ver portfolio
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {clients.slice(0, 6).map((client) => (
              <div
                key={client.name}
                className={`flex min-h-[68px] min-w-[148px] items-center justify-center rounded-[22px] border px-4 py-3 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 ${
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
