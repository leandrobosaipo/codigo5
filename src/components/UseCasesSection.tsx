import Reveal from "@/components/Reveal";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { useCases } from "@/content/siteContent";

const UseCasesSection = () => {
  return (
    <section id="casos" className="bg-[linear-gradient(180deg,#091423_0%,#0d1b30_100%)] py-16 text-white sm:py-20 lg:py-24">
      <div className="container space-y-8 sm:space-y-10">
        <Reveal>
          <SectionHeader
            kicker="Onde isso encaixa"
            title="Segmentos em que presença, captação e operação digital precisam andar juntas."
            lead="A Código5 costuma gerar mais resultado quando o projeto precisa vender melhor e responder com mais clareza."
            invert
            aside="Três recortes bastam aqui. O objetivo é mostrar encaixe rápido, não explicar demais."
          />
        </Reveal>

        <SectionFrame dark className="space-y-8">
          <div className="grid gap-4 xl:grid-cols-3 sm:gap-6">
            {useCases.map((item, i) => (
              <Reveal
                key={item.title}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 sm:rounded-[32px]"
                delay={i * 90}
              >
                <div className="absolute inset-0">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.22),rgba(5,12,24,0.94))]" />
                </div>

                <div className="relative flex min-h-[420px] flex-col justify-between p-5 sm:min-h-[500px] sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:text-[11px]">
                      Segmento {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex max-w-[60%] flex-wrap justify-end gap-2">
                      {item.points.map((point) => (
                        <span
                          key={point}
                          className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/92"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="max-w-sm font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-100 sm:mt-4 sm:text-base">
                      {item.summary}
                    </p>
                    <div className="mt-5 rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-4 text-sm leading-6 text-slate-100 backdrop-blur sm:mt-6 sm:rounded-[24px]">
                      Projeto pensado para parecer mais forte e facilitar a resposta ao cliente.
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default UseCasesSection;
