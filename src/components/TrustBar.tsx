import Reveal from "@/components/Reveal";
import { homeAnchorClients } from "@/content/siteContent";

const TrustBar = () => {
  return (
    <section className="relative border-y border-border/60 bg-[linear-gradient(180deg,#f4f8ff_0%,#eef4ff_100%)] py-8">
      <div className="container relative z-10">
        <div className="grid gap-6 rounded-[30px] border border-slate-200/80 bg-white/90 px-5 py-6 shadow-[0_26px_80px_-56px_rgba(14,24,47,0.2)] sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                Marcas e operações atendidas
              </p>
              <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                Repertório real em mídia, saúde, varejo, institucional e operação digital regional.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                A prova principal aqui é visual. O objetivo não é explicar demais. É mostrar rápido
                que a Código5 já atende projetos reais.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {homeAnchorClients.slice(0, 6).map((client, index) => (
              <Reveal
                key={client.name}
                className={`flex min-h-[88px] items-center justify-center rounded-[22px] border px-5 py-4 shadow-[0_18px_40px_-34px_rgba(18,26,52,0.16)] ${
                  client.surface === "dark"
                    ? "border-slate-900/80 bg-slate-950"
                    : client.surface === "sand"
                      ? "border-slate-200/80 bg-[linear-gradient(135deg,#ffffff,#f2f6ff)]"
                      : "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(242,247,255,0.95))]"
                } ${client.frameClass ?? ""}`}
                delay={index * 60}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  width="180"
                  height="56"
                  className={`${client.logoClass ?? "max-h-10"} max-w-full w-auto object-contain ${
                    client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
