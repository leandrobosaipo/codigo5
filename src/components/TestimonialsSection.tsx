import { motion } from "framer-motion";
import { clients, portfolioClients } from "@/content/siteContent";

const TestimonialsSection = () => {
  const normalizeSegment = (segment: string) => {
    const label = segment.toLowerCase();

    if (/(midia|portal|noticias|jornal|editorial|entretenimento)/.test(label)) return "Midia e conteudo";
    if (/(saude|vascular|instituto)/.test(label)) return "Saude e bem-estar";
    if (/(industria|mineral|construcao|concreto)/.test(label)) return "Industria e construcao";
    if (/(varejo|instrumentos|limpeza|nutricao)/.test(label)) return "Varejo e distribuicao";
    if (/(instituicao|conselho|igreja|social)/.test(label)) return "Institucional";
    if (/(advocacia|credito)/.test(label)) return "Servicos profissionais";
    if (/(turismo|eventos|buffet)/.test(label)) return "Turismo e eventos";

    return "Outros segmentos";
  };

  const segmentCounts = portfolioClients.reduce<Record<string, number>>((acc, client) => {
    const group = normalizeSegment(client.segment);
    acc[group] = (acc[group] ?? 0) + 1;
    return acc;
  }, {});

  const highlightSegments = Object.entries(segmentCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const anchorClientNames = [
    "Axis Construcoes",
    "Clinica Petterle",
    "Portal 163",
    "Perrengue Mato Grosso",
    "CREF17/MT",
    "Franca & Moraes",
  ];

  const anchorClients = anchorClientNames
    .map((name) => portfolioClients.find((client) => client.name === name))
    .filter(Boolean);

  const supportingClients = clients.filter(
    (client) => !anchorClientNames.includes(client.name),
  );

  const segmentSamples = Object.entries(
    portfolioClients.reduce<Record<string, string[]>>((acc, client) => {
      const group = normalizeSegment(client.segment);
      acc[group] = [...(acc[group] ?? []), client.name];
      return acc;
    }, {}),
  ).reduce<Record<string, string[]>>((acc, [segment, names]) => {
    acc[segment] = names.slice(0, 3);
    return acc;
  }, {});

  const brandSurfaceClass = (surface?: string) => {
    if (surface === "dark") return "border-slate-900/85 bg-[radial-gradient(circle_at_top,#2b3240,#09090b_62%)]";
    if (surface === "sand") return "border-amber-200 bg-[linear-gradient(135deg,#fff7e7,#f0dfba)]";
    return "border-border/70 bg-white";
  };

  return (
    <section id="clientes" className="py-24">
      <div className="container space-y-14">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Clientes e experiencia</span>
          <h2 className="mt-3 mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Marcas reais para mostrar repertorio antes da reuniao
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            Quando o portfolio aparece com clareza, a experiencia fica mais facil de perceber.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-4">
          {highlightSegments.map(([segment, count]) => (
            <div
              key={segment}
              className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,243,235,0.88))] p-5 shadow-[0_24px_60px_-48px_rgba(30,25,20,0.38)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Segmento recorrente
              </p>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight text-foreground">
                {segment}
              </p>
              <p className="mt-3 text-sm font-medium text-foreground/72">{count} marcas no portfolio</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(segmentSamples[segment] ?? []).map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-border/80 bg-white/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] border border-border bg-card p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Marcas ancora
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
                Alguns nomes que ajudam a ler esse portfolio mais rapido
              </h3>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {anchorClients.map((client, index) => (
              <motion.div
                key={client.name}
                className="rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,243,234,0.88))] p-5 shadow-[0_24px_60px_-48px_rgba(30,25,20,0.45)] transition-transform duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <div
                  className={`flex min-h-[152px] items-center justify-center rounded-[24px] border px-6 py-6 shadow-[0_18px_40px_-32px_rgba(30,25,20,0.22)] ${brandSurfaceClass(client.surface)} ${client.frameClass ?? ""}`}
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
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{client.segment}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{client.name}</h3>
                <a
                  href={`https://${client.site}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex break-words text-sm font-medium text-foreground/70 transition hover:text-primary"
                >
                  {client.site}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-card p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Outras marcas
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
                Mais experiencias em mercados diferentes
              </h3>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {supportingClients.map((client, index) => (
              <motion.div
                key={client.name}
                className={`flex min-h-[108px] items-center justify-center rounded-3xl border px-6 py-5 shadow-[0_18px_40px_-32px_rgba(30,25,20,0.22)] transition-transform duration-300 hover:-translate-y-0.5 ${brandSurfaceClass(client.surface)} ${client.frameClass ?? ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
