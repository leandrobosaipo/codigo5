import Reveal from "@/components/Reveal";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { services } from "@/content/siteContent";

const SolutionsSection = () => {
  return (
    <section
      id="solucoes"
      className="bg-[linear-gradient(180deg,#edf3ff_0%,#f5f8ff_44%,#eef4ff_100%)] py-16 sm:py-20 lg:py-24"
    >
      <div className="container space-y-6 sm:space-y-8">
        <Reveal>
          <SectionHeader
            kicker="Soluções âncora"
            title="Soluções para vender melhor, operar com menos ruído e parecer mais empresa."
            lead="A entrega certa depende do momento do negócio, mas a base precisa ser clara."
            aside="Menos discurso. Mais frentes objetivas para presença, captação e operação."
          />
        </Reveal>

        <SectionFrame className="space-y-8">
          <Reveal className="panel-dark overflow-hidden text-white">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                  Presença, captação e operação
                </p>
                <h3 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  A base certa muda rápido a percepção da empresa e a força do projeto no ar.
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    "Mais clareza de oferta",
                    "Mais contexto para vender",
                    "Mais ritmo na operação",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-slate-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-h-[240px] overflow-hidden lg:min-h-full">
                <img
                  src="/assets/codigo5/blog/site-clientes.webp"
                  alt="Projetos digitais da Código5 com foco comercial"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {services.map((service, i) => (
                <Reveal
                  key={service.name}
                  className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(244,248,255,0.96))] shadow-[0_26px_80px_-58px_rgba(17,29,56,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_38px_100px_-58px_rgba(13,28,62,0.25)] sm:rounded-[30px]"
                  delay={i * 70}
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,34,0.08),rgba(8,18,34,0.74))]" />
                    <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                      {service.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/92 backdrop-blur"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 p-5 sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                      Frente {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-[1.7rem] font-semibold leading-tight text-foreground sm:text-[1.95rem]">
                      {service.name}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground sm:min-h-[56px] sm:text-base">{service.description}</p>
                    <a
                      href="/servicos"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
                    >
                      Entender essa frente
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </Reveal>
              ))}
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default SolutionsSection;
