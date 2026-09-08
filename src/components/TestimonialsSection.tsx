import Reveal from "@/components/Reveal";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { portfolioClients, supportingProofClients } from "@/content/siteContent";

const anchorClientNames = [
  "Perrengue Mato Grosso",
  "Roo Noticias",
  "AlphaVille Buffet",
];

const brandSurfaceClass = (surface?: string) => {
  if (surface === "dark") return "border-slate-900/85 bg-[radial-gradient(circle_at_top,#2b3240,#09090b_62%)]";
  if (surface === "sand") return "border-slate-200/80 bg-[linear-gradient(135deg,#ffffff,#eef4ff)]";
  return "border-slate-200/80 bg-white";
};

const TestimonialsSection = () => {
  const anchorClients = anchorClientNames
    .map((name) => portfolioClients.find((client) => client.name === name))
    .filter(Boolean);

  const supportingClients = supportingProofClients
    .filter((client) => !anchorClientNames.includes(client.name))
    .slice(0, 8);

  return (
    <section id="clientes" className="bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_100%)] py-24">
      <div className="container space-y-10">
        <Reveal>
          <SectionHeader
            kicker="Credenciais"
            title="Experiência em projetos que exigem confiança, leitura rápida e presença forte."
            lead="O repertório precisa ser percebido rápido. Menos discurso. Mais marca, contexto e prova visual."
            aside="Aqui a função é simples: mostrar que a Código5 já atende operações reais em segmentos diferentes."
          />
        </Reveal>

        <SectionFrame className="space-y-8">
          <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <Reveal className="panel-soft overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="p-6 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Repertório visual
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                    Projetos em mídia, saúde, institucional, varejo e operação digital regional.
                  </h3>
                  <div className="mt-6 grid gap-3">
                    {[
                      "Marcas locais e regionais com necessidade real de presença forte.",
                      "Portfólio com tipos de projeto diferentes sem perder direção visual.",
                      "Entrega pensada para quem precisa vender, informar e operar melhor.",
                    ].map((item) => (
                      <div key={item} className="rounded-[20px] border border-border/80 bg-white/90 px-4 py-3 text-sm leading-6 text-foreground/80">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-200/70">
                  {supportingClients.slice(0, 4).map((client) => (
                    <div
                      key={client.name}
                      className={`flex min-h-[150px] items-center justify-center bg-white px-5 py-5 ${client.frameClass ?? ""}`}
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        loading="lazy"
                        width="180"
                        height="56"
                        className={`${client.logoClass ?? "max-h-12"} max-w-full w-auto object-contain ${
                          client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="panel-dark p-7 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                Onde a entrega aparece
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  { label: "Saúde", text: "Projetos com clareza, confiança e contato simples." },
                  { label: "Mídia", text: "Operações com presença forte, ritmo e navegação clara." },
                  { label: "Institucional", text: "Marcas que pedem solidez visual e credibilidade." },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/84">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{item.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {anchorClients.map((client, index) => (
              <Reveal
                key={client.name}
                className="rounded-[30px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(242,247,255,0.95))] p-5 shadow-[0_24px_70px_-50px_rgba(16,27,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
                delay={index * 60}
              >
                <div
                  className={`flex min-h-[160px] items-center justify-center rounded-[24px] border px-6 py-6 ${brandSurfaceClass(client.surface)} ${client.frameClass ?? ""}`}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    width="260"
                    height="88"
                    className={`${client.logoClass ?? "max-h-14"} max-w-full w-auto object-contain ${
                      client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                    }`}
                  />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {client.segment}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">{client.name}</h3>
                <a
                  href={`https://${client.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-medium text-foreground/70 transition hover:text-primary"
                >
                  {client.site}
                </a>
              </Reveal>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {supportingClients.slice(4, 12).map((client, index) => (
              <Reveal
                key={client.name}
                className={`flex min-h-[108px] items-center justify-center rounded-[24px] border px-5 py-4 shadow-[0_20px_60px_-50px_rgba(16,27,53,0.15)] ${brandSurfaceClass(client.surface)} ${client.frameClass ?? ""}`}
                delay={index * 35}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  width="180"
                  height="56"
                  className={`${client.logoClass ?? "max-h-12"} max-w-full w-auto object-contain ${
                    client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default TestimonialsSection;
