import { ArrowRight, Sparkles } from "lucide-react";
import SectionFrame from "@/components/SectionFrame";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { contact, homeAnchorClients } from "@/content/siteContent";

const heroMetrics = [
  { value: "15+", label: "anos de entrega em produção" },
  { value: "40+", label: "marcas atendidas em operação" },
  { value: "MT + BR", label: "projetos locais e nacionais" },
];

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(27,213,255,0.14),transparent_20%),linear-gradient(180deg,#07111f_0%,#0b1730_50%,#eef4ff_50%,#f7faff_100%)] pt-24"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />
      <div className="absolute left-[-8rem] top-[4rem] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-[-6rem] top-[8rem] h-80 w-80 rounded-full bg-cyan-500/12 blur-3xl" />

      <div className="container relative z-10 py-8 sm:py-10 lg:py-12">
        <SectionFrame dark className="overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(18,44,87,0.82),rgba(8,14,29,0.98)_58%)] text-white shadow-[0_45px_140px_-70px_rgba(6,12,28,0.85)]">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <Reveal delay={0}>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/22 bg-cyan-400/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-cyan-100" />
                  Sites, ecommerce, SEO e automações
                </span>
              </Reveal>

              <Reveal
                as="h1"
                delay={70}
                className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[0.92] text-white sm:text-5xl lg:text-[5.15rem]"
              >
                Estrutura digital
                <span className="block text-cyan-300">para empresa que precisa</span>
                vender com mais clareza.
              </Reveal>

              <Reveal
                as="p"
                delay={130}
                className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8"
              >
                A Código5 organiza presença digital, conteúdo e operação comercial para negócios
                que não podem parecer improvisados.
              </Reveal>

              <Reveal className="mt-7 flex flex-wrap gap-3 sm:gap-4" delay={180}>
                <Button size="lg" asChild>
                  <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                    Falar no WhatsApp
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-slate-300 bg-white/80 text-slate-900 hover:border-primary/40 hover:bg-white">
                  <a href="/portfolio">Ver portfólio</a>
                </Button>
              </Reveal>

              <Reveal className="mt-7 flex flex-wrap gap-3" delay={220}>
                {["Site + posicionamento", "SEO + conteúdo", "Ecommerce + automação"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100"
                  >
                    {item}
                  </span>
                ))}
              </Reveal>

              <Reveal className="mt-8 grid gap-3 sm:grid-cols-3" delay={260}>
                {heroMetrics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.05))] px-4 py-4 shadow-[0_18px_40px_-34px_rgba(18,26,52,0.22)] backdrop-blur sm:px-5"
                  >
                    <p className="font-display text-[1.75rem] font-bold text-white sm:text-3xl">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{item.label}</p>
                  </div>
                ))}
              </Reveal>

              <Reveal className="mt-8" delay={320}>
                <p className="text-sm leading-7 text-slate-200">
                  Projetos em mídia, saúde, varejo, institucional e operação digital regional.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {homeAnchorClients.slice(0, 6).map((client) => (
                    <div
                      key={client.name}
                      className={`flex min-h-[78px] items-center justify-center rounded-[18px] border px-4 py-3 ${
                        client.surface === "dark"
                          ? "border-white/10 bg-slate-950"
                          : "border-white/10 bg-white/92"
                      } ${client.frameClass ?? ""}`}
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        loading="lazy"
                        width="140"
                        height="42"
                        className={`${client.logoClass ?? "max-h-10"} max-w-full w-auto object-contain ${
                          client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="relative" delay={150}>
              <div className="absolute left-[8%] top-[6%] h-32 w-32 rounded-full bg-cyan-400/16 blur-3xl" />
              <div className="absolute bottom-[12%] right-[6%] h-36 w-36 rounded-full bg-cyan-500/12 blur-3xl" />

              <div className="relative">
                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-950 shadow-[0_42px_120px_-64px_rgba(0,0,0,0.85)]">
                  <img
                    src="/assets/codigo5/logos/hero-ai.webp"
                    alt="Painel visual da Código5 com interface e direção digital"
                    className="h-[360px] w-full object-cover object-center sm:h-[460px]"
                    loading="eager"
                    width="1280"
                    height="960"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(5,9,20,0.92))] p-5 sm:p-7">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        "Mais clareza para vender",
                        "Conteúdo que sustenta a busca",
                        "Operação digital conectada",
                      ].map((item) => (
                        <div key={item} className="rounded-[18px] border border-white/12 bg-black/28 px-4 py-3 text-sm font-medium text-slate-100 backdrop-blur">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto -mt-12 w-[92%] rounded-[26px] border border-white/12 bg-[linear-gradient(180deg,rgba(13,22,43,0.96),rgba(19,37,73,0.88))] p-4 shadow-[0_32px_90px_-58px_rgba(6,10,24,0.82)] backdrop-blur sm:w-[78%] sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
                    Fluxo direto
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { stage: "01", title: "Diagnóstico", detail: "oferta, gargalo e prioridade" },
                      { stage: "02", title: "Publicação", detail: "site, conteúdo e presença no ar" },
                    ].map((item) => (
                      <div key={item.stage} className="grid grid-cols-[auto_1fr] gap-3 rounded-[18px] border border-white/10 bg-black/16 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-sm font-semibold text-cyan-100">
                          {item.stage}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-200">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default HeroSection;
