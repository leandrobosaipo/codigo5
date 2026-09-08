import Reveal from "@/components/Reveal";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { homeAnchorClients, methodologies } from "@/content/siteContent";

const ProcessSection = () => {
  return (
    <section className="bg-[linear-gradient(180deg,#0a1628_0%,#0e1b33_100%)] py-16 text-white sm:py-20 lg:py-24">
      <div className="container space-y-8 sm:space-y-10">
        <Reveal>
          <SectionHeader
            kicker="Como o projeto avança"
            title="Do diagnóstico à operação publicada, com menos ruído e mais direção."
            lead="O projeto precisa ganhar forma rápido e entrar no ar com base sólida."
            invert
            aside="Quatro etapas bastam aqui. O resto é aprofundamento, não hero da seção."
          />
        </Reveal>

        <SectionFrame dark className="space-y-8">
          <Reveal className="overflow-hidden rounded-[24px] border border-white/10">
            <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/78">
                  Linha do projeto
                </p>
                <h3 className="mt-4 max-w-md font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Oferta clara, estrutura certa, publicação forte e evolução quando fizer sentido.
                </h3>
              </div>
              <div className="grid gap-3 bg-[linear-gradient(180deg,#0c1730,#132242)] p-5 sm:grid-cols-2 sm:p-6">
                {homeAnchorClients.slice(0, 4).map((client) => (
                  <div
                    key={client.name}
                    className={`flex min-h-[112px] items-center justify-center rounded-[22px] border px-4 py-4 ${
                      client.surface === "dark" ? "border-white/10 bg-slate-950" : client.frameClass ?? "border-white/10 bg-white/92"
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

          <div className="grid gap-4 lg:grid-cols-4 sm:gap-5">
            {methodologies.map((item, i) => (
              <Reveal
                key={item.name}
                className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/22 sm:rounded-[30px] sm:p-6"
                delay={i * 75}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-cyan-300/18 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Etapa {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex gap-2">
                    {item.logos.map((logo) => (
                      <div
                        key={logo}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/18"
                      >
                        <img
                          src={logo}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          width="20"
                          height="20"
                          className="h-5 w-5 object-contain brightness-0 invert"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="mt-6 font-display text-[1.9rem] font-semibold leading-tight text-white sm:mt-8 sm:text-3xl">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-200 sm:mt-4 sm:text-base">{item.detail}</p>
                <div className="mt-6 h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.16),transparent)]" />
                <p className="mt-5 text-sm leading-6 text-slate-200">
                  {i === 0
                    ? "Entender oferta, gargalo e prioridade."
                    : i === 1
                      ? "Organizar páginas, conteúdo e jornada."
                      : i === 2
                        ? "Entrar no ar com leitura forte e estrutura clara."
                        : "Ajustar, expandir e conectar novas camadas."}
                </p>
              </Reveal>
            ))}
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default ProcessSection;
