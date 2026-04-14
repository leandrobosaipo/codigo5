import Reveal from "@/components/Reveal";
import { methodologies } from "@/content/siteContent";

const ProcessSection = () => {
  return (
    <section className="bg-background-alt py-24">
      <div className="container">
        <Reveal
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="section-kicker">Processo</span>
          <h2 className="section-heading sm:text-4xl">
            Como a entrega acontece sem virar projeto confuso
          </h2>
          <p className="section-lead">
            Menos improviso, mais clareza do que entra antes, durante e depois da publicacao.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methodologies.map((item, i) => (
            <Reveal
              key={item.name}
              className="panel-soft overflow-hidden rounded-[28px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_30px_80px_-54px_rgba(30,25,20,0.3)]"
              delay={i * 80}
            >
              <div className="border-b border-border bg-[linear-gradient(135deg,rgba(204,149,55,0.12),rgba(255,251,245,0.96))] p-6">
                <div className="flex gap-3">
                  {item.logos.map((logo) => (
                    <div
                      key={logo}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-white shadow-sm"
                    >
                      <img src={logo} alt="" aria-hidden="true" loading="lazy" width="24" height="24" className="h-6 w-6 object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground">{item.name}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
