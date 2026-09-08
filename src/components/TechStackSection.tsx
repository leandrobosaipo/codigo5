import Reveal from "@/components/Reveal";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { portfolioClients, toolLogos } from "@/content/siteContent";

const operationalBlocks = [
  {
    title: "Performance",
    text: "Carregamento leve e experiência mais confiável.",
  },
  {
    title: "CMS simples",
    text: "Fácil de atualizar e evoluir sem virar dependência.",
  },
  {
    title: "Ecommerce conectado",
    text: "Loja, catálogo e operação mais alinhados.",
  },
  {
    title: "Integrações",
    text: "Fluxos que ajudam atendimento, comercial e rotina.",
  },
];

const TechStackSection = () => {
  return (
    <section className="bg-[linear-gradient(180deg,#eef4ff_0%,#f7faff_100%)] py-16 sm:py-20 lg:py-24">
      <div className="container">
        <SectionFrame className="space-y-8 sm:space-y-10">
          <Reveal>
            <SectionHeader
              kicker="Base operacional"
              title="Infraestrutura simples para manter o projeto forte no ar."
              lead="A tecnologia precisa sustentar a operação, não complicar a rotina."
              aside="Menos vitrine de ferramenta. Mais base clara para publicar, editar e evoluir."
            />
          </Reveal>

          <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
            <Reveal className="panel-soft overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1fr_0.92fr]">
                <div className="p-5 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    O que essa base resolve
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                    O projeto precisa ser rápido, estável e simples de evoluir no dia a dia.
                  </h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {operationalBlocks.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[20px] border border-border/80 bg-white/90 px-4 py-4 shadow-[0_20px_60px_-52px_rgba(18,26,52,0.14)]"
                      >
                        <p className="text-base font-semibold text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 border-l border-slate-200/70 bg-[linear-gradient(180deg,#eef4ff,#f7faff)] p-5 sm:grid-cols-2 sm:p-6">
                  {portfolioClients.slice(0, 4).map((client) => (
                    <div
                      key={client.name}
                      className={`flex min-h-[112px] items-center justify-center rounded-[22px] border px-4 py-4 shadow-[0_16px_50px_-40px_rgba(18,26,52,0.18)] ${
                        client.surface === "dark"
                          ? "border-slate-800 bg-slate-950"
                          : client.frameClass ?? "border-slate-200/80 bg-white"
                      }`}
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        className={`${client.logoClass ?? "max-h-10"} max-w-full w-auto object-contain ${
                          client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
              {toolLogos.slice(0, 8).map((tool, i) => (
                <Reveal
                  key={tool.name}
                  className="group rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(243,248,255,0.94))] p-4 shadow-[0_22px_70px_-52px_rgba(16,28,55,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 sm:rounded-[24px] sm:p-5"
                  delay={i * 45}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-slate-200/80 bg-white shadow-sm">
                    <img src={tool.logo} alt={tool.name} className="h-7 w-7 object-contain" />
                  </div>
                  <p className="mt-5 text-base font-semibold text-foreground">{tool.name}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Base real para publicar e operar sem ruído.</p>
                </Reveal>
              ))}
            </div>
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default TechStackSection;
