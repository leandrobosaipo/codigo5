import Reveal from "@/components/Reveal";
import { services } from "@/content/siteContent";

const SolutionsSection = () => {
  return (
    <section
      id="solucoes"
      className="bg-[linear-gradient(180deg,#fbf8f3_0%,#f3ede3_100%)] py-24"
    >
      <div className="container">
        <Reveal
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="section-kicker">Solucoes</span>
          <h2 className="section-heading">
            O que a Codigo5 coloca no ar para a empresa vender melhor
          </h2>
          <p className="section-lead">
            Quatro frentes que costumam resolver o que mais pesa na presenca digital.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.name}
              className="group panel-soft overflow-hidden rounded-[34px] bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_32px_90px_-52px_rgba(30,25,20,0.45)]"
              delay={i * 80}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02),rgba(10,10,10,0.62))]" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex flex-wrap gap-2">
                    {service.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl font-semibold text-foreground">{service.name}</h3>
                </div>
                <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">{service.description}</p>
                <a
                  href="/servicos"
                  className="mt-5 inline-flex text-sm font-semibold text-foreground transition hover:text-primary"
                >
                  Ver como isso entra no projeto
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
