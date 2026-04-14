import Reveal from "@/components/Reveal";
import { toolLogos } from "@/content/siteContent";

const TechStackSection = () => {
  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(204,149,55,0.18),rgba(27,24,20,0.96)_48%)] py-16 text-ink-foreground">
      <div className="container">
        <Reveal
          className="mb-10 mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Tecnologias</span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Ferramentas reais, escolhidas pelo que entregam</h2>
          <p className="mt-3 text-base leading-7 text-ink-foreground/75">
            O cliente nao precisa conhecer a stack. Precisa ver que o projeto usa ferramentas confiaveis.
          </p>
        </Reveal>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {toolLogos.map((tool, i) => (
            <Reveal
              key={tool.name}
              className="flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-4"
              delay={i * 50}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <img src={tool.logo} alt={tool.name} className="h-6 w-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-xs font-medium text-ink-foreground/80">{tool.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
